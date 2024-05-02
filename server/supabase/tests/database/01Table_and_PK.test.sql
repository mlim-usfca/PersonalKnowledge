BEGIN;
SELECT plan(8); 

SELECT has_table('links');
SELECT col_is_pk('links', 'link');

SELECT has_table('document_sections');
SELECT col_is_pk('document_sections', 'id');

SELECT has_table('categories');
SELECT col_is_pk('categories', 'category_name');

SELECT has_table('category_link_relation');
SELECT col_is_pk('category_link_relation', ARRAY['link', 'category']);

SELECT * FROM finish();
ROLLBACK;
