/**
 * Migration: 009_create_audit_logs.js
 * Purpose: Create the audit_logs collection with indexes
 */

async function up(db, client) {
  // Create audit_logs collection
  await db.createCollection("audit_logs");

  // Add useful indexes for querying
  await db.collection("audit_logs").createIndex({ userId: 1 });
  await db.collection("audit_logs").createIndex({ entityType: 1, entityId: 1 });
  await db.collection("audit_logs").createIndex({ timestamp: -1 });
}

async function down(db, client) {
  // Drop audit_logs collection if rolling back
  await db.collection("audit_logs").drop();
}

module.exports = { up, down };