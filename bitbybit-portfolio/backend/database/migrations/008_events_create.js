/**
 * Migration: 008_events_create.js
 * Purpose: Create the events collection with schema validation and indexes
 */

module.exports = {
  async up(db, client) {
    await db.createCollection("events", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "date", "createdAt", "updatedAt"],
          additionalProperties: false,
          properties: {
            _id: {
              bsonType: "binData",
              description: "UUID identifier"
            },
            userId: {
              bsonType: "binData",
              description: "Reference to users._id"
            },
            createdBy: {
              bsonType: "binData",
              description: "Creator of the event"
            },
            title: {
              bsonType: "string",
              description: "Short label for the event",
              minLength: 1,
              maxLength: 100
            },
            description: {
              bsonType: "string",
              description: "Short memory note",
              maxLength: 500
            },
            date: {
              bsonType: "date",
              description: "Event date"
            },
            tags: {
              bsonType: "array",
              items: { bsonType: "string" },
              uniqueItems: true
            },
            visibility: {
              enum: ["PUBLIC", "PRIVATE", "SUPPORT_ONLY"],
              description: "Access level for caregivers/family"
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
            media: {
              bsonType: "array",
              description: "Associated media files",
              items: {
                bsonType: "object",
                required: ["id", "url", "type"],
                properties: {
                  id: { bsonType: "binData", description: "UUID identifier" },
                  url: { bsonType: "string", description: "Path or URL", maxLength: 512 },
                  type: {
                    enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"],
                    description: "Media type"
                  },
                  caption: { bsonType: "string", description: "Optional caption", maxLength: 280 }
                }
              }
            }
          }
        }
      }
    });

    // Indexes
    await db.collection("events").createIndex(
      { userId: 1, date: 1 },
      { name: "idx_user_timeline" }
    );

    await db.collection("events").createIndex(
      { tags: 1 },
      { name: "idx_tags" }
    );
  },

  async down(db, client) {
    await db.collection("events").drop();
  }
};