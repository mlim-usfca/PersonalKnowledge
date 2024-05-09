import "https://deno.land/x/dotenv/load.ts";
// Import necessary libraries and modules
import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
const testClientCreation  = async () => {
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


Deno.test("Client Creation Test", testClientCreation);