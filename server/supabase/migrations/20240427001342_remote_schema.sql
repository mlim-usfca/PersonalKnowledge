alter table "public"."links" drop constraint "public_links_owner_fkey";

alter table "public"."document_sections" drop column "tag";

alter table "public"."links" drop column "content";

alter table "public"."links" drop column "tag";

alter table "public"."links" add constraint "links_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) not valid;

alter table "public"."links" validate constraint "links_owner_fkey";


