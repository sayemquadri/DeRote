/**
 * Student Authentication & Profile Service for DeRote Student Insight System
 *
 * Connected directly to Firebase Authentication & Cloud Firestore:
 * - Genuine Firebase Email/Password Authentication using real email addresses
 * - Backward-compatible support for existing mobile-based synthetic accounts ({phone}@student.derote.in)
 * - Safe email migration flow preserving student UIDs, Firestore profiles, and sessions
 * - Optional Google Sign-In support
 * - Native password reset emails via Firebase Auth
 * - Student profile records persisted in Cloud Firestore (/students/{uid})
 * - Strict student-level ownership enforced by Firestore Security Rules
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  email: string;
  phone?: string;
  isSyntheticEmail?: boolean; // True if account was created with legacy synthetic email
  emailVerified?: boolean;
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
 * Validates real email address format
 */
export function isValidEmail(raw: string): boolean {
  const clean = raw.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
}

/**
 * Checks if an email is a legacy synthetic identity
 */
export function isSyntheticStudentEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith('@student.derote.in');
}

/**
 * Derives the legacy synthetic authentication email for an Indian mobile number.
 * Used exclusively for backward-compatible login of existing accounts.
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
 * Genuine Firebase Authentication: Register New Student with Real Email
 */
export async function registerLocalStudent(data: {
  fullName: string;
  classGrade: string;
  schoolName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string; student?: LocalStudentAccount }> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanFullName = data.fullName.trim();
  const cleanClass = data.classGrade.trim();
  const cleanSchool = data.schoolName.trim();
  const cleanPhone = data.phone ? normalizePhone(data.phone) : '';

  if (!cleanFullName) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!['8', '9', '10'].includes(cleanClass)) {
    return { success: false, error: 'Please select a valid class (Class 8, 9, or 10).' };
  }

  if (!cleanSchool) {
    return { success: false, error: 'Please enter your school name.' };
  }

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (isSyntheticStudentEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Please use your actual personal or school email address (e.g. name@example.com).',
    };
  }

  if (cleanPhone && !isValidIndianMobile(cleanPhone)) {
    return { success: false, error: 'If providing a mobile number, please enter a valid 10-digit number.' };
  }

  if (!data.password || data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    // 1. Create real Firebase Authentication account using real email
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
    const uid = userCredential.user.uid;

    // 2. Persist genuine student profile in Cloud Firestore (/students/{uid})
    const now = new Date().toISOString();
    const newAccount: LocalStudentAccount = {
      id: uid,
      fullName: cleanFullName,
      classGrade: cleanClass,
      schoolName: cleanSchool,
      email: cleanEmail,
      phone: cleanPhone,
      isSyntheticEmail: false,
      emailVerified: userCredential.user.emailVerified,
      completedReflections: 0,
      totalReflections: 14,
      badge: `Class ${cleanClass} Student`,
      createdAt: now,
      lastLoginAt: now,
    };

    await setDoc(doc(db, 'students', uid), {
      id: uid,
      fullName: newAccount.fullName,
      classGrade: newAccount.classGrade,
      schoolName: newAccount.schoolName,
      email: newAccount.email,
      phone: newAccount.phone || '',
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
    console.warn('Firebase Student Registration Notice:', error.code || error.message);

    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      };
    }
    if (error.code === 'auth/invalid-email') {
      return {
        success: false,
        error: 'The email address entered is not valid.',
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
 * Accepts either:
 * - Real email address (primary)
 * - 10-digit mobile number (backward-compatible legacy login via synthetic identity)
 */
export async function loginLocalStudent(
  identifier: string,
  pass: string
): Promise<{ success: boolean; error?: string; student?: LocalStudentAccount; isSynthetic?: boolean }> {
  const trimmed = identifier.trim();

  if (!trimmed) {
    return { success: false, error: 'Please enter your email address or registered mobile number.' };
  }

  if (!pass) {
    return { success: false, error: 'Please enter your password.' };
  }

  // Determine auth email:
  // 1. If it looks like a 10-digit mobile number, map to legacy synthetic email for existing accounts
  // 2. Otherwise treat as email
  let authEmail = trimmed.toLowerCase();
  let isLegacyPhoneInput = false;

  const rawDigits = trimmed.replace(/[^\d]/g, '');
  if (!trimmed.includes('@') && rawDigits.length === 10) {
    if (!isValidIndianMobile(rawDigits)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number or email.' };
    }
    authEmail = getStudentAuthEmail(rawDigits);
    isLegacyPhoneInput = true;
  } else if (!isValidEmail(authEmail) && !isSyntheticStudentEmail(authEmail)) {
    return { success: false, error: 'Please enter a valid email address or 10-digit mobile number.' };
  }

  try {
    // 1. Authenticate against Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, authEmail, pass);
    const uid = userCredential.user.uid;

    // 2. Fetch student profile from Cloud Firestore (/students/{uid})
    const docRef = doc(db, 'students', uid);
    const docSnap = await getDoc(docRef);

    const remote = docSnap.exists() ? (docSnap.data() as Partial<LocalStudentAccount>) : {};
    const isSynthetic = isSyntheticStudentEmail(userCredential.user.email);
    const now = new Date().toISOString();

    const studentData: LocalStudentAccount = {
      id: uid,
      fullName: remote.fullName || userCredential.user.displayName || 'Student',
      classGrade: remote.classGrade || '10',
      schoolName: remote.schoolName || 'Enrolled School',
      email: userCredential.user.email || remote.email || authEmail,
      phone: remote.phone || (isLegacyPhoneInput ? rawDigits : ''),
      isSyntheticEmail: isSynthetic,
      emailVerified: userCredential.user.emailVerified,
      completedReflections: remote.completedReflections || 0,
      totalReflections: remote.totalReflections || 14,
      badge: remote.badge || `Class ${remote.classGrade || '10'} Student`,
      createdAt: remote.createdAt || now,
      lastLoginAt: now,
    };

    // If profile didn't exist in Firestore, save it now so user is never blocked
    if (!docSnap.exists()) {
      try {
        await setDoc(docRef, {
          id: uid,
          fullName: studentData.fullName,
          classGrade: studentData.classGrade,
          schoolName: studentData.schoolName,
          email: studentData.email,
          phone: studentData.phone || '',
          createdAt: now,
          lastLoginAt: now,
          completedReflections: 0,
          totalReflections: 14,
          badge: studentData.badge,
        });
      } catch (err) {
        console.warn('Could not auto-create student document in Firestore:', err);
      }
    } else {
      // Update lastLoginAt in Firestore
      try {
        await updateDoc(docRef, { lastLoginAt: studentData.lastLoginAt });
      } catch {
        // Non-fatal if update timestamp fails
      }
    }

    setActiveStudentSession(studentData);
    return { success: true, student: studentData, isSynthetic };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.warn('Firebase Student Sign In Notice:', error.code || error.message);

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-email'
    ) {
      return {
        success: false,
        error: isLegacyPhoneInput
          ? 'Invalid mobile number or password. If you registered with an email address, please use your email instead.'
          : 'Invalid email address or password. If you do not have an account yet, please register below.',
      };
    }
    if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Access temporarily disabled due to multiple failed login attempts. Please try again later or reset your password.',
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
      error: error.message || 'Authentication error. Please check your credentials and try again.',
    };
  }
}

/**
 * Optional Google Sign-In for Students
 */
export async function loginWithGoogle(): Promise<{
  success: boolean;
  error?: string;
  student?: LocalStudentAccount;
  needsProfileCompletion?: boolean;
  googleProfile?: { uid: string; email: string; fullName: string };
}> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if Firestore student profile already exists
    const docRef = doc(db, 'students', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const remote = docSnap.data() as Partial<LocalStudentAccount>;
      const studentData: LocalStudentAccount = {
        id: user.uid,
        fullName: remote.fullName || user.displayName || 'Student',
        classGrade: remote.classGrade || '10',
        schoolName: remote.schoolName || 'Enrolled School',
        email: user.email || remote.email || '',
        phone: remote.phone || '',
        isSyntheticEmail: false,
        emailVerified: user.emailVerified,
        completedReflections: remote.completedReflections || 0,
        totalReflections: remote.totalReflections || 14,
        badge: remote.badge || `Class ${remote.classGrade || '10'} Student`,
        createdAt: remote.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      try {
        await updateDoc(docRef, { lastLoginAt: studentData.lastLoginAt });
      } catch {
        // Non-fatal
      }

      setActiveStudentSession(studentData);
      return { success: true, student: studentData };
    }

    // New Google user — requires Class & School selection to complete registration
    return {
      success: true,
      needsProfileCompletion: true,
      googleProfile: {
        uid: user.uid,
        email: user.email || '',
        fullName: user.displayName || '',
      },
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.warn('Google Sign-In Notice:', error.code || error.message);

    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Google sign-in popup was closed before completing.' };
    }
    if (error.code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'Sign-in cancelled.' };
    }

    return {
      success: false,
      error: error.message || 'Unable to sign in with Google. Please try again or use email.',
    };
  }
}

/**
 * Completes profile setup for a newly authenticated Google student
 */
export async function completeGoogleStudentRegistration(data: {
  fullName: string;
  classGrade: string;
  schoolName: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string; student?: LocalStudentAccount }> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: 'No active Google session found. Please sign in again.' };
  }

  const cleanFullName = data.fullName.trim() || user.displayName || 'Student';
  const cleanClass = data.classGrade.trim();
  const cleanSchool = data.schoolName.trim();
  const cleanPhone = data.phone ? normalizePhone(data.phone) : '';
  const now = new Date().toISOString();

  if (!['8', '9', '10'].includes(cleanClass)) {
    return { success: false, error: 'Please select your class grade (Classes 8, 9, or 10).' };
  }
  if (!cleanSchool) {
    return { success: false, error: 'Please enter your school name.' };
  }

  const newAccount: LocalStudentAccount = {
    id: user.uid,
    fullName: cleanFullName,
    classGrade: cleanClass,
    schoolName: cleanSchool,
    email: user.email || '',
    phone: cleanPhone,
    isSyntheticEmail: false,
    emailVerified: user.emailVerified,
    completedReflections: 0,
    totalReflections: 14,
    badge: `Class ${cleanClass} Student`,
    createdAt: now,
    lastLoginAt: now,
  };

  try {
    await setDoc(doc(db, 'students', user.uid), {
      id: user.uid,
      fullName: newAccount.fullName,
      classGrade: newAccount.classGrade,
      schoolName: newAccount.schoolName,
      email: newAccount.email,
      phone: newAccount.phone || '',
      createdAt: now,
      lastLoginAt: now,
      completedReflections: 0,
      totalReflections: 14,
      badge: newAccount.badge,
    });

    setActiveStudentSession(newAccount);
    return { success: true, student: newAccount };
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.warn('Google profile completion notice:', error.message);
    return { success: false, error: error.message || 'Failed to save student profile in Cloud Firestore.' };
  }
}

/**
 * Updates an existing student's profile information (name, classGrade, schoolName)
 * in Firestore and current active session.
 */
export async function updateStudentProfileData(
  studentId: string,
  updates: {
    fullName?: string;
    classGrade?: string;
    schoolName?: string;
    phone?: string;
  }
): Promise<{ success: boolean; error?: string; student?: LocalStudentAccount }> {
  try {
    const current = getCurrentActiveStudent();
    if (!current || current.id !== studentId) {
      return { success: false, error: 'Student session not found or unauthorized.' };
    }

    const updatedAccount: LocalStudentAccount = {
      ...current,
      ...(updates.fullName ? { fullName: updates.fullName.trim() } : {}),
      ...(updates.classGrade ? { classGrade: updates.classGrade.trim() } : {}),
      ...(updates.schoolName ? { schoolName: updates.schoolName.trim() } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone.trim() } : {}),
    };

    // Update in Firestore
    try {
      const studentDocRef = doc(db, 'students', studentId);
      await updateDoc(studentDocRef, {
        ...(updates.fullName ? { fullName: updates.fullName.trim() } : {}),
        ...(updates.classGrade ? { classGrade: updates.classGrade.trim() } : {}),
        ...(updates.schoolName ? { schoolName: updates.schoolName.trim() } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone.trim() } : {}),
      });
    } catch (fsErr) {
      console.warn('Firestore updateDoc note:', fsErr);
    }

    setActiveStudentSession(updatedAccount);
    return { success: true, student: updatedAccount };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { success: false, error: error.message || 'Failed to update profile.' };
  }
}

/**
 * Sends a password reset email via Firebase Authentication
 */
export async function sendStudentPasswordResetEmail(
  identifier: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const trimmed = identifier.trim();
  if (!trimmed) {
    return { success: false, error: 'Please enter your email address to receive a password reset link.' };
  }

  // If student entered a phone number, explain that reset emails require real email
  if (!trimmed.includes('@')) {
    return {
      success: false,
      error:
        'Password reset emails cannot be delivered to a mobile number. Please enter the email address associated with your account, or log in with your mobile number to upgrade to an email login.',
    };
  }

  const cleanEmail = trimmed.toLowerCase();
  if (isSyntheticStudentEmail(cleanEmail)) {
    return {
      success: false,
      error:
        'This account uses a legacy mobile login. Please sign in with your mobile number and password, then set your real email address in your profile.',
    };
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return {
      success: true,
      message: `A password reset link has been sent to ${cleanEmail}. Please check your inbox and follow the instructions.`,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.warn('Password Reset Notice:', error.code || error.message);

    if (error.code === 'auth/user-not-found') {
      return {
        success: false,
        error: 'No registered student account was found with this email address.',
      };
    }
    if (error.code === 'auth/invalid-email') {
      return {
        success: false,
        error: 'The email address entered is not valid.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to send password reset email. Please verify your address and try again.',
    };
  }
}

/**
 * Task 2 Migration Flow: Migrates an existing synthetic-email account to a real email address
 * Preserves the student's exact Firebase Auth UID, /students/{uid} document, and session records!
 */
export async function migrateStudentToRealEmail(
  newRealEmail: string,
  currentPassword?: string
): Promise<{ success: boolean; error?: string; requiresVerification?: boolean; message?: string }> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: 'You must be currently signed in to upgrade your login email.' };
  }

  const cleanEmail = newRealEmail.trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid real email address.' };
  }

  if (isSyntheticStudentEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Please enter your actual personal or school email address, not a @student.derote.in identity.',
    };
  }

  try {
    // If reauthentication is needed because login was a while ago
    if (currentPassword && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      } catch (reauthErr) {
        console.warn('Reauthentication attempt during email migration:', reauthErr);
      }
    }

    // 1. Send verification link to new email to verify ownership before update (or update email)
    // Using verifyBeforeUpdateEmail sends a secure email verification to the new address.
    // Once clicked by the student, Firebase Auth updates the user's email while retaining their identical UID!
    let requiresVerification = true;
    try {
      await verifyBeforeUpdateEmail(user, cleanEmail);
    } catch (verifyErr: unknown) {
      const errObj = verifyErr as { code?: string };
      // Fallback to updateEmail if verifyBeforeUpdateEmail is not supported by project configuration
      if (errObj.code === 'auth/operation-not-allowed' || errObj.code === 'auth/requires-recent-login') {
        throw verifyErr;
      }
      try {
        await updateEmail(user, cleanEmail);
        requiresVerification = false;
      } catch (updateErr) {
        throw updateErr;
      }
    }

    // 2. Safely update email in the student's Firestore profile (/students/{uid})
    const docRef = doc(db, 'students', user.uid);
    try {
      await updateDoc(docRef, {
        email: cleanEmail,
        lastLoginAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn('Could not immediately update Firestore email field during migration:', fsErr);
    }

    // 3. Update cached session
    const currentCached = getCurrentActiveStudent();
    if (currentCached && currentCached.id === user.uid) {
      const updatedAccount: LocalStudentAccount = {
        ...currentCached,
        email: cleanEmail,
        isSyntheticEmail: false,
      };
      setActiveStudentSession(updatedAccount);
    }

    return {
      success: true,
      requiresVerification,
      message: requiresVerification
        ? `A verification email has been sent to ${cleanEmail}. Please click the confirmation link in your inbox to complete your login credential update. Your existing UID, profile, and reflection records remain completely safe.`
        : `Your login email has been successfully updated to ${cleanEmail}! You can now sign in with this email.`,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.warn('Email Migration Notice:', error.code || error.message);

    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        error: 'This email address is already associated with another account. Please use a different email.',
      };
    }
    if (error.code === 'auth/requires-recent-login') {
      return {
        success: false,
        error: 'Security verification required: Please enter your current password to authorize this email update.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to update login email. Please try again.',
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
      const current = getCurrentActiveStudent();
      if (current) {
        setActiveStudentSession(null);
      }
      return;
    }

    // Administrator accounts are handled by adminService
    if (firebaseUser.email === 'contact@derote.in') {
      return;
    }

    // Restore student profile from Cloud Firestore (/students/{uid})
    try {
      const docRef = doc(db, 'students', firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<LocalStudentAccount>;
        const isSynthetic = isSyntheticStudentEmail(firebaseUser.email);

        const student: LocalStudentAccount = {
          id: firebaseUser.uid,
          fullName: data.fullName || firebaseUser.displayName || 'Student',
          classGrade: data.classGrade || '10',
          schoolName: data.schoolName || 'Enrolled School',
          email: firebaseUser.email || data.email || '',
          phone: data.phone || '',
          isSyntheticEmail: isSynthetic,
          emailVerified: firebaseUser.emailVerified,
          completedReflections: data.completedReflections || 0,
          totalReflections: data.totalReflections || 14,
          badge: data.badge || `Class ${data.classGrade || '10'} Student`,
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
