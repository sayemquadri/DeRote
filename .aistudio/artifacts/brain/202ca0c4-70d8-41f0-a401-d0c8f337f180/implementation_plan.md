# DeRote Student Insight System — Premium Student Dashboard

Transform the DeRote student portal into a dedicated, premium, and personalized student productivity dashboard for students in Classes 8, 9, and 10. The dashboard establishes a clean separation between authentication and student workspaces, featuring a royal-blue sidebar with sculpted curved-edge tabs, task management, reflection insights, and customizable themes.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design and architectural choices have been confirmed and will guide the implementation:

- **Default Landing View**: Students will first see the **Overview** view upon entering the dashboard, showcasing a personalized time-aware greeting, quick reflection status, task snapshot progress bar, and student motivation cards.
- **Theme Accents**: Students can toggle between three tailored accent themes in real time:
  1. **Classic Royal Blue** (`#2150D8` / `#304A9A`) — DeRote brand standard
  2. **Slate Teal** (`#0D9488` / `#115E59`) — calm and focused
  3. **Indigo Violet** (`#6366F1` / `#4F46E5`) — creative and vibrant
- **Task Categories**: Student task management will be organized into four core categories:
  - **Schoolwork** (homework, school assignments, classroom submissions)
  - **Revision** (exam prep, chapter recaps, concept mastery)
  - **Personal Projects** (science fairs, coding, creative reading)
  - **General** (routines, extracurriculars, habit reminders)
- **Navigation Craft**: The sidebar incorporates the requested visual signature: a deep royal-blue sidebar (`#304A9A`) where the selected item has a white surface that seamlessly flows into the main content background via sculpted, curved-corner fillets (concave scoop curves at top and bottom).

---

## 1. Overview & Core Concept

### What It Does
Replaces the mixed authentication-and-questionnaire view with a unified, modern student dashboard for secondary school learners (Classes 8, 9, and 10). It provides an empowering personal study hub where students track their DeRote cognitive reflection status, manage daily schoolwork and revision tasks, explore their psychological insight report, and personalize their space.

### Target Audience & Persona
- **Class 8–10 Students (Ages 13–16)**: Students navigating high-stakes academic transitions, self-directed study schedules, and early career/stream deliberations.
- **Experience Vibe**: Mature yet approachable, calm and encouraging, uncluttered, and free of childish badges or distracting corporate clutter.

### Key Value
- **Clean Separation of Concerns**: Public marketing/landing pages and authentication (`/login`, `/signup`) remain lightweight and secure. Once authenticated, students enter a distraction-free, dedicated dashboard environment (`/dashboard`).
- **Productivity & Self-Reflection**: Merges practical daily task management with deep cognitive reflection, encouraging balanced study habits and self-awareness.
- **Cross-Device Persistence**: Student tasks, theme preferences, and reflection drafts synchronize with Cloud Firestore under the student's authenticated UID.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Authentication to Dashboard Transition**:
   - Student logs in via email/password or Google Sign-In at `/login`.
   - On successful authentication, student is automatically routed to `/dashboard`.
   - Existing active sessions on app launch restore state smoothly without flickering.

2. **Overview Exploration**:
   - Student lands on the **Overview** tab.
   - Dynamic greeting (e.g., *"Good afternoon, Aarav"*), current school, and class badge.
   - Status card highlights the 10-Question Dilemma Reflection:
     - *Not Started*: "Begin your 10-minute insight journey" with single-click start.
     - *In Progress*: "Question 6 of 10 completed" with a "Resume Reflection" button.
     - *Completed*: Displays top cognitive insight badge and "View Full Insight Report" CTA.
   - Task completion ring/bar showing progress (e.g., 3 of 5 tasks done today).
   - Quick action shortcuts to create a task or launch assessment.

3. **Managing Tasks & Study Planning**:
   - Student navigates to **My Tasks**.
   - Filter by category tab: *All*, *Schoolwork*, *Revision*, *Personal Projects*, or *General*.
   - Filter by status: *Active* or *Completed*.
   - Add new task modal/drawer with title, category, priority (High, Medium, Normal), and optional target date.
   - Inline checkbox to toggle completion with smooth haptic-like visual settling.
   - Delete and edit controls with confirm states.

4. **Reflections & Insights**:
   - Student navigates to **My Reflections**.
   - If reflection is completed, renders the comprehensive `StudentInsightDashboard` (cognitive traits, decision archetype, situational evidence, print/export PDF).
   - If incomplete, provides an embedded, focused questionnaire experience with progress indicators, back/next navigation, and auto-save.

5. **Profile & Customization**:
   - Student navigates to **Settings & Profile**.
   - Views account metadata: Full Name, Class Grade, School, Email, Account UID.
   - Ability to update display name and school name (synced to Firestore `/students/{uid}`).
   - Instant theme accent picker (Classic Royal Blue, Slate Teal, Indigo Violet) with immediate live application across navigation accents and highlights.
   - Sign Out button with confirmation modal that clears authentication and redirects to `/login`.

### Visual Identity & Theme Tokens

- **Dominant Neutral Canvas (60%)**: Soft modern white-blue backdrop (`#F5F8FD`) and crisp white cards (`#FFFFFF`).
- **Structural Surfaces (30%)**:
  - Deep Navy Sidebar: `#304A9A` (resting surface)
  - Sidebar Selected Tab: `#FFFFFF` (carved directly into the main viewport)
  - Hairline Borders: `#E1E8F5`
  - Subtle Dividing Lines: `rgba(20, 39, 70, 0.08)`
- **Accent Budget (10%)**:
  - Royal Blue: `#2150D8` (hover states, primary CTAs, active indicators)
  - Slate Teal: `#0D9488` (alternative theme)
  - Indigo Violet: `#6366F1` (alternative theme)
- **Sculpted Curved-Edge Navigation Mechanics**:
  - The active navigation item in the sidebar uses the classic curved scoop technique:
  - Top scoop: An inverted corner element (`w-4 h-4 bg-transparent shadow-[0_16px_0_0_#ffffff] rounded-br-2xl`) smoothly transitions the dark blue sidebar above into the white active item.
  - Bottom scoop: An inverted corner element (`w-4 h-4 bg-transparent shadow-[0_-16px_0_0_#ffffff] rounded-tr-2xl`) smoothly transitions the white active item into the dark blue sidebar below.
  - Result: The selected tab appears physically carved out and merged with the white dashboard background.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans`, clean semi-bold and bold weights (`font-semibold`, `font-bold`).
  - Body: `DM Sans` / `Plus Jakarta Sans`, balanced line-heights for optimal legibility.
  - Numbers & Counters: `font-mono tabular-nums` for task counts and progress percentages.
- **Mobile Responsive Drawer & Bottom Bar**:
  - On screens `< 1024px`, the desktop sidebar collapses into a sleek bottom navigation dock with single-line labels and clear active pills, plus a mobile header with student avatar and profile drawer.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Dedicated Route `/dashboard` vs. In-Place View Swapping
- **Chosen Approach**: Register `/dashboard` as a first-class route in `App.tsx` and automatically redirect authenticated students visiting `/login` or `/signup` to `/dashboard`.
- **Why**: Eliminates the current confusion where the login page contained profile info and questionnaire links. Preserves clean browser URL navigation and deep-linking.
- **Alternatives Considered**: Conditional rendering inside `LandingPage` or `LoginPage` (rejected because it mixes auth and application state).

### Decision 2: Dual Storage Strategy for Student Tasks
- **Chosen Approach**: Combine local storage caching (`localStorage`) with real-time Firebase Firestore persistence under `/students/{uid}/tasks`.
- **Why**: Zero-latency instant interactions (optimistic UI updates) with guaranteed offline resilience and cross-device cloud persistence when online.
- **Alternatives Considered**: Firestore-only with network blocking (causes spinner delays on simple checkbox clicks) or local-only (causes task loss across browser sessions).

### Decision 3: Custom Accent Theme Architecture
- **Chosen Approach**: CSS custom properties (`--brand-primary`, `--brand-sidebar`, `--brand-accent`, `--brand-light`) dynamically updated on the document root or dashboard container based on the student's selected theme.
- **Why**: Clean, zero-overhead theming that works instantly with Tailwind CSS arbitrary values and utility classes without requiring multiple duplicated layouts.

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│         (Route Dispatcher: /login, /signup, /admin, /dashboard)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         StudentDashboardPage                           │
│     (State: activeTab, currentStudent, theme, tasks, session)          │
├───────────────────────────────────┬────────────────────────────────────┤
│           Left Navigation         │             Main Content           │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │   Sculpted Royal Sidebar    │  │  │   Top Dashboard Header       │  │
│  │   - Brand Wordmark          │  │  │   - Context Breadcrumbs      │  │
│  │   - Overview (Curved Tab)   │  │  │   - Theme Quick Toggle       │  │
│  │   - My Tasks                │  │  │   - Student Avatar & School  │  │
│  │   - My Reflections          │  │  └──────────────┬───────────────┘  │
│  │   - Profile & Settings      │  │                 │                  │
│  │   - Sign Out Action         │  │                 ▼                  │
│  └─────────────────────────────┘  │  ┌──────────────────────────────┐  │
│                                   │  │ Active View Container:       │  │
│                                   │  │  ├─ DashboardOverviewView    │  │
│                                   │  │  ├─ StudentTasksView         │  │
│                                   │  │  ├─ StudentReflectionsView   │  │
│                                   │  │  └─ StudentProfileView       │  │
│                                   │  └──────────────────────────────┘  │
└───────────────────────────────────┴────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Services & Persistence Layer                         │
│  ├─ localAuth.ts (Auth sessions, Firestore /students/{uid})            │
│  ├─ studentTaskService.ts (CRUD tasks, Firestore sync)                 │
│  ├─ questionnaireService.ts (10 Dilemma session & report)              │
│  └─ insightEngine.ts (Traceable archetype generation)                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models

```typescript
// Student Personal Task
export interface StudentTask {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  category: 'Schoolwork' | 'Revision' | 'Personal Projects' | 'General';
  priority: 'high' | 'medium' | 'normal';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

// Student Theme Customization
export type DashboardThemeId = 'royal_blue' | 'slate_teal' | 'indigo_violet';

export interface DashboardThemeConfig {
  id: DashboardThemeId;
  name: string;
  primary: string;
  sidebar: string;
  accent: string;
  lightBg: string;
}
```

### Interactive State Transitions & Event Flow

1. **Tab Switch**: Clicking any sidebar tab updates `activeTab` with immediate CSS transition, repositioning the sculpted curved cut-out with zero layout shift.
2. **Task Creation & Completion**:
   - `createTask(data)`: Prepend to state, write to `localStorage`, trigger Firestore `setDoc(doc(db, 'students', uid, 'tasks', taskId), data)`.
   - `toggleTask(id)`: Invert `completed`, update completion counters, record timestamp in background.
3. **Questionnaire Integration**:
   - Seamlessly links to the existing `loadQuestionnaireSession` and `StudentInsightDashboard` components, allowing students to retake or view their completed insight profile without navigating away from the dashboard environment.
4. **Theme Switch**:
   - Clicking theme buttons sets `dashboardTheme` in state and writes to `localStorage` and Firestore user preferences. Styles adapt immediately.

---

## 5. Verification & Testing Plan

1. **Authentication Boundary**: Verify that visiting `/login` as an authenticated student redirects directly to `/dashboard`. Verify that logging out clears both Firebase Auth and local session, redirecting cleanly to `/login`.
2. **Curved Navigation Geometry**: Inspect the royal-blue sidebar on desktop to ensure the selected tab white background seamlessly blends into the main page background with sculpted top and bottom scoop fillets.
3. **Responsive Breakpoints**: Test layout on desktop (1440px), tablet (768px), and mobile (375px) to ensure no horizontal overflow and full accessibility of all four views.
4. **Task CRUD & Categories**: Add tasks across all four confirmed categories (Schoolwork, Revision, Personal Projects, General), test filtering, completion toggling, and persistence after page reload.
5. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to verify clean build without TypeScript or styling regressions.
