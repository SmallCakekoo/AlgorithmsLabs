import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://halubsvmeikifzgyklfu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHVic3ZtZWlraWZ6Z3lrbGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTAzMzEsImV4cCI6MjA2MzMyNjMzMX0.dv-Cp41YIKg1Vl7K-Ou6pzYV55SFPS4NwDXFuoc0FTA";
export const supabase = createClient(supabaseUrl, supabaseKey);
