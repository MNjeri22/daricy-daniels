CREATE TABLE `newsletter_cooldowns` (
	`email_hash` text PRIMARY KEY NOT NULL,
	`requested_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `newsletter_requests` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`claim_id` text,
	`claim_until` integer,
	`confirmed_at` integer,
	`result` text
);
