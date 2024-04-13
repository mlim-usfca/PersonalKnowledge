create extension if not exists pg_net with schema extensions;
create extension if not exists vector with schema extensions;

create table document_sections (
  id bigint primary key generated always as identity,
  link_id bigint not null references links (id),
  content text not null,
  embedding vector (384),
  tag text
);

create index on document_sections using hnsw (embedding vector_ip_ops);

-- alter table document_sections enable row level security;

-- create policy "Users can insert document sections"
-- on document_sections for insert to authenticated with check (
--   document_id in (
--     select id
--     from documents
--     where created_by = auth.uid()
--   )
-- );

-- create policy "Users can update their own document sections"
-- on document_sections for update to authenticated using (
--   document_id in (
--     select id
--     from documents
--     where created_by = auth.uid()
--   )
-- ) with check (
--   document_id in (
--     select id
--     from documents
--     where created_by = auth.uid()
--   )
-- );

-- create policy "Users can query their own document sections"
-- on document_sections for select to authenticated using (
--   document_id in (
--     select id
--     from documents
--     where created_by = auth.uid()
--   )
-- );

create function supabase_url()
returns text
language plpgsql
security definer
as $$
declare
  secret_value text;
begin
  select decrypted_secret into secret_value from vault.decrypted_secrets where name = 'supabase_url';
  return secret_value;
end;
$$;