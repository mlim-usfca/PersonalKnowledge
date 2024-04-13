import { createClient } from '@supabase/supabase-js';
import { Database } from '../_lib/database.ts';
import { processMarkdown } from '../_lib/markdown-parser.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
};

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
        JSON.stringify({
          error: 'Missing environment variables.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
    );
  }

  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return new Response(
        JSON.stringify({ error: `No authorization header passed` }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        authorization,
      },
    },
    auth: {
      persistSession: false,
    },
  });

  const requestBody = await req.json();
  const link_id = await requestBody.link_id;
  console.log("link id is:",link_id);
  // const extracted_content = await requestBody.extracted_content;
  // console.log("extracted_content is:",extracted_content);


  if (!link_id) {
    return new Response(
        JSON.stringify({ error: 'no link_id or extracted_content provided in request body' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
    );
  }

  const {data, err} = await supabase
      .from('links')
      .select('content').eq('id', link_id);

  if (err) {
    return new Response(
        JSON.stringify({
          error: err.message,
        }),
        {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        }
    );
  }

  if (!data) {
    return new Response(
        JSON.stringify({
          error: 'No data found',
        }),
        {
          status: 404,
          headers: {'Content-Type': 'application/json'},
        }
    );
  }

  console.log(data);

  const {content} = data[0];

  if(!content){
    return new Response(
        JSON.stringify({
          error: 'No extracted content found',
        }),
        {
          status: 404,
          headers: {'Content-Type': 'application/json'},
        }
    );
  }

  const processedMd = processMarkdown(content);

  const { error } = await supabase.from('document_sections').insert(
      processedMd.sections.map(({ content }) => ({
        link_id,
        content,
      }))
  );

  if (error) {
    console.error(error);
    return new Response(
        JSON.stringify({ error: 'Failed to save document sections' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
    );
  }

  console.log(
      `Saved ${processedMd.sections.length} sections for link '${link_id}'`
  );

  return new Response(null, {
    status: 204,
    headers: { 'Content-Type': 'application/json' },
  });
});
