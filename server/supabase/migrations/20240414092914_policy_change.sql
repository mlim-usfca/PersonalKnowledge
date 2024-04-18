create policy "Enable delete for users based on user_id"
on "public"."categories"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable select for authenticated users only"
on "public"."categories"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for authenticated users only"
on "public"."categories"
as permissive
for update
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable delete for authenticated users only"
on "public"."category_link_relation"
as permissive
for delete
to authenticated
using ((auth.uid() = creator));


create policy "Enable select for authenticated users only"
on "public"."category_link_relation"
as permissive
for select
to authenticated
using ((auth.uid() = creator));


create policy "Enable update for authenticated users only"
on "public"."category_link_relation"
as permissive
for update
to authenticated
with check ((auth.uid() = creator));



