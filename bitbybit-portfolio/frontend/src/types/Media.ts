/**
 * @author Robert Glasser
 * @copyright 2026 Robert Glasser. All rights reserved.
 */
// types/Media.ts

export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface Media {
    id: string;          // UUID string
    url: string;         // path or URL to the file
    type: MediaType;     // matches backend enum
    caption?: string;    // optional description
    featured: boolean;   // true if this is the featured image
}