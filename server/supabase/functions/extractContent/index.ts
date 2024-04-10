import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import { createClient } from "@supabase/supabase-js";
import { Database } from '../_lib/database.ts';

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

console.log("Hello from Functions!");

async function extractWebContent(url: string) : Promise<string>{
  const response = await fetch(url);
  const html = await response.text();

  const document = new DOMParser().parseFromString(html, "text/html");

  if (!document) {
    throw new Error("Failed to parse HTML document");
  }

  let extractedText = "";
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
  for (const element of elements) {
    extractedText += `${element.textContent.trim()} `;
  }

  return extractedText.trim();
}

// Extracts YouTube transcript using Puppeteer to handle dynamic content
async function extractYoutubeTranscript(url: string) : Promise<string> {
  try {
    // Visit browserless.io to get your free API token
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${Deno.env.get(
        'PUPPETEER_BROWSERLESS_IO_KEY'
      )}`,
    })
    const page = await browser.newPage();

    await page.goto(url);

    // Wait for the '#demo a' elements to be loaded in the DOM
    await page.waitForSelector('#demo a', {visible: true});

    const extractedText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#demo a'))
                  .map(element => element.innerText)
                  .join(' ')
                  .trim();
    });

    await browser.disconnect(); // Disconnect from the browser session

    return extractedText;
  } catch (e) {
    console.error(e);
    return "";
  }

}

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response("Only POST method is allowed", { status: 405 });
  }

  try {
    const requestBody = await req.json();
    
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
    
    if (requestBody.url) {
      const url = requestBody.url;
      const youtubePrefix = 'https://www.youtube.com/watch?v=';

      if (url.startsWith(youtubePrefix)) {// parse youtube transcript
        const videoId = url.substring(youtubePrefix.length);
        const content = await extractYoutubeTranscript(`https://youtubetranscript.com/?v=${videoId}`);
        
        console.log('Transcript extracted successfully:', content);
        
        // Return the extracted transcript
        return new Response(JSON.stringify({ content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

       
        
      } else {// parse web content
        const content = await extractWebContent(url);

        console.log('Web content extracted successfully:', content);

        // Return the extracted transcript
        return new Response(JSON.stringify({ content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

    } else if (requestBody.name) {
      // Original greeting functionality
      const data = {
        message: `Hello ${requestBody.name}!`,
      };
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Handle invalid request body
      return new Response("Invalid request body", { status: 400 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Start serving requests
Deno.serve(handleRequest);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/extractContent' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"extractContent","url": "https://example.com"}'

*/
