/**
 * @author Robert Glasser
 * @copyright 2026 Robert Glasser. All rights reserved.
 */
export interface AuditLog {
    id: string;           // UUID string
    userId: string;       // UUID string
    eventId?: string;     // UUID string, optional
    action: "CREATED" | "UPDATED" | "DELETED" | "VIEWED" | "STATUS_CHANGED" | "LOGIN" | "LOGIN_FAILED";
    notes?: string;
    createdAt: string;    // ISO timestamp
}