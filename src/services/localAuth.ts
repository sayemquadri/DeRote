/**
 * Student Authentication & Profile Service for DeRote Student Insight System
 *
 * Connected directly to Firebase Authentication & Cloud Firestore:
 * - Genuine Firebase Authentication (Email/Password with student credentials)
 * - Automatic session persistence and restoration across refreshes
 * - Student profile records persisted in Cloud Firestore (/students/{uid})
 * - Strict student-level ownership enforced by Firestore Security Rules
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  saveActiveStudentProfile,
  clearStudentSession,
  StudentProfile,
} from './questionnaireService';

export interface LocalStudentAccount {
  id: string; // Firebase UID
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone: string;
  email?: string;
  completedReflections?: number;
  totalReflections?: number;
  badge?: string;
  createdAt: string;
  lastLoginAt: string;
}

const ACTIVE_USER_SESSION_KEY = 'derote_active_student_session_v1';
const AUTH_STATE_EVENT = 'derote_student_auth_changed';

/**
 * Normalizes Indian mobile number to 10 digits
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function isValidIndianMobile(raw: string): boolean {
  const digits = normalizePhone(raw);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

/**
 * Derives the unique authentication email used in Firebase Auth for a student's mobile number.
 */
export function getStudentAuthEmail(phone: string): string {
  const cleanPhone = normalizePhone(phone);
  return `${cleanPhone}@student.derote.in`;
}

/**
 * Gets currently active session student from cache
 */
export function getCurrentActiveStudent(): LocalStudentAccount | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalStudentAccount;
  } catch {
    return null;
  }
}

/**
 * Sets current active session student in cache and broadcasts events
 */
export function setActiveStudentSession(student: LocalStudentAccount | null): void {
  try {
    if (student) {
      localStorage.setItem(ACTIVE_USER_SESSION_KEY, JSON.stringify(student));
      const profile: StudentProfile = {
        id: student.id,
        fullName: student.fullName,
        classGrade: student.classGrade,
        schoolName: student.schoolName,
        phone: student.phone,
      };
      saveActiveStudentProfile(profile);
    } else {
      localStorage.removeItem(ACTIVE_USER_SESSION_KEY);
      clearStudentSession();
    }
  } catch (err) {
    console.warn('Failed to update student session storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(AUTH_STATE_EVENT, {
        detail: { student },
      })
    );
  }
}

/**
 * Genuine Firebase Authentication: Register Student Account
 */
export async function registerLocalStudent(data: {
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone: string;
  password: string;
  email?: string;
}): Promise<{ success: boolean; error?: string; student?: LocalStudentAccount }> {
  const cleanPhone = normalizePhone(data.phone);

  if (!isValidIndianMobile(cleanPhone)) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  if (!data.password || data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const authEmail = data.email && data.email.includes('@') ? data.email.trim().toLowerCase() : getStudentAuthEmail(cleanPhone);

  try {
    // 1. Create real Firebase Authentication account
    const userCredential = await createUserWithEmailAndPassword(auth, authEmail, data.password);
    const uid = userCredential.user.uid;

    // 2. Persist genuine student profile in Cloud Firestore (/students/{uid})
    const now = new Date().toISOString();
    const newAccount: LocalStudentAccount = {
      id: uid,
      fullName: data.fullName.trim(),
      classGrade: data.classGrade.trim(),
      schoolName: data.schoolName.trim(),
      phone: cleanPhone,
      email: authEmail,
      completedReflections: 0,
      totalReflections: 14,
      badge: `Class ${data.classGrade.trim()} Student`,
      createdAt: now,
      lastLoginAt: now,
    };

    await setDoc(doc(db, 'students', uid), {
      id: uid,
      fullName: newAccount.fullName,
      classGrade: newAccount.classGrade,
      schoolName: newAccount.schoolName,
      phone: newAccount.phone,
      email: newAccount.email,
      createdAt: now,
      lastLoginAt: now,
      completedReflections: 0,
      totalReflections: 14,
      badge: newAccount.badge,
    });

    setActiveStudentSession(newAccount);
    return { success: true, student: newAccount };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error('Firebase Student Registration Error:', error);

    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        error: 'An account with this mobile number already exists. Please sign in.',
      };
    }
    if (error.code === 'auth/weak-password') {
      return {
        success: false,
        error: 'Password is too weak. Please use at least 6 characters.',
      };
    }
    if (error.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network connection failed. Please check your internet connection.',
      };
    }

    return {
      success: false,
      error: error.message || 'Unable to create account in Firebase. Please try again.',
    };
  }
}

/**
 * Genuine Firebase Authentication: Sign in Student Account
 */
export async function loginLocalStudent(
  phone: string,
  pass: string
): Promise<{ success: boolean; error?: string; student?: LocalStudentAccount }> {
  const cleanPhone = normalizePhone(phone);

  if (!isValidIndianMobile(cleanPhone)) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  if (!pass) {
    return { success: false, error: 'Please enter your password.' };
  }

  const authEmail = getStudentAuthEmail(cleanPhone);

  try {
    // 1. Authenticate against Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, authEmail, pass);
    const uid = userCredential.user.uid;

    // 2. Fetch student profile from Cloud Firestore (/students/{uid})
    const docRef = doc(db, 'students', uid);
    const docSnap = await getDoc(docRef);

    let studentData: LocalStudentAccount;

    if (docSnap.exists()) {
      const remote = docSnap.data() as Partial<LocalStudentAccount>;
      studentData = {
        id: uid,
        fullName: remote.fullName || 'Student',
        classGrade: remote.classGrade || '10',
        schoolName: remote.schoolName || 'School',
        phone: remote.phone || cleanPhone,
        email: remote.email || authEmail,
        completedReflections: remote.completedReflections || 0,
        totalReflections: remote.totalReflections || 14,
        badge: remote.badge || `Class ${remote.classGrade || '10'} Student`,
        createdAt: remote.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // Update lastLoginAt in Firestore
      try {
        await updateDoc(docRef, { lastLoginAt: studentData.lastLoginAt });
      } catch {
        // Non-fatal if update timestamp fails
      }
    } else {
      // If Firestore profile document doesn't exist yet, construct from auth metadata
      studentData = {
        id: uid,
        fullName: 'Student',
        classGrade: '10',
        schoolName: 'Enrolled School',
        phone: cleanPhone,
        email: authEmail,
        completedReflections: 0,
        totalReflections: 14,
        badge: 'Class 10 Student',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      try {
        await setDoc(docRef, studentData);
      } catch (err) {
        console.warn('Could not backfill student doc in Firestore:', err);
      }
    }

    setActiveStudentSession(studentData);
    return { success: true, student: studentData };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error('Firebase Student Sign In Error:', error);

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      return {
        success: false,
        error: 'Invalid mobile number or password. Please verify your credentials or register a new profile.',
      };
    }
    if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Access temporarily disabled due to multiple failed login attempts. Please try again later.',
      };
    }
    if (error.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network connection failed. Please check your internet connection.',
      };
    }

    return {
      success: false,
      error: error.message || 'Authentication error. Please check your connection and try again.',
    };
  }
}

/**
 * Genuine Firebase Sign Out
 */
export async function signOutLocalStudent(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase sign out warning:', err);
  } finally {
    setActiveStudentSession(null);
  }
}

/**
 * Listen for Firebase Auth state changes & restore genuine sessions
 */
let isListenerInitialized = false;

function initAuthListener(): void {
  if (isListenerInitialized) return;
  isListenerInitialized = true;

  onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      // If signed out or no user, clear session if currently set as student
      const current = getCurrentActiveStudent();
      if (current) {
        setActiveStudentSession(null);
      }
      return;
    }

    // Check if the authenticated user is an administrator
    if (firebaseUser.email === 'contact@derote.in') {
      return;
    }

    // Attempt to restore student profile from Cloud Firestore (/students/{uid})
    try {
      const docRef = doc(db, 'students', firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<LocalStudentAccount>;
        const student: LocalStudentAccount = {
          id: firebaseUser.uid,
          fullName: data.fullName || 'Student',
          classGrade: data.classGrade || '10',
          schoolName: data.schoolName || 'School',
          phone: data.phone || '',
          email: firebaseUser.email || data.email,
          completedReflections: data.completedReflections || 0,
          totalReflections: data.totalReflections || 14,
          badge: data.badge,
          createdAt: data.createdAt || new Date().toISOString(),
          lastLoginAt: data.lastLoginAt || new Date().toISOString(),
        };
        setActiveStudentSession(student);
      }
    } catch (err) {
      console.warn('Failed to restore student from Firestore on auth change:', err);
    }
  });
}

// Initialize listener immediately
initAuthListener();

/**
 * Listen for student auth state changes in components
 */
export function onLocalAuthChange(callback: (student: LocalStudentAccount | null) => void): () => void {
  // Fire immediately with current cached student
  callback(getCurrentActiveStudent());

  const handler = (event: Event) => {
    const custom = event as CustomEvent<{ student: LocalStudentAccount | null }>;
    if (custom.detail !== undefined) {
      callback(custom.detail.student);
    } else {
      callback(getCurrentActiveStudent());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === ACTIVE_USER_SESSION_KEY) {
      callback(getCurrentActiveStudent());
    }
  };

  window.addEventListener(AUTH_STATE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}
