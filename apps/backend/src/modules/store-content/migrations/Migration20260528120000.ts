import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260528120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "store_content" ("id" text not null, "key" text not null, "data" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_content_pkey" primary key ("id"));'
    )
    this.addSql(
      'create unique index if not exists "IDX_store_content_key_unique" on "store_content" ("key") where deleted_at is null;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "store_content" cascade;')
  }
}
