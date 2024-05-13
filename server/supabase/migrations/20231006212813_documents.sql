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

-- this table is created to store the link_id for the saved links, splitted texts as content, embedding vectors that are created for the chuhnks and 
-- the related tag
