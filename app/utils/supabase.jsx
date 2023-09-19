import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ggtvlwlsjikmlivqfrym.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndHZsd2xzamlrbWxpdnFmcnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ3Mzk5NjUsImV4cCI6MjAxMDMxNTk2NX0.UlZ5kro2EZgMN4D--zLQ6pGJH0wVMPLzizr7HnXeSmg"; // Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchLeaderboardData = async ({ numEntries }) => {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("elo", { ascending: false })
      .limit(numEntries);
    if (error) {
      console.error("Error fetching leaderboard data:", error);
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
};

export const fetchMatchData = async ({ numEntries }) => {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: false })
      .limit(numEntries);
    if (error) {
      console.error("Error fetching match data:", error);
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching match data:", error);
  }
};

export default supabase;
