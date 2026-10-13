# DeRote Student Insight System — Security Specification

## 1. Data Invariants

### 1.1 Student Profile Identity (`/students/{studentId}`)
- **Identity Lock**: `{studentId}` must be a valid identifier. When authenticated, writes can only be made by the student or an admin.
- **PII Isolation**: Direct blanket list queries (`allow list: if false`) prevent scraping student rosters. Individual read (`get`) is restricted to the owning student or authorized administrators.
- **Key Integrity**: Enforce required fields (`id`, `fullName`, `classGrade`, `schoolName`, `phone`, `createdAt`). Shadow or injection keys are rejected.
- **Immutability**: `id` and `createdAt` cannot be modified across updates (`incoming().id == existing().id && incoming().createdAt == existing().createdAt`).

### 1.2 Questionnaire Sessions (`/students/{studentId}/sessions/{sessionId}`)
- **Relational Parent Binding**: Every session resides as a subcollection under `/students/{studentId}`.
- **Author Identity Check**: `incoming().studentId == studentId` enforces strict matching.
- **Terminal State Locking**: Once `status == 'submitted'`, answers cannot be modified or rewritten, ensuring integrity of finalized reflective responses.
- **Immutable Timestamps**: `createdAt` remains unchanged after initialization.

### 1.3 Privacy & Data Requests (`/privacy_requests/{requestId}`)
- **Intake Integrity**: Any student or guardian can submit a privacy/data request (`create`).
- **Update Protection**: Privacy requests can only be reviewed, updated, or resolved by administrators (`isAdmin()`).
- **No Client Deletions**: Deletions are forbidden from client SDKs to maintain an immutable compliance audit log.

### 1.4 Admin Accounts (`/admins/{adminId}`)
- **Read & Write Restriction**: Only verified institutional admins (`exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or bootstrapped admin `contact@derote.in`) can read or modify administrator records.

---

## 2. The "Dirty Dozen" Threat Payloads

1. **Unauthenticated Student Profile Tampering**: Attacker attempts to `update` `/students/student_101` without auth credentials -> **PERMISSION_DENIED**.
2. **Cross-Student Identity Spoofing**: User `uid_student_A` submits questionnaire session into `/students/uid_student_B/sessions/sess_1` -> **PERMISSION_DENIED**.
3. **Blanket Student Roster Scraping**: Querying `collection(db, 'students')` without document targeting -> **PERMISSION_DENIED**.
4. **ID Poisoning / Buffer Overflow Attack**: Attacker supplies 2048-byte malicious junk characters as `{studentId}` or `{sessionId}` -> **PERMISSION_DENIED** via `isValidId()`.
5. **Path Traversal / Dangerous Characters**: Document ID containing `../` or special control characters -> **PERMISSION_DENIED** via regex `^[a-zA-Z0-9_\-]+$`.
6. **Post-Submission Answer Tampering**: Attacker attempts to update a session whose `status` is already `'submitted'` -> **PERMISSION_DENIED** via terminal state lock.
7. **Privacy Audit Deletion**: Attacker attempts `deleteDoc()` on `/privacy_requests/req_999` -> **PERMISSION_DENIED**.
8. **Student Modifying Admin Roles**: Non-admin attempting to write to `/admins/{adminId}` -> **PERMISSION_DENIED**.
9. **Volumetric Flood Attack (Denial of Wallet)**: Attacker attempts to write a 1MB payload string to `studentName` -> **PERMISSION_DENIED** via `.size() <= 120`.
10. **Immutable Timestamp Mutation**: Client attempts to forge or rewind `createdAt` on an existing student record -> **PERMISSION_DENIED**.
11. **Arbitrary Collection Write (Catch-All Protection)**: Attempting to create documents in an unmapped collection like `/config` or `/evaluations` -> **PERMISSION_DENIED** via catch-all block.
12. **Anonymous Admin Escalation**: User without verified admin document claiming administrative rights -> **PERMISSION_DENIED**.

---

## 3. Test Runner Coverage
The test matrix enforces that all 12 payloads are tested against the Firestore emulator or rules validator, guaranteeing zero logic leaks, strict ABAC compliance, and zero update-gap exposure.
