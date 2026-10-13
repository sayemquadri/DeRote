# Streamlined Student Consent & Simplified Legal Principles

Refactor the student consent architecture to eliminate the guardian/parent pathway and under-18 bifurcation, condense multi-paragraph privacy and terms notices into clean, single-line summaries with expandable detail accordions, and replace fragmented mandatory acknowledgements with a single, clear consent checkbox.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed during the planning clarification:
> - **Single-Line Accordions**: Legal principles, privacy policies, terms of use, and privacy requests will be shown as concise, single-line summaries by default, with an optional expand toggle for students who wish to read the full clause text. Reading the full text is strictly optional.
> - **Unified Student Consent**: The guardian/parent pathway and "Minors Under 18" picker are removed entirely. All students (Classes 8, 9, 10) directly confirm student consent.
> - **Single Checkbox Acknowledgment**: Replaced four fragmented checkboxes with a single, clean acknowledgment checkbox that unlocks the profile step.

- **Confirmed Decision 1**: All students follow a direct student consent path with no guardian/parent pathway or age bifurcation.
- **Confirmed Decision 2**: Accordion cards feature an upfront 1-line summary with a quiet chevron expander for full legal prose.
- **Confirmed Decision 3**: A single checkbox ("I understand that DeRote is for educational self-reflection...") enables the "Confirm Consent & Continue" action.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms the student onboarding consent step from a heavy, multi-paragraph legal contract into a student-first, friendly privacy snapshot. Each essential policy (Educational Purpose, Data Handling, No School Direct Access, Mentor Access, Terms of Use, Privacy Rights) is stated in a single clear sentence with an on-demand expander.
- **Target Audience / Persona**: Students in Classes 8, 9, and 10 registering for the DeRote self-reflection questionnaire.
- **Key Value**: Lowers cognitive friction and anxiety for students while maintaining transparent data protection disclosures and legal non-clinical disclaimers.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Consent View (Step 1 of Registration)**:
   - Header clearly states: "How DeRote Protects Your Privacy" with subtitle "A quick overview for students before beginning your self-reflection."
   - **Key Principles & Policies (Accordions)**: Displays 5 streamlined cards. Each card displays an icon, bold topic title, and a single-line summary (e.g., *"Educational Purpose: DeRote helps you explore learning preferences and is not a medical or psychological test."*).
   - An intuitive "Details" button with a chevron allows interested students to expand the full legal explanation without leaving the page.
   - **Consent Acknowledgment**: A single, prominent consent card with one checkbox:
     > [ ] *"I understand that DeRote is an educational self-reflection platform (not a psychological assessment) and I agree to the Privacy Policy and Terms of Use."*
   - **Primary Action**: "Confirm Consent & Continue" button enables instantly upon checking.
2. **Transition to Profile (Step 2)**:
   - Smoothly progresses to Step 2 (Full Name, Class 8/9/10, School Name, Mobile Number, Password) as before.

#### Visual Identity & Theme
- **Color Palette**: DeRote Navy (`#062B50`), Royal Blue (`#0866C6`), Ice Blue (`#E8F3FF`), Muted Slate (`#64778C`), Surface Light (`#F8FAFD`).
- **Typography**: Clean hierarchy with `Plus Jakarta Sans` styling, balanced titles (`text-wrap: balance`), and single-line metadata.
- **Accordion Micro-Interactions**: Smooth 180ms ease-in-out height/opacity expansion with rotating chevron indicator.
- **Zero-Pill Discipline**: Unboxed metadata and clean typographic separators for any policy metadata.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Elimination of Guardian Pathway & Under-18 Minor Text**
  - *Chosen Approach*: Remove the dual pathway selector (`student_with_guardian` vs `guardian_direct`) and all guardian name/phone form fields. Treat all student onboarding identically.
  - *Why*: In this phase, the application is used directly by students; guardian registration forms created artificial hurdles and incomplete fields.
  - *Alternatives Considered*: Retaining an optional guardian toggle was discarded because the user explicitly instructed to remove the guardian pathway and under-18 wording now.

- **Decision 2: Single-Line Summaries with Accordion Details**
  - *Chosen Approach*: Each core principle and policy (Purpose, Data Collected, Access Control, Terms, Privacy Rights) is distilled to one legible sentence with an optional accordion trigger.
  - *Why*: Respects student reading attention while preserving comprehensive legal text for curious users or compliance review.

- **Decision 3: Consolidated Checkbox vs Button-Only**
  - *Chosen Approach*: A single explicit checkbox paired with the primary CTA.
  - *Why*: Provides explicit legal consent non-repudiation without subjecting students to four redundant clicks.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       SignupPage.tsx                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Step 1: StudentConsentCard.tsx                      │   │
│   │                                                     │   │
│   │ ┌─────────────────────────────────────────────────┐ │   │
│   │ │ 1. Header: Student Data Protection Snapshot     │ │   │
│   │ └─────────────────────────────────────────────────┘ │   │
│   │ ┌─────────────────────────────────────────────────┐ │   │
│   │ │ 2. Simplified Policy Accordions (Single Lines): │ │   │
│   │ │    • Educational Purpose (Not Psychological)    │ │   │
│   │ │    • Direct DeRote Access & No School Login     │ │   │
│   │ │    • Authorized Mentors & Future Report Prints  │ │   │
│   │ │    • Terms of Use & Respectful Platform Conduct │ │   │
│   │ │    • Privacy Rights & Instant Erasure Requests  │ │   │
│   │ └─────────────────────────────────────────────────┘ │   │
│   │ ┌─────────────────────────────────────────────────┐ │   │
│   │ │ 3. Single Consent Checkbox:                     │ │   │
│   │ │    [✓] Understands purpose & accepts terms      │ │   │
│   │ └─────────────────────────────────────────────────┘ │   │
│   │ ┌─────────────────────────────────────────────────┐ │   │
│   │ │ 4. "Confirm Consent & Continue" Button          │ │   │
│   │ └─────────────────────────────────────────────────┘ │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │ onConsentComplete()          │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Step 2: Student Profile & Credentials Form          │   │
│   │ (Name, Class 8-10, School, Mobile, Password)        │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Component & State Updates
- **`StudentConsentCard.tsx`**:
  - Remove `pathway`, `guardianName`, `guardianPhone`, and guardian validation states.
  - Simplify `ConsentFormData` interface to:
    ```typescript
    export interface ConsentFormData {
      agreedToStudentConsent: boolean;
      timestamp: string;
    }
    ```
  - Implement `expandedItems: Record<string, boolean>` to allow individual accordion expansion.
  - Provide structured 1-line summary array with rich expanded text content for:
    1. *Educational Purpose*
    2. *Direct DeRote Platform & No School Access*
    3. *Authorised Mentors & Future School Printing*
    4. *Terms of Use & Student Code of Conduct*
    5. *Privacy Rights & Data Deletion*
  - Single state `hasAgreed` (boolean) governing button activation.
- **`StudentConsentPage.tsx`**:
  - Sync heading and intro copy to reflect the streamlined student-first consent framework without "Guardian" or "Minors under 18" phrasing.
- **`SignupPage.tsx`**:
  - Receive simplified `ConsentFormData` and pass cleanly into student registration.
