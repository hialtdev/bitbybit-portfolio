# audit_log.md

## Purpose
This file documents the **AuditLog collection** for BitByBit.  
It defines schema, indexes, and seed data for replayable migrations.

## Conventions
- All timestamps stored in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).
- Audit entries are immutable: once written, they are never updated or deleted.
- Each entry links to a **User** and optionally an **Event**.

---

## Schema

Each audit log document follows this structure:

- **_id**: UUID (string, required, unique)
- **userId**: UUID reference to Users collection (required)
- **eventId**: UUID reference to Events collection (optional)
- **action**: enum ("CREATED", "UPDATED", "DELETED", "VIEWED", "STATUS_CHANGED")
- **notes**: string (optional, 500 char max)
- **createdAt**: ISO 8601 datetime (required, immutable)

### Indexes
- Unique index on **_id**
- Compound index on **userId** + **createdAt** for chronological queries
- Optional compound index on **eventId** + **action** for event‑specific audits

---

## Migration Notes

- **Replayable Migrations**
    - Each migration script must be idempotent (safe to run multiple times).
    - Use versioned filenames: `V1__create_audit_log_collection.js`, `V2__add_userId_index.js`, etc.
    - Maintain a changelog entry in `migrations.md` for every schema change.

- **Seed Data Strategy**
    - Keep seed files atomic: one file per collection (`audit_log.seed.json`).
    - Ensure UUIDs are stable across replays to avoid duplicate entries.
    - Seed entries should represent realistic actions (CREATED, UPDATED, VIEWED).

- **Rollback**
    - Provide rollback scripts for destructive changes (e.g., dropping indexes).
    - Rollbacks should restore the previous state without data loss.

---

## Seed Data (Initial Audit Logs)

[
{
"_id": "aaaa1111-aaaa-1111-aaaa-111111111111",
"userId": "11111111-1111-1111-1111-111111111111",
"eventId": "22222222-2222-2222-2222-222222222222",
"action": "CREATED",
"notes": "User created a new event: Family Dinner",
"createdAt": "2025-01-05T14:05:00Z"
},
{
"_id": "bbbb2222-bbbb-2222-bbbb-222222222222",
"userId": "11111111-1111-1111-1111-111111111111",
"eventId": "33333333-3333-3333-3333-333333333333",
"action": "VIEWED",
"notes": "User viewed Support Group Meeting details",
"createdAt": "2025-01-10T09:15:00Z"
},
{
"_id": "cccc3333-cccc-3333-cccc-333333333333",
"userId": "22222222-2222-2222-2222-222222222222",
"eventId": "11111111-1111-1111-1111-111111111111",
"action": "UPDATED",
"notes": "Support user updated Doctor Appointment notes",
"createdAt": "2025-01-12T10:30:00Z"
}
]

---

## Seed Data (Additional Audit Logs)

[
{
"_id": "dddd4444-dddd-4444-dddd-444444444444",
"userId": "33333333-3333-3333-3333-333333333333",
"eventId": "44444444-4444-4444-4444-444444444444",
"action": "DELETED",
"notes": "Support user deleted Birthday Celebration event",
"createdAt": "2025-02-02T16:00:00Z"
},
{
"_id": "eeee5555-eeee-5555-eeee-555555555555",
"userId": "22222222-2222-2222-2222-222222222222",
"eventId": "55555555-5555-5555-5555-555555555555",
"action": "STATUS_CHANGED",
"notes": "Medication Reminder marked as completed",
"createdAt": "2025-02-05T09:00:00Z"
},
{
"_id": "ffff6666-ffff-6666-ffff-666666666666",
"userId": "11111111-1111-1111-1111-111111111111",
"eventId": "66666666-6666-6666-6666-666666666666",
"action": "VIEWED",
"notes": "User viewed Volunteer Event details",
"createdAt": "2025-02-10T09:15:00Z"
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

- **Immutability**
    - Audit logs must never be updated or deleted once created.
    - New entries should always append, preserving historical accuracy.

- **Collaboration**
    - Use markdown templates for documenting new actions or fields.
    - Encourage peer review of migration scripts before deployment.