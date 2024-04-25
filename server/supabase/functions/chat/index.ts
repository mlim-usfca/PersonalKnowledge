import { createClient } from '@supabase/supabase-js';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { codeBlock } from 'common-tags';
import OpenAI from 'openai';
import {env, pipeline} from "@xenova/transformers";

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// These are automatically injected
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
      'Authorization, X-Client-Info, apikey, Content-Type',
};

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const generateEmbedding = await pipeline(
    'feature-extraction',
    'Supabase/gte-small'
);

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
        JSON.stringify({
          error: 'Missing environment variables.',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
        }
    );
  }

  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return new Response(
        JSON.stringify({ error: `No authorization header passed` }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
        }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        authorization,
      },
    },
    auth: {
      persistSession: false,
    },
  });

  const { messages, embedding, tag} = await req.json();

  if (!messages || !embedding) {
    return new Response(
        JSON.stringify({
          error: 'Missing required parameters.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
    );
  }

  let tagFilter:string = ""

  if (tag) {
    tagFilter  = tag.toString().toLowerCase();
  }

  const { data: documents, error: matchError } = await supabase
      .rpc('match_document_sections', {
        embedding,
        match_threshold: 0.8,
        tag: tagFilter
      })
      .select('content')
      .limit(5);

  if (matchError) {
    console.error(matchError);

    return new Response(
        JSON.stringify({
          error: 'There was an error reading your documents, please try again.',
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
        }
    );
  }

  const injectedDocs =
      documents && documents.length > 0
          ? documents.map(({ content }) => content).join('\n\n')
          : 'No documents found';

  const completionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: codeBlock`
        You're an AI assistant who answers questions about documents.
        
        You're a chat bot, so keep your replies succinct.
        
        You're only allowed to use the documents below to answer the question.
        
        If the question isn't related to these documents, say:
        "Sorry, I couldn't find any information on that."
        
        If the information isn't available in the below documents, say:
        "Sorry, I couldn't find any information on that."
        
        Do not go off topic.
        
        Documents:
        ${injectedDocs}
      `,
        },
        ...messages,
      ];


  const completionStream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    messages: completionMessages,
    max_tokens: 1000,
    temperature: 0,
    stream: true,
  });

  const stream = OpenAIStream(completionStream);
  const textResponse = new StreamingTextResponse(stream, { 
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/plain',
    },
  });
  console.log("tresponse" , textResponse);
    // const reader = textResponse.body.getReader();
    // if (!reader) {
    //     console.error('No reader');
    //     return;
    // }
    //
    // let received = 0;
    // let chunks = [];
    //
    // while (true) {
    //     const { done, value } = await reader.read();
    //     if (done) {
    //         break;
    //     }
    //     received += value.length;
    //     chunks.push(value);
    // }
    //
    // const all = new Uint8Array(received);
    // let offset = 0;
    // for (const chunk of chunks) {
    //     all.set(chunk, offset);
    //     offset += chunk.length;
    // }
    //
    // const decoder = new TextDecoder();
    // const result = decoder.decode(all);
    //
    // console.log(result);

    // send this result in a Response
    return textResponse;
});
