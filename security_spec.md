# DeRote Student Insight System — Security Specification

## 1. Data Invariants
- **Student Profile Identity (`/students/{studentId}`)**:
  - The document key `{studentId}` must strictly equal `request.auth.uid`.
  - Only the authenticated owner can access (`get`) their own profile.
  - Blanket queries (`list`) across `/students` are explicitly forbidden (`allow list: if false;`) to protect student privacy and Personally Identifiable Information (PII).
  - Document IDs must satisfy `isValidId(studentId)` (regex `^[a-zA-Z0-9_\-]+$`, length <= 128).
  - Immutability: The `id` field cannot be modified during updates (`request.resource.data.id == resource.data.id`).
- **Student Login Log (`/students/{studentId}/logins/{loginId}`)**:
  - Subcollection records belong to `{studentId}` where `{studentId} == request.auth.uid`.
  - Login records can only be created by the authenticated student (`isOwner(studentId)`).
  - Mutations (`update`) and deletions (`delete`) are blocked to preserve an immutable audit trail.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Profile Creation**: Request without `request.auth` attempting `create` on `/students/abc` -> **PERMISSION_DENIED**.
2. **Spoofed Owner Write**: Authenticated user `uid_123` attempting to write to `/students/uid_456` -> **PERMISSION_DENIED**.
3. **Blanket Collection Scrape**: Authenticated user querying all documents in `/students` -> **PERMISSION_DENIED**.
4. **ID Poisoning Attack**: Attempting document ID with 2KB junk characters -> **PERMISSION_DENIED** via `isValidId()`.
5. **Path Traversal / Special Char ID**: Document ID containing `../` or `%20` -> **PERMISSION_DENIED** via regex validation.
6. **Cross-Tenant Audit Tampering**: User `uid_123` creating login log under `/students/uid_456/logins/log_1` -> **PERMISSION_DENIED**.
7. **Audit Record Alteration**: Attempting to `update` a document in `/students/{studentId}/logins/{loginId}` -> **PERMISSION_DENIED**.
8. **Audit Record Deletion**: Attempting to `delete` a login record -> **PERMISSION_DENIED**.
9. **Name Buffer Overflow**: Attempting `fullName` greater than 120 characters -> **PERMISSION_DENIED** via `isValidStudent()`.
10. **Immutable Field Tampering**: Attempting to modify `id` during profile update -> **PERMISSION_DENIED**.
11. **Arbitrary Collection Write**: Attempting write to unmapped collection `/system_config` -> **PERMISSION_DENIED** via global catch-all.
12. **Anonymous PII Leak**: Unauthenticated client attempting `get` on `/students/{studentId}` -> **PERMISSION_DENIED**.
