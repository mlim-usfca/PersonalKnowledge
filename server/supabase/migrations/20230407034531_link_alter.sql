alter table "public"."links" add column "owner_email" text;

alter table "public"."links" add column "purpose" character varying;

alter table "public"."links" alter column "owner" drop not null;


