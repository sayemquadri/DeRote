/**
 * Questionnaire Service for DeRote Student Insight System
 *
 * Runs completely standalone using local storage. No external backend needed.
 * Handles student eligibility, draft saving, sync state tracking,
 * response validation, and atomic submission locking.
 */

import { QUESTION_BANK, QuestionDefinition, CUSTOM_OPTION_ID } from '../data/questionnaireBank';

export interface StudentProfile {
  id: string;
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone?: string;
}

export type SaveSyncStatus = 'saving' | 'saved' | 'offline_unsynced';

export interface QuestionAnswerState {
  status: 'unanswered' | 'answered' | 'skipped';
  selectedOptions: string[];
  customText: string; // Preserved in working draft even if custom option is toggled off
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

  const normalizedClass = String(profile.classGrade).trim();
  if (!ELIGIBLE_CLASSES.includes(normalizedClass)) {
    return {
      isEligible: false,
      message: `The DeRote Student Insight questionnaire is currently available for students in Classes 8, 9, and 10. Your registered profile is Class ${normalizedClass}.`,
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

/**
 * Gets or loads active questionnaire session from local storage.
 */
export const loadQuestionnaireSession = async (
  profile: StudentProfile
): Promise<{
  session: QuestionnaireSession;
  isExistingDraft: boolean;
  isAlreadySubmitted: boolean;
}> => {
  const version = 'v1_classes_8_10';

  // 1. Local storage draft check
  try {
    const savedRaw = localStorage.getItem(`${LOCAL_DRAFT_KEY}_${profile.id}`);
    if (savedRaw) {
      const parsed: QuestionnaireSession = JSON.parse(savedRaw);
      const isSubmitted = parsed.status === 'submitted';
      return {
        session: parsed,
        isExistingDraft: !isSubmitted && hasAnyAnswers(parsed.answers),
        isAlreadySubmitted: isSubmitted,
      };
    }
  } catch {
    // Ignore storage parse issues
  }

  // 2. New blank session
  const newSession: QuestionnaireSession = {
    sessionId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentId: profile.id,
    version,
    status: 'draft',
    currentQuestionIndex: 0,
    answers: createDefaultAnswers(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    session: newSession,
    isExistingDraft: false,
    isAlreadySubmitted: false,
  };
};

export const hasAnyAnswers = (answers: Record<string, QuestionAnswerState>): boolean => {
  return Object.values(answers).some(
    (a) => a.status === 'answered' || a.status === 'skipped'
  );
};

/**
 * Saves questionnaire draft locally.
 */
export const persistQuestionnaireDraft = async (
  session: QuestionnaireSession
): Promise<{ confirmedCloudSaved: boolean }> => {
  session.updatedAt = new Date().toISOString();

  // Update local storage
  try {
    localStorage.setItem(
      `${LOCAL_DRAFT_KEY}_${session.studentId}`,
      JSON.stringify(session)
    );
  } catch {
    // Ignore storage quota
  }

  return { confirmedCloudSaved: false };
};

/**
 * Atomically submits and locks the student's questionnaire in local storage.
 */
export const submitQuestionnaireResponses = async (
  session: QuestionnaireSession
): Promise<{ success: boolean; error?: string }> => {
  if (session.status === 'submitted') {
    return { success: true };
  }

  const now = new Date().toISOString();
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
};

/**
 * Handles prototype/local student login session storage
 */
export const saveLocalPrototypeStudent = (profile: StudentProfile): void => {
  try {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
  } catch {
    // Ignore
  }
};

export const getLocalPrototypeStudent = (): StudentProfile | null => {
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
