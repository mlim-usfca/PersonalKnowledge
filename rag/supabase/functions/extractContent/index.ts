import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Hello from Functions!");

async function extractWebContent(html: string): Promise<string> {
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

async function handleRequest(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Only POST method is allowed", { status: 405 });
  }

  try {
    const requestBody = await req.json();
    if (requestBody.url) {
      // Fetch the HTML content from the URL
      const response = await fetch(requestBody.url);
      const html = await response.text();

      // Extract content from the HTML
      const content = await extractWebContent(html);

      // Return the extracted content
      return new Response(JSON.stringify({ content }), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (requestBody.name) {
      // Original greeting functionality
      const data = {
        message: `Hello ${requestBody.name}!`,
      };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Handle invalid request body
      return new Response("Invalid request body", { status: 400 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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
    --data '{"name":"Functions"}'

*/
