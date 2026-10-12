/**
 * Demo Auth Service compatibility layer
 *
 * Forwards to localAuth now that remote backends (Supabase and Firebase)
 * have been decoupled.
 */

export * from './localAuth';

export interface DemoStudent {
  id: string;
  fullName: string;
  classGrade: string;
  schoolName: string;
  mobile: string;
  password: string;
  email: string;
  completedReflections: number;
  totalReflections: number;
  badge: string;
}

import {
  DEMO_STUDENT_ROSTER,
  loginAsDemoStudent as localLoginDemo,
  signOutLocalStudent,
  onLocalAuthChange,
  getCurrentActiveStudent,
  LocalStudentAccount,
} from './localAuth';

export const DEMO_STUDENTS: DemoStudent[] = DEMO_STUDENT_ROSTER.map((d) => ({
  id: d.id,
  fullName: d.fullName,
  classGrade: d.classGrade,
  schoolName: d.schoolName,
  mobile: d.phone,
  password: d.password || 'demo123',
  email: d.email || `${d.phone}@derote.in`,
  completedReflections: d.completedReflections || 0,
  totalReflections: d.totalReflections || 3,
  badge: d.badge || '',
}));

export function getActiveDemoStudent(): DemoStudent | null {
  const current = getCurrentActiveStudent();
  if (current && current.isDemo) {
    const match = DEMO_STUDENTS.find((s) => s.id === current.id);
    return match || null;
  }
  return null;
}

export function signOutDemoStudent(): void {
  signOutLocalStudent();
}

export function onDemoAuthChange(callback: (student: DemoStudent | null) => void): () => void {
  return onLocalAuthChange((account: LocalStudentAccount | null) => {
    if (account && account.isDemo) {
      const match = DEMO_STUDENTS.find((s) => s.id === account.id);
      callback(match || null);
    } else {
      callback(null);
    }
  });
}

export function verifyDemoCredentials(phone: string, pass: string): DemoStudent | null {
  const cleanPhone = phone.replace(/[^\d]/g, '').slice(-10);
  const matched = DEMO_STUDENTS.find((s) => s.mobile === cleanPhone && s.password === pass);
  return matched || null;
}
