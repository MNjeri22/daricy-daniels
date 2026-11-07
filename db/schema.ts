import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const accountEdits=sqliteTable('account_edits',{ownerId:text('owner_id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull(),updatedAt:text('updated_at').notNull()});
export const backendRateLimits=sqliteTable('backend_rate_limits',{bucketKey:text('bucket_key').primaryKey(),hits:integer('hits').notNull(),expiresAt:integer('expires_at').notNull()});
export const paymentEventReceipts=sqliteTable('payment_event_receipts',{eventId:text('event_id').primaryKey(),eventType:text('event_type').notNull(),status:text('status').notNull(),receivedAt:text('received_at').notNull()});
