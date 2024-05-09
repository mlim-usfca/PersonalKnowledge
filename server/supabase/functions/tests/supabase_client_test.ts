// deno-test.ts
// This imported is needed to load the .env file:
import "https://deno.land/x/dotenv/load.ts";
// Import necessary libraries and modules
import {
    assert,
    assertExists,
    assertEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

// Setup the Supabase client configuration
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? "";
const options = {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
};

// Test document_sections table access through the supabase client created with the credentials
const testDocumentSectionsClientAccess = async () => {
    var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

    // Check if the Supabase URL and key are provided
    if (!supabaseUrl) throw new Error('supabaseUrl is required.')
    if (!supabaseKey) throw new Error('supabaseKey is required.')

    // Test a simple query to the database
    const { data: table_data, error: table_error } = await client.from('document_sections').select('*').limit(1);
    if (table_error) {
        throw new Error('Invalid Supabase client: ' + table_error.message);
    }
    assert(table_data, "Data should be returned from the query.");
};

// Test categories table access through the supabase client created with the credentials
const testCategoriesAccess = async () => {
    var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

    // Check if the Supabase URL and key are provided
    if (!supabaseUrl) throw new Error('supabaseUrl is required.')
    if (!supabaseKey) throw new Error('supabaseKey is required.')

    // Test a simple query to the database
    const { data: table_data, error: table_error } = await client.from('categories').select('*').limit(1);
    if (table_error) {
        throw new Error('Invalid Supabase client: ' + table_error.message);
    }
    assert(table_data, "Data should be returned from the query.");
};

// Test links table access through the supabase client created with the credentials
const testLinksAccess = async () => {
    var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

    // Check if the Supabase URL and key are provided
    if (!supabaseUrl) throw new Error('supabaseUrl is required.')
    if (!supabaseKey) throw new Error('supabaseKey is required.')

    // Test a simple query to the database
    const { data: table_data, error: table_error } = await client.from('links').select('*').limit(1);
    if (table_error) {
        throw new Error('Invalid Supabase client: ' + table_error.message);
    }
    assert(table_data, "Data should be returned from the query.");
};

// Register and run the tests
Deno.test("Client Creation Test", testDocumentSectionsClientAccess);
Deno.test("Categories Table Access Test", testCategoriesAccess);
Deno.test("Links Table Access Test", testLinksAccess);

