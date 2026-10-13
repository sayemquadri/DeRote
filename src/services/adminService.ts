/**
 * Admin Service for DeRote Student Insight System
 *
 * Manages Head of Department (HOD) and School Administrator access,
 * aggregate cohort analytics, and individual student response review.
 */

import { DEMO_STUDENT_ROSTER, getStoredAccounts, LocalStudentAccount } from './localAuth';
import { QUESTION_BANK } from '../data/questionnaireBank';
import { QuestionnaireSession, QuestionAnswerState } from './questionnaireService';
import { generateStudentInsightReport, StudentInsightReport } from './insightEngine';

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

export const DEMO_ADMIN_ACCOUNT: AdminAccount = {
  id: 'admin_demo_rajesh',
  fullName: 'Dr. Rajesh Kulkarni',
  roleTitle: 'Head of Department & Academic Coordinator',
  institution: 'Delhi Public School, R.K. Puram',
  email: 'admin@derote.in',
  avatarText: 'RK',
  isDemo: true,
};

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
export function loginAdmin(email: string, pass: string): { success: boolean; error?: string; admin?: AdminAccount } {
  const cleanEmail = email.trim().toLowerCase();
  if (
    (cleanEmail === 'admin@derote.in' || cleanEmail === 'rajesh.kulkarni@derote.in') &&
    pass === 'admin123'
  ) {
    setAdminSession(DEMO_ADMIN_ACCOUNT);
    return { success: true, admin: DEMO_ADMIN_ACCOUNT };
  }

  // Also support universal admin credentials for demo
  if (cleanEmail.includes('admin') && pass.length >= 6) {
    const customAdmin: AdminAccount = {
      id: `admin_${Date.now()}`,
      fullName: 'School Administrator',
      roleTitle: 'Institutional Coordinator',
      institution: 'DeRote Partner School',
      email: cleanEmail,
      avatarText: 'SA',
    };
    setAdminSession(customAdmin);
    return { success: true, admin: customAdmin };
  }

  return {
    success: false,
    error: 'Invalid administrator email or password. Use demo account or admin@derote.in / admin123.',
  };
}

/**
 * 1-Click Instant Demo Admin Login
 */
export function loginAsDemoAdmin(): AdminAccount {
  setAdminSession(DEMO_ADMIN_ACCOUNT);
  return DEMO_ADMIN_ACCOUNT;
}

/**
 * Sign out admin
 */
export function signOutAdmin(): void {
  setAdminSession(null);
}

/**
 * Pre-seeded realistic mock answers for demo roster students to populate the admin dashboard
 */
function getPreseededAnswersForStudent(studentId: string): Record<string, QuestionAnswerState> {
  if (studentId === 'demo_aarav_10') {
    return {
      B1: { status: 'answered', selectedOptions: ['b1_1', 'b1_2'], customText: '' },
      B3: { status: 'answered', selectedOptions: ['b3_1'], customText: '' },
      B2: { status: 'answered', selectedOptions: ['b2_1', 'b2_2'], customText: '' },
      B8: { status: 'answered', selectedOptions: ['b8_3'], customText: '' },
      B9: { status: 'answered', selectedOptions: ['b9_1', 'b9_4', 'b9_6'], customText: '' },
      B4: { status: 'answered', selectedOptions: ['b4_5'], customText: '' },
      B6: { status: 'answered', selectedOptions: ['b6_1'], customText: '' },
      B10: { status: 'answered', selectedOptions: ['b10_1'], customText: '' },
      B11: { status: 'answered', selectedOptions: ['b11_1', 'b11_3'], customText: '' },
      B12: { status: 'answered', selectedOptions: ['b12_B', 'b12_D'], customText: '' },
      B7: { status: 'answered', selectedOptions: ['b7_1', 'b7_5'], customText: '' },
      B13: { status: 'answered', selectedOptions: ['b13_3'], customText: '' },
      B14: { status: 'answered', selectedOptions: ['b14_4', 'b14_2'], customText: '' },
      B15: { status: 'answered', selectedOptions: ['b15_2'], customText: '' },
    };
  }

  if (studentId === 'demo_ananya_09') {
    return {
      B1: { status: 'answered', selectedOptions: ['b1_3', 'b1_4'], customText: '' },
      B3: { status: 'answered', selectedOptions: ['b3_4'], customText: '' },
      B2: { status: 'answered', selectedOptions: ['b2_3', 'b2_7'], customText: '' },
      B8: { status: 'answered', selectedOptions: ['b8_4'], customText: '' },
      B9: { status: 'answered', selectedOptions: ['b9_4', 'b9_7'], customText: '' },
      B4: { status: 'answered', selectedOptions: ['b4_3'], customText: '' },
      B6: { status: 'answered', selectedOptions: ['b6_3'], customText: '' },
      B10: { status: 'answered', selectedOptions: ['b10_5'], customText: '' },
      B11: { status: 'answered', selectedOptions: ['b11_2', 'b11_5'], customText: '' },
      B12: { status: 'answered', selectedOptions: ['b12_A', 'b12_E'], customText: '' },
      B7: { status: 'answered', selectedOptions: ['b7_2', 'b7_6'], customText: '' },
      B13: { status: 'answered', selectedOptions: ['b13_2'], customText: '' },
      B14: { status: 'answered', selectedOptions: ['b14_1', 'b14_6'], customText: '' },
      B15: { status: 'answered', selectedOptions: ['b15_6'], customText: '' },
    };
  }

  if (studentId === 'demo_rohan_08') {
    return {
      B1: { status: 'answered', selectedOptions: ['b1_1', 'b1_6'], customText: '' },
      B3: { status: 'answered', selectedOptions: ['b3_2'], customText: '' },
      B2: { status: 'answered', selectedOptions: ['b2_1', 'b2_5'], customText: '' },
      B8: { status: 'answered', selectedOptions: ['b8_1'], customText: '' },
      B9: { status: 'answered', selectedOptions: ['b9_1', 'b9_5'], customText: '' },
      B4: { status: 'answered', selectedOptions: ['b4_2'], customText: '' },
      B6: { status: 'answered', selectedOptions: ['b6_4'], customText: '' },
      B10: { status: 'answered', selectedOptions: ['b10_2'], customText: '' },
      B11: { status: 'answered', selectedOptions: ['b11_1', 'b11_6'], customText: '' },
      B12: { status: 'answered', selectedOptions: ['b12_B'], customText: '' },
      B7: { status: 'answered', selectedOptions: ['b7_1'], customText: '' },
      B13: { status: 'answered', selectedOptions: ['b13_1'], customText: '' },
      B14: { status: 'answered', selectedOptions: ['b14_3'], customText: '' },
      B15: { status: 'answered', selectedOptions: ['b15_1'], customText: '' },
    };
  }

  return {};
}

/**
 * Gets all student records along with their sessions and reports
 */
export function getAllStudentAdminRecords(): StudentAdminRecord[] {
  const stored = getStoredAccounts();
  const allAccounts: LocalStudentAccount[] = [...DEMO_STUDENT_ROSTER];

  stored.forEach((acc) => {
    if (!allAccounts.some((a) => a.id === acc.id)) {
      allAccounts.push(acc);
    }
  });

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

    // If no draft in storage, use preseeded demo answers
    if (!session || Object.keys(session.answers || {}).length === 0) {
      const preseededAnswers = getPreseededAnswersForStudent(account.id);
      const isPreseeded = Object.keys(preseededAnswers).length > 0;

      session = {
        sessionId: `session_${account.id}`,
        studentId: account.id,
        version: 'v1_classes_8_10',
        status: isPreseeded ? 'submitted' : 'draft',
        currentQuestionIndex: isPreseeded ? 14 : 0,
        answers: preseededAnswers,
        createdAt: account.createdAt || new Date().toISOString(),
        updatedAt: account.lastLoginAt || new Date().toISOString(),
        submittedAt: isPreseeded ? account.lastLoginAt || new Date().toISOString() : undefined,
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
