import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from "@supabase/supabase-js";
import { Database } from '../_lib/database.ts';

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

/** 
 * CORS headers configuration object.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',//change "*" based on the web domain
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Extracts text content from web pages by parsing HTML and selecting specific elements.
 * @param {string} url - The URL of the webpage to extract content from.
 * @returns {Promise<string>} A promise that resolves to the extracted text content.
 */
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

/**
 * Extracts YouTube transcript using Puppeteer by navigating to the page and evaluating the DOM.
 * @param {string} url - The URL of the YouTube video transcript to extract.
 * @returns {Promise<string>} A promise that resolves to the extracted text of the YouTube transcript.
 */
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

/**
 * Handles HTTP requests, determining the correct response based on the request type and body content.
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} A promise that resolves to the HTTP response to be sent back.
 */
async function handleRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response("Only POST method is allowed", { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }

  try {
    const requestBody = await req.json();
    const authorization = req.headers.get('Authorization');

    if (!authorization) {
      return new Response(
          JSON.stringify({ error: `No authorization header passed` }),
          {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        
        return new Response(JSON.stringify({ content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {// parse web content
        const content = await extractWebContent(url);

        console.log('Web content extracted successfully:', content);

        return new Response(JSON.stringify({ content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

    } else if (requestBody.name) {
      const data = {
        message: `Hello ${requestBody.name}!`,
      };
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Handle invalid request body
      return new Response("Invalid request body", { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

