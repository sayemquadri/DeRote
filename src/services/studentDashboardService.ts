/**
 * Student Dashboard Service for DeRote Student Insight System
 * Handles student tasks, planner items, themes, and dashboard state.
 * Offline-first design with Cloud Firestore synchronization.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from './firebase';

export type TaskCategory = 'Schoolwork' | 'Revision' | 'Personal Projects' | 'General';
export type TaskPriority = 'high' | 'medium' | 'low';
export type DashboardTheme = 'classic' | 'teal' | 'violet';

export interface StudentTask {
  id: string;
  studentId: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // e.g. "Today", "Tomorrow", "Friday", or YYYY-MM-DD
  completed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboardPreferences {
  theme: DashboardTheme;
  showQuote: boolean;
  soundEnabled: boolean;
}

export const TASK_CATEGORIES: { id: TaskCategory; label: string; color: string; badgeBg: string }[] = [
  { id: 'Schoolwork', label: 'Schoolwork', color: '#2563EB', badgeBg: '#EFF6FF' },
  { id: 'Revision', label: 'Revision', color: '#7C3AED', badgeBg: '#F5F3FF' },
  { id: 'Personal Projects', label: 'Personal Projects', color: '#059669', badgeBg: '#ECFDF5' },
  { id: 'General', label: 'General', color: '#D97706', badgeBg: '#FFFBEB' },
];

export const THEME_CONFIGS: Record<
  DashboardTheme,
  {
    id: DashboardTheme;
    name: string;
    description: string;
    primaryColor: string;
    sidebarBg: string;
    sidebarActiveBg: string;
    accentGradient: string;
    accentBadgeBg: string;
    accentText: string;
    ringColor: string;
  }
> = {
  classic: {
    id: 'classic',
    name: 'Classic Royal Blue',
    description: 'DeRote signature academic royal blue styling',
    primaryColor: '#2150D8',
    sidebarBg: '#1B357F',
    sidebarActiveBg: '#F5F8FD',
    accentGradient: 'from-[#2150D8] to-[#3B82F6]',
    accentBadgeBg: '#EBF2FE',
    accentText: '#1D4ED8',
    ringColor: '#2150D8',
  },
  teal: {
    id: 'teal',
    name: 'Slate Teal',
    description: 'Calm, focused sea & slate botanical palette',
    primaryColor: '#0F766E',
    sidebarBg: '#11423F',
    sidebarActiveBg: '#F4FAF8',
    accentGradient: 'from-[#0F766E] to-[#14B8A6]',
    accentBadgeBg: '#E6F7F5',
    accentText: '#0F766E',
    ringColor: '#0F766E',
  },
  violet: {
    id: 'violet',
    name: 'Indigo Violet',
    description: 'Creative and vibrant high-focus aesthetic',
    primaryColor: '#6366F1',
    sidebarBg: '#2E205E',
    sidebarActiveBg: '#F7F6FE',
    accentGradient: 'from-[#6366F1] to-[#8B5CF6]',
    accentBadgeBg: '#F0EEFF',
    accentText: '#5B21B6',
    ringColor: '#6366F1',
  },
};

const DEFAULT_PREFERENCES: StudentDashboardPreferences = {
  theme: 'classic',
  showQuote: true,
  soundEnabled: true,
};

function getStorageTasksKey(studentId: string): string {
  return `derote_student_tasks_${studentId}`;
}

function getStoragePrefsKey(studentId: string): string {
  return `derote_student_prefs_${studentId}`;
}

/**
 * Creates sensible starter tasks for Classes 8, 9, 10
 */
export function getStarterTasks(studentId: string, classGrade?: string): StudentTask[] {
  const now = new Date().toISOString();
  const grade = classGrade || '9';

  return [
    {
      id: `task_init_1_${studentId}`,
      studentId,
      title: `Complete Class ${grade} Math Chapter Review`,
      category: 'Schoolwork',
      priority: 'high',
      dueDate: 'Tomorrow',
      completed: false,
      notes: 'Review formula sheet and practice 5 standard textbook problems.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `task_init_2_${studentId}`,
      studentId,
      title: 'Complete DeRote 14-Question Self-Reflection',
      category: 'Revision',
      priority: 'high',
      dueDate: 'This Week',
      completed: false,
      notes: 'Identify learning habits, strengths, and collaboration style.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `task_init_3_${studentId}`,
      studentId,
      title: 'Organize Science Fair & Class Project Notes',
      category: 'Personal Projects',
      priority: 'medium',
      dueDate: 'Friday',
      completed: false,
      notes: 'Summarize hypothesis and gather background reference articles.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `task_init_4_${studentId}`,
      studentId,
      title: 'Prepare study desk & weekly timetable',
      category: 'General',
      priority: 'low',
      dueDate: 'Sunday',
      completed: true,
      notes: 'Clean notebooks, clear workspace for high-focus revision.',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Loads tasks for a student (Local cache first, then Firestore sync)
 */
export async function loadStudentTasks(studentId: string, classGrade?: string): Promise<StudentTask[]> {
  const localKey = getStorageTasksKey(studentId);
  let localTasks: StudentTask[] = [];

  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      localTasks = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read cached tasks from localStorage', e);
  }

  // If no local tasks exist yet, initialize starter tasks
  if (localTasks.length === 0) {
    localTasks = getStarterTasks(studentId, classGrade);
    try {
      localStorage.setItem(localKey, JSON.stringify(localTasks));
    } catch {
      // Ignore quota error
    }
  }

  // Attempt to sync from Cloud Firestore if authenticated
  if (auth.currentUser && auth.currentUser.uid === studentId) {
    try {
      const tasksCol = collection(db, 'students', studentId, 'tasks');
      const snap = await getDocs(tasksCol);
      if (!snap.empty) {
        const remoteTasks: StudentTask[] = [];
        snap.forEach((d) => {
          remoteTasks.push(d.data() as StudentTask);
        });
        // Sort newest first
        remoteTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(localKey, JSON.stringify(remoteTasks));
        return remoteTasks;
      } else {
        // If Firestore is empty, seed it with the starter tasks
        for (const t of localTasks) {
          try {
            await setDoc(doc(db, 'students', studentId, 'tasks', t.id), t);
          } catch {
            // Silently continue if rules don't permit
          }
        }
      }
    } catch (err) {
      // Network or permission offline fallback
      console.warn('Firestore tasks read note (using local cache):', err);
    }
  }

  return localTasks;
}

/**
 * Saves or updates a student task
 */
export async function saveStudentTask(studentId: string, task: StudentTask): Promise<StudentTask[]> {
  const localKey = getStorageTasksKey(studentId);
  let tasks: StudentTask[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) tasks = JSON.parse(raw);
  } catch {
    tasks = [];
  }

  const existingIndex = tasks.findIndex((t) => t.id === task.id);
  if (existingIndex >= 0) {
    tasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
  } else {
    tasks.unshift(task);
  }

  try {
    localStorage.setItem(localKey, JSON.stringify(tasks));
  } catch {
    // Ignore quota error
  }

  // Sync to Firestore
  if (auth.currentUser && auth.currentUser.uid === studentId) {
    try {
      await setDoc(doc(db, 'students', studentId, 'tasks', task.id), task);
    } catch (e) {
      console.warn('Firestore task sync deferred/cached locally', e);
    }
  }

  return tasks;
}

/**
 * Toggles task completed state
 */
export async function toggleStudentTask(studentId: string, taskId: string, completed: boolean): Promise<StudentTask[]> {
  const localKey = getStorageTasksKey(studentId);
  let tasks: StudentTask[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) tasks = JSON.parse(raw);
  } catch {
    tasks = [];
  }

  const updatedTasks = tasks.map((t) =>
    t.id === taskId ? { ...t, completed, updatedAt: new Date().toISOString() } : t
  );

  try {
    localStorage.setItem(localKey, JSON.stringify(updatedTasks));
  } catch {
    // Ignore quota error
  }

  // Sync to Firestore
  if (auth.currentUser && auth.currentUser.uid === studentId) {
    try {
      await updateDoc(doc(db, 'students', studentId, 'tasks', taskId), {
        completed,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore toggle sync note:', e);
    }
  }

  return updatedTasks;
}

/**
 * Deletes a student task
 */
export async function deleteStudentTask(studentId: string, taskId: string): Promise<StudentTask[]> {
  const localKey = getStorageTasksKey(studentId);
  let tasks: StudentTask[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) tasks = JSON.parse(raw);
  } catch {
    tasks = [];
  }

  const filtered = tasks.filter((t) => t.id !== taskId);

  try {
    localStorage.setItem(localKey, JSON.stringify(filtered));
  } catch {
    // Ignore quota error
  }

  // Sync to Firestore
  if (auth.currentUser && auth.currentUser.uid === studentId) {
    try {
      await deleteDoc(doc(db, 'students', studentId, 'tasks', taskId));
    } catch (e) {
      console.warn('Firestore task delete note:', e);
    }
  }

  return filtered;
}

/**
 * Loads student dashboard preferences
 */
export async function loadStudentPreferences(studentId: string): Promise<StudentDashboardPreferences> {
  const localKey = getStoragePrefsKey(studentId);
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Saves student dashboard preferences
 */
export async function saveStudentPreferences(
  studentId: string,
  prefs: Partial<StudentDashboardPreferences>
): Promise<StudentDashboardPreferences> {
  const localKey = getStoragePrefsKey(studentId);
  const current = await loadStudentPreferences(studentId);
  const updated = { ...current, ...prefs };

  try {
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch {
    // fallback
  }

  if (auth.currentUser && auth.currentUser.uid === studentId) {
    try {
      await setDoc(doc(db, 'students', studentId, 'preferences', 'settings'), updated);
    } catch {
      // non-blocking
    }
  }

  return updated;
}
