/**
 * Migration: 001_create_users.js
 * Purpose: Create the users collection with schema validation and indexes
 */

module.exports = {
  async up(db, client) {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["_id", "username", "email", "password", "role", "createdAt", "updatedAt"],
          additionalProperties: false,
          properties: {
            _id: {
              bsonType: "binData", // UUID stored as binary subtype 4
              description: "Primary key stored as UUID"
            },
            username: {
              bsonType: "string",
              minLength: 3,
              maxLength: 50,
              pattern: "^[A-Za-z0-9]([A-Za-z0-9-_]*[A-Za-z0-9])$"
            },
            email: {
              bsonType: "string",
              minLength: 5,
              maxLength: 100,
              pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
            },
            password: {
              bsonType: "string",
              minLength: 8,
              maxLength: 255,
              description: "BCrypt-hashed password string"
            },
            role: {
              enum: ["USER", "ADMIN", "SUPPORT"],
              description: "Role enum matching Java Role type"
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    // Unique indexes
    await db.collection("users").createIndex(
      { email: 1 },
      { unique: true, name: "unique_email" }
    );

    await db.collection("users").createIndex(
      { username: 1 },
      { unique: true, sparse: true, name: "unique_username" }
    );
  },

  async down(db, client) {
    await db.collection("users").drop();
  }
};