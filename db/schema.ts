import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const accountEdits=sqliteTable('account_edits',{ownerId:text('owner_id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull(),updatedAt:text('updated_at').notNull()});
export const backendRateLimits=sqliteTable('backend_rate_limits',{bucketKey:text('bucket_key').primaryKey(),hits:integer('hits').notNull(),expiresAt:integer('expires_at').notNull()});
export const paymentEventReceipts=sqliteTable('payment_event_receipts',{eventId:text('event_id').primaryKey(),eventType:text('event_type').notNull(),status:text('status').notNull(),receivedAt:text('received_at').notNull()});

// Customer identity is independent of the managed studio identity.
export const customers=sqliteTable('customers',{
 id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),
 passwordHash:text('password_hash').notNull(),passwordVersion:integer('password_version').notNull(),
 resetHash:text('reset_hash').unique(),resetExpiresAt:integer('reset_expires_at'),createdAt:integer('created_at').notNull(),
});
export const customerSessions=sqliteTable('customer_sessions',{
 tokenHash:text('token_hash').primaryKey(),customerId:text('customer_id').notNull().references(()=>customers.id,{onDelete:'cascade'}),
 passwordVersion:integer('password_version').notNull(),expiresAt:integer('expires_at').notNull(),
});
export const customerAddresses=sqliteTable('customer_addresses',{
 id:text('id').primaryKey(),customerId:text('customer_id').notNull().references(()=>customers.id,{onDelete:'cascade'}),payload:text('payload').notNull(),createdAt:integer('created_at').notNull(),
});
// Only a trusted commerce reconciliation service may write verified orders here.
// Never associate orders by an unverified email address or accept order totals from the browser.
export const customerOrders=sqliteTable('customer_orders',{
 id:text('id').primaryKey(),customerId:text('customer_id').notNull().references(()=>customers.id,{onDelete:'cascade'}),payload:text('payload').notNull(),placedAt:integer('placed_at').notNull(),
});
