# Users Collection Documentation

## Schema

### Identity
- `_id`: MongoDB ObjectId (auto-generated)
- `email`: String; lowercase; unique; required
- `username`: String; lowercase; unique; optional if relying on email-only login

### Authentication
- `authProvider`: Enum: `local`, `google`, `github`, `microsoft`, `okta`; required
- `passwordHash`: String; required for `local` accounts only
- `salt`: String; required for `local` if salted hashing is used
- `roles`: Array of strings (`user`, `admin`, `support`); default `["user"]`
- `status`: Enum: `active`, `invited`, `disabled`, `locked`; required

### Profile
- `profile`: Object (optional)
    - `name`: String
    - `displayName`: String
    - `avatarPath`: String (local/CDN path)
    - `bio`: String
    - `location`: String

### Activity & Audit
- `createdAt`: Date; required
- `updatedAt`: Date; required; updated on every write
- `lastLoginAt`: Date; optional
- `loginCount`: Integer; optional; non-negative

### Security Features
- `mfaEnabled`: Boolean; default `false`
- `mfaMethods`: Array of strings (`totp`, `webauthn`, `sms`); empty if `mfaEnabled=false`
- `emailVerification`: Object
    - `verified`: Boolean; default `false`
    - `verifiedAt`: Date; nullable; present only when `verified=true`
- `passwordReset`: Object
    - `pending`: Boolean; default `false`
    - `requestedAt`: Date; nullable; present when `pending=true`

---

## Validation Rules
- **Email:** Must be lowercase, trimmed, and match regex; unique
- **Username:** Lowercase, alphanumeric plus `-`/`_`; length 3–32; unique if present
- **Provider-bound:**
    - `local` → requires `passwordHash` (and `salt` if used)
    - non-`local` → omit `passwordHash` and `salt`
- **Enums:** `status ∈ {active, invited, disabled, locked}`; `roles` from bounded set
- **Temporal fields:** `createdAt` and `updatedAt` required; `verifiedAt` only if `verified=true`

---

## Indexes

### Unique Indexes
- **Email**
  ```js
  db.users.createIndex(
    { email: 1 },
    { unique: true, name: "unique_email" }
  )