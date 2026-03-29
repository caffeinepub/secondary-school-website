# Buddha Deep English Boarding School Website

## Current State
Full-stack school website with PIN-only admin panel. The backend uses Internet Identity-based access control (AccessControl module). The `useActor.ts` hook was only initializing admin access (`_initializeAccessControlWithSecret`) for authenticated II users. Since the admin panel was changed to PIN-only (no II login), all backend calls from the admin panel fail with "Unauthorized" because the anonymous caller never gets admin rights.

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- `useActor.ts`: Always call `_initializeAccessControlWithSecret(adminToken)` regardless of whether user is logged in via Internet Identity. This enables PIN-only admin sessions (anonymous principal) to have full backend admin access via the platform secret token.
- `AdminPage.tsx`: Ensure all admin management sections (notices, results, staff/teacher details, principal message, news, gallery, school info, contacts) show proper loading and error feedback.

### Remove
- Nothing to remove

## Implementation Plan
1. `useActor.ts` already fixed — now always calls `_initializeAccessControlWithSecret` for both anonymous and authenticated actors.
2. Validate frontend builds correctly.
3. Verify AdminPage uses `actor` and renders all management sections without errors.
