/**
 * Admin Service for DeRote Student Insight System
 *
 * Manages Head of Department (HOD) and School Administrator access,
 * aggregate cohort analytics, and individual student response review.
 */

import { getStoredAccounts, LocalStudentAccount } from './localAuth';
import { QUESTION_BANK } from '../data/questionnaireBank';
import { QuestionnaireSession } from './questionnaireService';
import { generateStudentInsightReport, StudentInsightReport } from './insightEngine';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminAccount {
  id: string;
  fullName: string;
  roleTitle: string; // e.g. "Head of Department (HOD)"
  institution: string; // e.g. "Delhi Public School, R.K. Puram"
  email: string;
  avatarText?: string;
  isDemo?: boolean;
}

export interface StudentAdminRecord {
  id: string;
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone: string;
  isSubmitted: boolean;
  answeredCount: number;
  totalQuestions: number;
  lastActive: string;
  session: QuestionnaireSession;
  insightReport: StudentInsightReport;
}

export interface CohortAnalytics {
  totalStudents: number;
  completedAssessments: number;
  inProgressAssessments: number;
  completionRate: number;
  classBreakdown: {
    class8: number;
    class9: number;
    class10: number;
  };
  topDrawsInActivities: { label: string; count: number; percentage: number }[];
  topStarterConditions: { label: string; count: number; percentage: number }[];
  topGroupWorkConditions: { label: string; count: number; percentage: number }[];
  topTeacherGuidanceWishes: { label: string; count: number; percentage: number }[];
}

const ADMIN_SESSION_KEY = 'derote_active_admin_session_v1';
const LOCAL_DRAFT_KEY = 'derote_questionnaire_draft_v1';

export const PRIMARY_ADMIN_UID = 'HRmNP5WPw5fXtihxIVB2nkcCTkz1';

export const ADMIN_ACCOUNT: AdminAccount = {
  id: PRIMARY_ADMIN_UID,
  fullName: 'Dr. Rajesh Kulkarni',
  roleTitle: 'Head of Department & Academic Coordinator',
  institution: 'Delhi Public School, R.K. Puram',
  email: 'admin@derote.in',
  avatarText: 'AD',
  isDemo: false,
};

export const DEMO_ADMIN_ACCOUNT = ADMIN_ACCOUNT;

export function isSuperAdminId(idOrEmailOrPhone: string | null | undefined): boolean {
  if (!idOrEmailOrPhone) return false;
  const raw = idOrEmailOrPhone.trim();
  const lower = raw.toLowerCase();
  return (
    raw === PRIMARY_ADMIN_UID ||
    lower === PRIMARY_ADMIN_UID.toLowerCase() ||
    lower === 'admin@derote.in' ||
    lower === 'contact@derote.in' ||
    lower === 'rajesh.kulkarni@derote.in'
  );
}

export const ADMIN_AUTH_STATE_EVENT = 'derote_admin_auth_changed';

/**
 * Updates admin session in localStorage and broadcasts custom events
 */
export function setAdminSession(admin: AdminAccount | null): void {
  try {
    if (admin) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.warn('Failed to update admin session in storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(ADMIN_AUTH_STATE_EVENT, {
        detail: { admin },
      })
    );
  }
}

/**
 * Subscribes to admin auth state changes
 */
export function onAdminAuthChange(callback: (admin: AdminAccount | null) => void): () => void {
  callback(getCurrentAdmin());

  const handler = (event: Event) => {
    const custom = event as CustomEvent<{ admin: AdminAccount | null }>;
    if (custom.detail !== undefined) {
      callback(custom.detail.admin);
    } else {
      callback(getCurrentAdmin());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === ADMIN_SESSION_KEY) {
      callback(getCurrentAdmin());
    }
  };

  window.addEventListener(ADMIN_AUTH_STATE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(ADMIN_AUTH_STATE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Retrieves the currently logged in admin session
 */
export function getCurrentAdmin(): AdminAccount | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Logs in admin using credentials
 */
export function loginAdmin(emailOrId: string, pass: string): { success: boolean; error?: string; admin?: AdminAccount } {
  const clean = emailOrId.trim();
  const lower = clean.toLowerCase();

  // Primary Super Admin check by UID, official admin email, or contact email
  if (
    clean === PRIMARY_ADMIN_UID ||
    lower === PRIMARY_ADMIN_UID.toLowerCase() ||
    ((lower === 'admin@derote.in' || lower === 'rajesh.kulkarni@derote.in' || lower === 'contact@derote.in') && (pass === 'admin123' || pass.length >= 4))
  ) {
    setAdminSession(ADMIN_ACCOUNT);
    return { success: true, admin: ADMIN_ACCOUNT };
  }

  // Institutional administrator accounts
  if ((lower.includes('admin') || clean.length >= 20) && pass.length >= 4) {
    const customAdmin: AdminAccount = {
      id: clean.length >= 20 ? clean : `admin_${Date.now()}`,
      fullName: 'School Administrator',
      roleTitle: 'Institutional Coordinator',
      institution: 'DeRote Partner School',
      email: lower.includes('@') ? lower : `${clean}@admin.derote.in`,
      avatarText: 'SA',
      isDemo: false,
    };
    setAdminSession(customAdmin);
    return { success: true, admin: customAdmin };
  }

  return {
    success: false,
    error: 'Invalid administrator email, User ID, or password. Please verify credentials with DeRote administration.',
  };
}

/**
 * Backward compatibility helper
 */
export function loginAsDemoAdmin(): AdminAccount {
  setAdminSession(ADMIN_ACCOUNT);
  return ADMIN_ACCOUNT;
}

/**
 * Sign out admin
 */
export function signOutAdmin(): void {
  setAdminSession(null);
}

/**
 * Gets all student records along with their sessions and reports
 */
export function getAllStudentAdminRecords(): StudentAdminRecord[] {
  const stored = getStoredAccounts();
  const allAccounts: LocalStudentAccount[] = [...stored];

  const records: StudentAdminRecord[] = [];

  for (const account of allAccounts) {
    let session: QuestionnaireSession | null = null;

    // Check localStorage for student draft
    try {
      const raw = localStorage.getItem(`${LOCAL_DRAFT_KEY}_${account.id}`);
      if (raw) {
        session = JSON.parse(raw);
      }
    } catch {
      // Ignore
    }

    if (!session) {
      session = {
        sessionId: `session_${account.id}`,
        studentId: account.id,
        version: 'v1_classes_8_10',
        status: 'draft',
        currentQuestionIndex: 0,
        answers: {},
        createdAt: account.createdAt || new Date().toISOString(),
        updatedAt: account.lastLoginAt || new Date().toISOString(),
      };
    }

    const answers = session.answers || {};
    const answeredCount = Object.values(answers).filter(
      (a) => a.status === 'answered' && a.selectedOptions && a.selectedOptions.length > 0
    ).length;

    const isSubmitted = session.status === 'submitted' || answeredCount === QUESTION_BANK.length;

    const insightReport = generateStudentInsightReport(
      session,
      account.fullName,
      account.classGrade
    );

    records.push({
      id: account.id,
      fullName: account.fullName,
      classGrade: account.classGrade,
      schoolName: account.schoolName,
      phone: account.phone,
      isSubmitted,
      answeredCount,
      totalQuestions: QUESTION_BANK.length,
      lastActive: session.updatedAt || session.createdAt || 'Recent',
      session,
      insightReport,
    });
  }

  return records;
}

/**
 * Fetches all student records from Firestore (permitted for Admin UID HRmNP5WPw5fXtihxIVB2nkcCTkz1)
 */
export async function fetchStudentAdminRecordsFromFirestore(): Promise<StudentAdminRecord[]> {
  const localRecords = getAllStudentAdminRecords();
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const firestoreRecords: StudentAdminRecord[] = [];

    for (const studentDoc of studentsSnap.docs) {
      const data = studentDoc.data();
      const studentId = studentDoc.id;

      // Avoid duplicating accounts already present in local records
      if (localRecords.some((r) => r.id === studentId)) {
        continue;
      }

      let session: QuestionnaireSession | null = null;
      try {
        // Fetch session from Firestore subcollection
        const sessionsSnap = await getDocs(collection(db, 'students', studentId, 'sessions'));
        if (!sessionsSnap.empty) {
          const firstSess = sessionsSnap.docs[0].data();
          session = firstSess as QuestionnaireSession;
        }
      } catch {
        // Fallback if session fetch not present
      }

      if (!session) {
        session = {
          sessionId: `session_${studentId}`,
          studentId: studentId,
          version: 'v1_classes_8_10',
          status: 'draft',
          currentQuestionIndex: 0,
          answers: {},
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.lastLoginAt || new Date().toISOString(),
        };
      }

      const answers = session.answers || {};
      const answeredCount = Object.values(answers).filter(
        (a) => a.status === 'answered' && a.selectedOptions && a.selectedOptions.length > 0
      ).length;

      const isSubmitted = session.status === 'submitted' || answeredCount === QUESTION_BANK.length;
      const insightReport = generateStudentInsightReport(
        session,
        data.fullName || 'Student',
        data.classGrade || '10'
      );

      firestoreRecords.push({
        id: studentId,
        fullName: data.fullName || 'Student',
        classGrade: data.classGrade || 'Class 10',
        schoolName: data.schoolName || 'School',
        phone: data.phone || 'XXXXXXXXXX',
        isSubmitted,
        answeredCount,
        totalQuestions: QUESTION_BANK.length,
        lastActive: session.updatedAt || session.createdAt || 'Recent',
        session,
        insightReport,
      });
    }

    return [...localRecords, ...firestoreRecords];
  } catch (err) {
    console.warn('Firestore admin records fetch fallback to local:', err);
    return localRecords;
  }
}

/**
 * Calculates aggregated cohort analytics
 */
export function calculateCohortAnalytics(records: StudentAdminRecord[]): CohortAnalytics {
  const totalStudents = records.length;
  const completed = records.filter((r) => r.isSubmitted).length;
  const inProgress = totalStudents - completed;
  const completionRate = totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0;

  const classBreakdown = {
    class8: records.filter((r) => r.classGrade.includes('8')).length,
    class9: records.filter((r) => r.classGrade.includes('9')).length,
    class10: records.filter((r) => r.classGrade.includes('10')).length,
  };

  // Activity frequency tracking
  const drawOptionsCount: Record<string, number> = {};
  const startOptionsCount: Record<string, number> = {};
  const groupOptionsCount: Record<string, number> = {};
  const teacherOptionsCount: Record<string, number> = {};

  records.forEach((rec) => {
    const answers = rec.session.answers || {};

    // B2: Exhibition project options
    const b2 = answers['B2'];
    if (b2 && b2.selectedOptions) {
      b2.selectedOptions.forEach((optId) => {
        const qDef = QUESTION_BANK.find((q) => q.id === 'B2');
        const opt = qDef?.options.find((o) => o.id === optId);
        if (opt && !opt.isExclusive && !opt.isCustom) {
          drawOptionsCount[opt.text] = (drawOptionsCount[opt.text] || 0) + 1;
        }
      });
    }

    // B11: What helps get started
    const b11 = answers['B11'];
    if (b11 && b11.selectedOptions) {
      b11.selectedOptions.forEach((optId) => {
        const qDef = QUESTION_BANK.find((q) => q.id === 'B11');
        const opt = qDef?.options.find((o) => o.id === optId);
        if (opt && !opt.isExclusive && !opt.isCustom) {
          startOptionsCount[opt.text] = (startOptionsCount[opt.text] || 0) + 1;
        }
      });
    }

    // B9: Group work conditions
    const b9 = answers['B9'];
    if (b9 && b9.selectedOptions) {
      b9.selectedOptions.forEach((optId) => {
        const qDef = QUESTION_BANK.find((q) => q.id === 'B9');
        const opt = qDef?.options.find((o) => o.id === optId);
        if (opt && !opt.isExclusive && !opt.isCustom) {
          groupOptionsCount[opt.text] = (groupOptionsCount[opt.text] || 0) + 1;
        }
      });
    }

    // B15: What would you like teachers to understand
    const b15 = answers['B15'];
    if (b15 && b15.selectedOptions) {
      b15.selectedOptions.forEach((optId) => {
        const qDef = QUESTION_BANK.find((q) => q.id === 'B15');
        const opt = qDef?.options.find((o) => o.id === optId);
        if (opt && !opt.isExclusive && !opt.isCustom) {
          teacherOptionsCount[opt.text] = (teacherOptionsCount[opt.text] || 0) + 1;
        }
      });
    }
  });

  const toSortedArray = (dict: Record<string, number>, total: number) => {
    return Object.entries(dict)
      .map(([label, count]) => ({
        label,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  return {
    totalStudents,
    completedAssessments: completed,
    inProgressAssessments: inProgress,
    completionRate,
    classBreakdown,
    topDrawsInActivities: toSortedArray(drawOptionsCount, totalStudents),
    topStarterConditions: toSortedArray(startOptionsCount, totalStudents),
    topGroupWorkConditions: toSortedArray(groupOptionsCount, totalStudents),
    topTeacherGuidanceWishes: toSortedArray(teacherOptionsCount, totalStudents),
  };
}
