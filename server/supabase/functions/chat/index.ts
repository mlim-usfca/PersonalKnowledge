// Import necessary modules and types from different libraries
import { createClient } from '@supabase/supabase-js'; // Supabase client for interaction with Supabase database
import { OpenAIStream, StreamingTextResponse } from 'ai'; // OpenAI utilities for streaming responses
import { codeBlock } from 'common-tags'; // Helper function for formatted multi-line strings
import OpenAI from 'openai'; // OpenAI SDK for interacting with OpenAI API
import { env, pipeline } from "@xenova/transformers"; // Xenova Transformers utilities for ML operations

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// Retrieve essential Supabase configurations from environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

// Define CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type',
};

// Set Xenova environment configurations for the Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

// Create a feature extraction pipeline with a specified model from Supabase
const generateEmbedding = await pipeline(
    'feature-extraction',
    'Supabase/gte-small'
);

// Deno server setup to handle HTTP requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Validate presence of Supabase configuration
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

  // Check for authorization header in the request
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

  // Initialize Supabase client with the provided configurations
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

  // Parse JSON body to extract required parameters
  const { messages, embedding, tag } = await req.json();
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

  // Convert tag to lowercase if present
  let tagFilter = ""
  if (tag) {
    tagFilter = tag.toString().toLowerCase();
  }

  // Call a remote procedure to match documents based on the embedding and tag
  const { data: documents, error: matchError } = await supabase
      .rpc('match_document_sections', {
        embedding,
        match_threshold: 0.8,
        tag: tagFilter
      })
      .select('content')
      .limit(5);

  // Handle potential errors from the document matching process
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

  // Format found documents for use in chat completions
  const injectedDocs =
      documents && documents.length > 0
          ? documents.map(({ content }) => content).join('\n\n')
          : 'No documents found';

  // Prepare chat completion messages including user prompts and found documents
  const completionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
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

  // Create a new chat completion session using OpenAI
  const completionStream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    messages: completionMessages,
    max_tokens: 1000,
    temperature: 0,
    stream: true,
  });

  // Stream the response from OpenAI API
  const stream = OpenAIStream(completionStream);
  const textResponse = new StreamingTextResponse(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/plain',
    },
  });
  console.log("tresponse", textResponse);
  return textResponse;
});
