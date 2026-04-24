/**
 * @author Robert Glasser
 * @copyright 2026 Robert Glasser. All rights reserved.
 */
import type { Media } from "./Media";

export interface Event {
    id: string;                // UUID string
    title: string;
    description?: string;
    date: string;              // ISO date string
    createdBy: string;         // UUID string
    visibility: "PRIVATE" | "PUBLIC" | "ROLE_BASED"; // match backend enum
    tags?: string[];
    createdAt: string;         // ISO timestamp
    updatedAt: string;         // ISO timestamp
    media?: Media | null;      // single media object or null
}