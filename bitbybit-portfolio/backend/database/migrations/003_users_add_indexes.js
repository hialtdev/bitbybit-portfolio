/**
 * Migration: 003_users_add_indexes.js
 * Purpose: Add unique indexes to the users collection
 *This version isolates index creation so you can evolve them independently from the collection schema:
 */

module.exports = {
  async up(db, client) {
    // Create unique index on email
    await db.collection("users").createIndex(
      { email: 1 },
      { unique: true, name: "unique_email" }
    );

    // Create unique sparse index on username
    await db.collection("users").createIndex(
      { username: 1 },
      { unique: true, sparse: true, name: "unique_username" }
    );
  },

  async down(db, client) {
    // Drop indexes if rolling back
    await db.collection("users").dropIndex("unique_email");
    await db.collection("users").dropIndex("unique_username");
  }
};