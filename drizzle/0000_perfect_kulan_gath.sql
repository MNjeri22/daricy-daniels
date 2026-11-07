CREATE TABLE `account_edits` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `backend_rate_limits` (
	`bucket_key` text PRIMARY KEY NOT NULL,
	`hits` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment_event_receipts` (
	`event_id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`status` text NOT NULL,
	`received_at` text NOT NULL
);
