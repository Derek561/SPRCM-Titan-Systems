Titan Workflow Systems:
Authoritative MVP — Workflow Truth Baseline
Purpose & Ownership

Titan Workflow Systems is a private, purpose-built workflow system designed, owned, and operated exclusively by:
Derek Steinmetz
DSS Enterprises, LLC

Titan is used to support structured operational workflows related to Derek Steinmetz’s professional responsibilities at Simple Path Recovery. 
It is not a general-purpose SaaS product, not a multi-tenant platform, and not intended for public distribution. All architectural, security, and design decisions prioritize:
Correctness over cleverness Predictability over novelty Truth over convenience  If a feature does not work cleanly, it is removed, deconstructed, and rebuilt rather than patched or disguised.

System Philosophy (Non-Negotiable)
Titan follows a strict design doctrine:
Truth before progress
Logic before features
Workflow integrity over UI tricks
No “Jedi mind tricks” to force behavior
If a requirement cannot be expressed clearly in logic, schema, and user flow, it does not belong in the system.

This repository represents a living but disciplined collaboration, where expansion only occurs when:
The current state is fully understood
The data model is correct
The workflow makes operational sense

What Titan Is (MVP Definition)
Titan is a workflow engine, not a records dump.
At MVP stage, Titan manages exactly four core concepts:
Residents
Lifecycle: active → archived
Single source of truth for workflow context
Tasks
Actionable work items
Due dates, categories, completion status
Notes
Human-entered operational context
Ownership-enforced (RLS)
Resident-scoped
History (Audit by Behavior)
Timestamped creation
Status transitions
No silent side effects
That’s it — and that’s intentional.

What Titan Is Not
Titan explicitly does not attempt to be:
An EHR
A billing system
A document management platform
A CRM
A compliance automation toolThose concerns may integrate later, but they are out of scope for this system.

Attachments (Controlled Expansion)
Attachments are an extension of notes, not a standalone feature.
Rules:
Every attachment belongs to exactly one note
Every note belongs to exactly one resident
Storage access is protected by ownership-aware RLS
No orphaned files
No public buckets
No global attachment views
Attachments exist to support workflow context, not file hoarding.

Security & Data Integrity
Titan enforces correctness through:
PostgreSQL Row Level Security (RLS)
Explicit ownership via created_by = auth.uid()
Foreign key constraints with cascading deletes
No anonymous access
No hidden permissions
Security is validated before feature expansion.

Data Strategy
At this stage:
No historical production data is stored
Test data is intentionally disposable
Schema and policy definitions are the primary assets
For real-world usage:
Regular exports will be used to preserve resident data
Schema snapshots act as catastrophic build recovery sources

This repository is the authoritative build reference
Technology Stack
Frontend: Next.js (App Router)
Backend: Supabase (Postgres + Auth + Storage)
Security: Row Level Security (RLS)
Deployment: Vercel
Styling: Tailwind CSS (deliberately restrained)
No unnecessary abstractions.
No premature optimizations.

Development Ethos
This project is developed as a true collaboration, grounded in:
Clear reasoning
Explicit intent
Willingness to stop and reassess
Expansion only occurs when it improves real workflow execution, not theoretical completeness.

Status

Current Stage: MVP v0.1 — Workflow Truth Locked
Next Focus: Attachment flow completion, then controlled data entry

Final Note
Titan exists to work, not to impress.
If it ever stops doing that, it will be rebuilt.
