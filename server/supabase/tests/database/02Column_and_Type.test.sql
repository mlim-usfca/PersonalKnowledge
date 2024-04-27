BEGIN;

SELECT plan(30);

-- Table links
SELECT has_column('links', 'id');
SELECT col_type_is('public', 'links', 'id', 'bigint', 'links.id is bigint');

SELECT has_column('links', 'link');
SELECT col_type_is('public', 'links', 'link', 'text', 'links.link is text');

SELECT has_column('links', 'owner');
SELECT col_type_is('public', 'links', 'owner', 'uuid', 'links.owner is uuid');

SELECT has_column('links', 'owner_email');
SELECT col_type_is('public', 'links', 'owner_email', 'text', 'links.owner_email is text');

SELECT has_column('links', 'purpose');
SELECT col_type_is('public', 'links', 'purpose', 'character varying', 'links.purpose is character varying');


-- Table document_sections
SELECT has_column('document_sections', 'id');
SELECT col_type_is('public', 'document_sections', 'id', 'bigint', 'document_sections.id is bigint');

SELECT has_column('document_sections', 'content');
SELECT col_type_is('public', 'document_sections', 'content', 'text', 'document_sections.content is text');

SELECT has_column('document_sections', 'embedding');
SELECT col_type_is('public', 'document_sections', 'embedding', 'vector(384)', 'document_sections.embedding is vector(384)');

SELECT has_column('document_sections', 'link_id');
SELECT col_type_is('public', 'document_sections', 'link_id', 'bigint', 'document_sections.link_id is bigint');


-- Table categories
SELECT has_column('categories', 'category_name');
SELECT col_type_is('categories', 'category_name', 'character varying', 'categories.category_name is character varying');

SELECT has_column('categories', 'id');
SELECT col_type_is('categories', 'id', 'bigint', 'categories.id is bigint');

SELECT has_column('categories', 'user_id');
SELECT col_type_is('categories', 'user_id', 'uuid', 'categories.user_id is uuid');


-- Table category_link_relation
SELECT has_column('category_link_relation', 'link');
SELECT col_type_is('category_link_relation', 'link', 'text', 'category_link_relation.link is text');

SELECT has_column('category_link_relation', 'category');
SELECT col_type_is('category_link_relation', 'category', 'character varying', 'category_link_relation.category is character varying');

SELECT has_column('category_link_relation', 'creator');
SELECT col_type_is('category_link_relation', 'creator', 'uuid', 'category_link_relation.creator is uuid');

SELECT * FROM finish();

ROLLBACK;
