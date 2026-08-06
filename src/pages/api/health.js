// src/pages/api/health.js
// Simple health-check endpoint for Vercel serverless functions.
// Returns 200 if Supabase connection is successful, otherwise 500.

import { supabase } from "@/lib/db";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(req) {
  try {
    // Minimal query – just check connection (using a harmless RPC).    
    const { data, error } = await supabase.rpc("pg_is_in_recovery");
    if (error) throw error;
    
    return successResponse("Health-check passed", {
      db_status: "connected",
      details: data
    });
  } catch (err) {
    console.error("Health-check failed:", err);
    return errorResponse("SERVER_ERR", "Health-check failed: " + err.message, 500);
  }
}
