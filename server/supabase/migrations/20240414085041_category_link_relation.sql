alter table "public"."categories" drop constraint "categories_pkey";

alter table "public"."links" drop constraint "links_pkey";

drop index if exists "public"."categories_pkey";

drop index if exists "public"."links_pkey";

create table "public"."category_link_relation" (
    "link" text not null,
    "category" character varying not null,
    "creator" uuid default auth.uid()
);


alter table "public"."category_link_relation" enable row level security;

alter table "public"."categories" alter column "category_name" set not null;

alter table "public"."links" alter column "link" set not null;

CREATE UNIQUE INDEX category_link_relation_pkey ON public.category_link_relation USING btree (link, category);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (category_name);

CREATE UNIQUE INDEX links_pkey ON public.links USING btree (link);

alter table "public"."category_link_relation" add constraint "category_link_relation_pkey" PRIMARY KEY using index "category_link_relation_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."links" add constraint "links_pkey" PRIMARY KEY using index "links_pkey";

alter table "public"."category_link_relation" add constraint "public_category_link_relation_category_fkey" FOREIGN KEY (category) REFERENCES categories(category_name) not valid;

alter table "public"."category_link_relation" validate constraint "public_category_link_relation_category_fkey";

alter table "public"."category_link_relation" add constraint "public_category_link_relation_creator_fkey" FOREIGN KEY (creator) REFERENCES auth.users(id) not valid;

alter table "public"."category_link_relation" validate constraint "public_category_link_relation_creator_fkey";

alter table "public"."category_link_relation" add constraint "public_category_link_relation_link_fkey" FOREIGN KEY (link) REFERENCES links(link) not valid;

alter table "public"."category_link_relation" validate constraint "public_category_link_relation_link_fkey";

grant delete on table "public"."category_link_relation" to "anon";

grant insert on table "public"."category_link_relation" to "anon";

grant references on table "public"."category_link_relation" to "anon";

grant select on table "public"."category_link_relation" to "anon";

grant trigger on table "public"."category_link_relation" to "anon";

grant truncate on table "public"."category_link_relation" to "anon";

grant update on table "public"."category_link_relation" to "anon";

grant delete on table "public"."category_link_relation" to "authenticated";

grant insert on table "public"."category_link_relation" to "authenticated";

grant references on table "public"."category_link_relation" to "authenticated";

grant select on table "public"."category_link_relation" to "authenticated";

grant trigger on table "public"."category_link_relation" to "authenticated";

grant truncate on table "public"."category_link_relation" to "authenticated";

grant update on table "public"."category_link_relation" to "authenticated";

grant delete on table "public"."category_link_relation" to "service_role";

grant insert on table "public"."category_link_relation" to "service_role";

grant references on table "public"."category_link_relation" to "service_role";

grant select on table "public"."category_link_relation" to "service_role";

grant trigger on table "public"."category_link_relation" to "service_role";

grant truncate on table "public"."category_link_relation" to "service_role";

grant update on table "public"."category_link_relation" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."categories"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."category_link_relation"
as permissive
for insert
to authenticated
with check ((auth.uid() = creator));



