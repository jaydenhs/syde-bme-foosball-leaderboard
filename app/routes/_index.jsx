import { Link } from "@remix-run/react";
import supabase from "../utils/supabase"; // Import your Supabase client
import { useEffect, useState } from "react";

export default function Index() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch player data from Supabase
  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const { data, error } = await supabase.from("players").select("*");
        if (error) {
          console.error("Error fetching leaderboard data:", error);
        } else {
          // Sort players by ELO rating in descending order
          const sortedLeaderboard = [...data].sort((a, b) => b.elo - a.elo);
          setLeaderboardData(sortedLeaderboard);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    fetchLeaderboardData();
  }, []); // Run this effect once when the component mounts

  return (
    <div>
      <h1>Leaderboard</h1>
      <Link to="/register">Register a Player</Link>
      <p />
      <Link to="/submit-match">Submit a Match</Link>
      <p />
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>ELO Rating</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>
                {player.first_name} {player.last_name}
              </td>
              <td>{player.elo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
