# Titan Workflow Systems — MVP Baseline

Tag: mvp-baseline  
Branch: main  
Verified: Production (Netlify + Supabase)

## Guaranteed Working Features
- Resident profiles
- Notes with inline attachments
- Supabase storage with signed URLs
- Production-safe uploads
- Stable Next.js App Router build
- Environment parity (local = prod)

## Explicit Non-Goals (for MVP)
- Bulk uploads
- Attachment versioning
- Permissions by role
- Editing attachments
- Background processing

## Change Rules
- No direct commits to main
- All changes branch from develop
- Any feature must preserve baseline behavior
- If baseline behavior changes → new tag required
