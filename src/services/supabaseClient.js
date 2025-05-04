// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vwshciahhdklcghjucfj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3c2hjaWFoaGRrbGNnaGp1Y2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjc2NjgsImV4cCI6MjA2MTg0MzY2OH0.iwjglgnrkyiGma8lrUsi2fbyxFv7xQMmjlnoSD8BSsk";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if a connection can be established
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    console.log("Supabase connection successful");
    return true;
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    return false;
  }
};
