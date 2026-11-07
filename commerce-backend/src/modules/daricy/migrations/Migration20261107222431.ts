import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261107222431 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "daricy_cart_binding" drop constraint if exists "daricy_cart_binding_request_key_unique";`);
    this.addSql(`alter table if exists "daricy_cart_binding" drop constraint if exists "daricy_cart_binding_cart_id_unique";`);
    this.addSql(`create table if not exists "daricy_cart_binding" ("id" text not null, "cart_id" text not null, "owner_subject" text not null, "request_key" text not null, "revision" integer not null default 1, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "daricy_cart_binding_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_daricy_cart_binding_cart_id_unique" ON "daricy_cart_binding" ("cart_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_daricy_cart_binding_request_key_unique" ON "daricy_cart_binding" ("request_key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_daricy_cart_binding_deleted_at" ON "daricy_cart_binding" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_daricy_cart_binding_owner_subject" ON "daricy_cart_binding" ("owner_subject") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "daricy_cart_binding" cascade;`);
  }

}
