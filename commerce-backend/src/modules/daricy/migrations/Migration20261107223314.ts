import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261107223314 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "daricy_cart_binding" add column if not exists "request_fingerprint" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "daricy_cart_binding" drop column if exists "request_fingerprint";`);
  }

}
