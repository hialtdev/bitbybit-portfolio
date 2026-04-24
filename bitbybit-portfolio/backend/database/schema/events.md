# events.md

## Purpose
This file documents the **Events collection** for BitByBit.  
It defines schema, indexes, and seed data for replayable migrations.

## Conventions
- All dates stored in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).
- Event IDs are UUIDs for uniqueness.
- Role-based access enforced: only support users can create/edit events.

---

## Schema

Each event document follows this structure:

- **_id**: UUID (string)
- **title**: string (required, 100 char max)
- **description**: string (optional, 500 char max)
- **date**: ISO 8601 datetime (required)
- **createdBy**: UUID reference to Users collection (required)
- **visibility**: enum ("public", "private", "support-only")
- **tags**: array of strings (optional)
- **createdAt**: ISO 8601 datetime (auto-generated)
- **updatedAt**: ISO 8601 datetime (auto-updated)

### Indexes
- Unique index on **_id**
- Compound index on **date** + **visibility** for efficient timeline queries
- Optional text index on **title** + **description** for search

---

## Migration Notes

- **Replayable Migrations**
    - Each migration script must be idempotent (safe to run multiple times).
    - Use versioned filenames: `V1__create_events_collection.js`, `V2__add_visibility_index.js`, etc.
    - Maintain a changelog entry in `migrations.md` for every schema change.

- **Seed Data Strategy**
    - Keep seed files atomic: one file per collection (`events.seed.json`).
    - Ensure UUIDs are stable across replays to avoid duplicate entries.
    - Use minimal starter events for initial seeding; expand later with additional files.

- **Rollback**
    - Provide rollback scripts for destructive changes (e.g., dropping indexes).
    - Rollbacks should restore the previous state without data loss.

---

## Seed Data (Initial Events)

Minimal starter events for testing timeline and role-based access:

[
{
"_id": "11111111-1111-1111-1111-111111111111",
"title": "Doctor Appointment",
"description": "Routine check-up with primary care physician.",
"date": "2025-01-15T09:00:00Z",
"createdBy": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
"visibility": "private",
"tags": ["health", "personal"],
"createdAt": "2025-01-01T12:00:00Z",
"updatedAt": "2025-01-01T12:00:00Z"
},
{
"_id": "22222222-2222-2222-2222-222222222222",
"title": "Family Dinner",
"description": "Dinner with family at home.",
"date": "2025-01-20T18:30:00Z",
"createdBy": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
"visibility": "public",
"tags": ["family", "social"],
"createdAt": "2025-01-05T14:00:00Z",
"updatedAt": "2025-01-05T14:00:00Z"
},
{
"_id": "33333333-3333-3333-3333-333333333333",
"title": "Support Group Meeting",
"description": "Monthly memory support group session.",
"date": "2025-01-25T10:00:00Z",
"createdBy": "cccccccc-cccc-cccc-cccc-cccccccccccc",
"visibility": "support-only",
"tags": ["support", "community"],
"createdAt": "2025-01-10T09:00:00Z",
"updatedAt": "2025-01-10T09:00:00Z"
}
]

---

## Seed Data (Additional Events)

[
{
"_id": "44444444-4444-4444-4444-444444444444",
"title": "Birthday Celebration",
"description": "Celebrating Alex's birthday with friends at the park.",
"date": "2025-02-02T15:00:00Z",
"createdBy": "dddddddd-dddd-dddd-dddd-dddddddddddd",
"visibility": "public",
"tags": ["birthday", "friends", "celebration"],
"createdAt": "2025-01-20T10:00:00Z",
"updatedAt": "2025-01-20T10:00:00Z"
},
{
"_id": "55555555-5555-5555-5555-555555555555",
"title": "Medication Reminder",
"description": "Take prescribed medication after breakfast.",
"date": "2025-02-05T08:30:00Z",
"createdBy": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
"visibility": "private",
"tags": ["health", "reminder"],
"createdAt": "2025-01-25T09:00:00Z",
"updatedAt": "2025-01-25T09:00:00Z"
},
{
"_id": "66666666-6666-6666-6666-666666666666",
"title": "Volunteer Event",
"description": "Community clean-up organized by local support group.",
"date": "2025-02-10T09:00:00Z",
"createdBy": "ffffffff-ffff-ffff-ffff-ffffffffffff",
"visibility": "support-only",
"tags": ["community", "volunteer"],
"createdAt": "2025-01-30T11:00:00Z",
"updatedAt": "2025-01-30T11:00:00Z"
}
]

---

## Best Practices

- **Changelog Discipline**
    - Record every schema or seed change in `migrations.md`.
    - Include date, author, and rationale for transparency.

- **Versioning**
    - Increment migration versions consistently (V1, V2, V3…).
    - Keep seed data stable across environments to avoid drift.

- **Replay Notes**
    - Ensure migrations and seeds can be replayed without duplication.
    - Validate UUIDs and indexes before committing.

- **Collaboration**
    - Use markdown templates for documenting new fields or indexes.
    - Encourage peer review of migration scripts before deployment.