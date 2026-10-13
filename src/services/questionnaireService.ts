/**
 * Questionnaire Service for DeRote Student Insight System
 *
 * Connected directly to Cloud Firestore:
 * - Real questionnaire sessions persisted under /students/{studentId}/sessions/{sessionId}
 * - Real draft auto-saving to Firestore with local cache for offline resilience
 * - Atomic submission locking enforced both in client and by Firestore Security Rules
 * - Honest error reporting: never claims submission succeeded if Firestore write fails
 */

import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { QUESTION_BANK, QuestionDefinition, CUSTOM_OPTION_ID } from '../data/questionnaireBank';

export interface StudentProfile {
  id: string; // Firebase UID
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone?: string;
}

export type SaveSyncStatus = 'saving' | 'saved' | 'offline_unsynced';

export interface QuestionAnswerState {
  status: 'unanswered' | 'answered' | 'skipped';
  selectedOptions: string[];
  customText: string;
}

export interface QuestionnaireSession {
  sessionId: string;
  studentId: string;
  version: string; // 'v1_classes_8_10'
  status: 'draft' | 'submitted';
  currentQuestionIndex: number;
  answers: Record<string, QuestionAnswerState>;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

const LOCAL_SESSION_KEY = 'derote_student_session_v1';
const LOCAL_DRAFT_KEY = 'derote_questionnaire_draft_v1';

export const ELIGIBLE_CLASSES = ['8', '9', '10'];

/**
 * Checks if the student is eligible for the Classes 8-10 questionnaire.
 */
export const checkStudentEligibility = (profile: StudentProfile | null): {
  isEligible: boolean;
  message?: string;
} => {
  if (!profile) {
    return {
      isEligible: false,
      message: 'Please sign in with your student account to access the questionnaire.',
    };
  }

  const normalizedClass = String(profile.classGrade).replace(/[^\d]/g, '').trim();
  if (!ELIGIBLE_CLASSES.includes(normalizedClass)) {
    return {
      isEligible: false,
      message: `The DeRote Student Insight questionnaire is currently available for students in Classes 8, 9, and 10. Your registered profile is Class ${profile.classGrade}.`,
    };
  }

  return { isEligible: true };
};

/**
 * Creates a default blank answers map for all 14 questions.
 */
export const createDefaultAnswers = (): Record<string, QuestionAnswerState> => {
  const answers: Record<string, QuestionAnswerState> = {};
  for (const q of QUESTION_BANK) {
    answers[q.id] = {
      status: 'unanswered',
      selectedOptions: [],
      customText: '',
    };
  }
  return answers;
};

export const hasAnyAnswers = (answers: Record<string, QuestionAnswerState>): boolean => {
  return Object.values(answers).some(
    (a) => a.status === 'answered' || a.status === 'skipped'
  );
};

/**
 * Gets or loads active questionnaire session from Cloud Firestore and local storage.
 */
export const loadQuestionnaireSession = async (
  profile: StudentProfile
): Promise<{
  session: QuestionnaireSession;
  isExistingDraft: boolean;
  isAlreadySubmitted: boolean;
}> => {
  const version = 'v1_classes_8_10';

  // 1. First, check Cloud Firestore for this student's most recent session
  try {
    const sessionsRef = collection(db, 'students', profile.id, 'sessions');
    const sessionsQuery = query(sessionsRef, orderBy('updatedAt', 'desc'), limit(1));
    const querySnapshot = await getDocs(sessionsQuery);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data() as QuestionnaireSession;
      const isSubmitted = docData.status === 'submitted';

      // Cache locally
      try {
        localStorage.setItem(`${LOCAL_DRAFT_KEY}_${profile.id}`, JSON.stringify(docData));
      } catch {
        // Ignore local storage error
      }

      return {
        session: docData,
        isExistingDraft: !isSubmitted && hasAnyAnswers(docData.answers || {}),
        isAlreadySubmitted: isSubmitted,
      };
    }
  } catch (err) {
    console.warn('Could not query Firestore sessions, falling back to local storage cache:', err);
  }

  // 2. Try local storage draft cache if Firestore was offline or empty
  let localDraft: QuestionnaireSession | null = null;
  try {
    const savedRaw = localStorage.getItem(`${LOCAL_DRAFT_KEY}_${profile.id}`);
    if (savedRaw) {
      localDraft = JSON.parse(savedRaw);
    }
  } catch {
    // Ignore storage parse issues
  }

  if (localDraft && localDraft.studentId === profile.id) {
    const isSubmitted = localDraft.status === 'submitted';
    return {
      session: localDraft,
      isExistingDraft: !isSubmitted && hasAnyAnswers(localDraft.answers || {}),
      isAlreadySubmitted: isSubmitted,
    };
  }

  // 3. New blank session initialized for this student
  const now = new Date().toISOString();
  // Safe alphanumeric sessionId satisfying isValidId rule: ^[a-zA-Z0-9_\-]+$
  const safeSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const newSession: QuestionnaireSession = {
    sessionId: safeSessionId,
    studentId: profile.id,
    version,
    status: 'draft',
    currentQuestionIndex: 0,
    answers: createDefaultAnswers(),
    createdAt: now,
    updatedAt: now,
  };

  // Try creating initial draft in Firestore
  try {
    const sessionDocRef = doc(db, 'students', profile.id, 'sessions', safeSessionId);
    await setDoc(sessionDocRef, {
      sessionId: newSession.sessionId,
      studentId: newSession.studentId,
      version: newSession.version,
      status: newSession.status,
      currentQuestionIndex: newSession.currentQuestionIndex,
      answers: newSession.answers,
      createdAt: newSession.createdAt,
      updatedAt: newSession.updatedAt,
    });
  } catch (err) {
    console.warn('Initial session doc creation notice:', err);
  }

  // Cache locally
  try {
    localStorage.setItem(`${LOCAL_DRAFT_KEY}_${profile.id}`, JSON.stringify(newSession));
  } catch {
    // Ignore storage quota
  }

  return {
    session: newSession,
    isExistingDraft: false,
    isAlreadySubmitted: false,
  };
};

/**
 * Resets the student's questionnaire session by creating a fresh draft in Firestore and clearing stored cache.
 */
export const resetQuestionnaireSession = async (
  profile: StudentProfile
): Promise<QuestionnaireSession> => {
  const version = 'v1_classes_8_10';
  const key = `${LOCAL_DRAFT_KEY}_${profile.id}`;

  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }

  const now = new Date().toISOString();
  const safeSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const freshSession: QuestionnaireSession = {
    sessionId: safeSessionId,
    studentId: profile.id,
    version,
    status: 'draft',
    currentQuestionIndex: 0,
    answers: createDefaultAnswers(),
    createdAt: now,
    updatedAt: now,
  };

  try {
    const sessionDocRef = doc(db, 'students', profile.id, 'sessions', safeSessionId);
    await setDoc(sessionDocRef, {
      sessionId: freshSession.sessionId,
      studentId: freshSession.studentId,
      version: freshSession.version,
      status: freshSession.status,
      currentQuestionIndex: freshSession.currentQuestionIndex,
      answers: freshSession.answers,
      createdAt: freshSession.createdAt,
      updatedAt: freshSession.updatedAt,
    });
  } catch (err) {
    console.warn('Fresh session doc creation notice:', err);
  }

  try {
    localStorage.setItem(key, JSON.stringify(freshSession));
  } catch {
    // Ignore storage errors
  }

  return freshSession;
};

/**
 * Saves questionnaire draft directly to Cloud Firestore (/students/{id}/sessions/{sessionId})
 * and updates local cache.
 */
export const persistQuestionnaireDraft = async (
  session: QuestionnaireSession
): Promise<{ confirmedCloudSaved: boolean; error?: string }> => {
  session.updatedAt = new Date().toISOString();

  // Update local storage cache
  try {
    localStorage.setItem(
      `${LOCAL_DRAFT_KEY}_${session.studentId}`,
      JSON.stringify(session)
    );
  } catch {
    // Ignore storage quota
  }

  let confirmedCloudSaved = false;
  let cloudError: string | undefined;

  try {
    const sessionDocRef = doc(db, 'students', session.studentId, 'sessions', session.sessionId);
    await setDoc(sessionDocRef, {
      sessionId: session.sessionId,
      studentId: session.studentId,
      version: session.version,
      status: session.status,
      currentQuestionIndex: session.currentQuestionIndex,
      answers: session.answers,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
    confirmedCloudSaved = true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Firestore session draft sync warning:', err);
    cloudError = message;
  }

  return { confirmedCloudSaved, error: cloudError };
};

/**
 * Atomically submits and locks the student's questionnaire in Cloud Firestore.
 * Honest error handling: if Firestore write fails, does not report false success,
 * and preserves answers so the student can retry.
 */
export const submitQuestionnaireResponses = async (
  session: QuestionnaireSession
): Promise<{ success: boolean; error?: string }> => {
  if (session.status === 'submitted') {
    return { success: true };
  }

  const now = new Date().toISOString();

  // Create clone with submitted attributes
  const submittedPayload = {
    sessionId: session.sessionId,
    studentId: session.studentId,
    version: session.version,
    status: 'submitted' as const,
    currentQuestionIndex: session.currentQuestionIndex,
    answers: session.answers,
    createdAt: session.createdAt,
    updatedAt: now,
    submittedAt: now,
  };

  try {
    // 1. Submit to Cloud Firestore
    const sessionDocRef = doc(db, 'students', session.studentId, 'sessions', session.sessionId);
    await setDoc(sessionDocRef, submittedPayload);

    // 2. Update student profile completedReflections in Firestore
    try {
      const studentDocRef = doc(db, 'students', session.studentId);
      await updateDoc(studentDocRef, {
        completedReflections: 1,
        lastLoginAt: now,
      });
    } catch {
      // Non-fatal if counter update fails
    }

    // 3. Update session object and local storage ONLY after cloud success
    session.status = 'submitted';
    session.submittedAt = now;
    session.updatedAt = now;

    try {
      localStorage.setItem(
        `${LOCAL_DRAFT_KEY}_${session.studentId}`,
        JSON.stringify(session)
      );
    } catch {
      // Ignore storage issues
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database write failed.';
    console.error('Firestore submission error:', err);
    return {
      success: false,
      error: `Failed to save responses to Firebase (${message}). Your answers have been preserved—please check your connection and try submitting again.`,
    };
  }
};

/**
 * Handles student session profile cache
 */
export const saveActiveStudentProfile = (profile: StudentProfile): void => {
  try {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
  } catch {
    // Ignore
  }
};

export const getActiveStudentProfile = (): StudentProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearStudentSession = (): void => {
  try {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  } catch {
    // Ignore
  }
};
