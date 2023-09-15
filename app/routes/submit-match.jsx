import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function SubmitMatch() {
  const [players, setPlayers] = useState([]);
  const [winnerId, setWinnerId] = useState();
  const [loserId, setLoserId] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlayers() {
      try {
        // Fetch the list of players from the "players" table
        const { data, error } = await supabase
          .from("players")
          .select("id, first_name, last_name, elo");
        if (error) {
          console.error("Error fetching players:", error);
        } else {
          setPlayers(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchPlayers();
  }, []);

  async function updatePlayerRating(playerId, newRating) {
    console.log(`Updating ${playerId} to ${newRating}`);

    try {
      const { data, error } = await supabase
        .from("players")
        .update({ elo: newRating })
        .eq("id", playerId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both winner and loser are selected
    if (!winnerId || !loserId) {
      alert("Please select both a winner and a loser.");
      return;
    }

    try {
      console.log("Starting match submission...");

      // Calculate ELO changes
      const K_FACTOR = 32; // Adjust this value as needed

      const winner = players.find((player) => player.id === winnerId);
      const loser = players.find((player) => player.id === loserId);

      if (winner && loser) {
        const winnerRating = winner.elo;
        const loserRating = loser.elo;

        const expectedWinningProbability =
          1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
        const expectedLosingProbability = 1 - expectedWinningProbability;

        const actualOutcomeWinner = 1;
        const actualOutcomeLoser = 0;

        const ratingChangeWinner = Math.floor(
          K_FACTOR * (actualOutcomeWinner - expectedWinningProbability)
        );
        const ratingChangeLoser = Math.floor(
          K_FACTOR * (actualOutcomeLoser - expectedLosingProbability)
        );

        console.log("Calculating ELO changes...");
        console.log("Winner Rating:", winnerRating);
        console.log("Loser Rating:", loserRating);
        console.log(
          "Expected Winning Probability:",
          expectedWinningProbability
        );
        console.log("Expected Losing Probability:", expectedLosingProbability);
        console.log("Rating Change for Winner:", ratingChangeWinner);
        console.log("Rating Change for Loser:", ratingChangeLoser);

        await updatePlayerRating(winnerId, winnerRating + ratingChangeWinner);
        await updatePlayerRating(loserId, loserRating + ratingChangeLoser);

        console.log("Player ratings updated.");
      } else {
        console.error("Winner or loser not found in the player data.");
      }

      // Store match data in the database
      // ...

      // Provide feedback to the user
      // alert("Match submitted successfully!");

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      // alert("An error occurred while submitting the match.");
    }
  };

  return (
    <div>
      <h1>Submit a Match</h1>
      <Link to="/">Back to Leaderboard</Link>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Winner:
            <select
              value={winnerId}
              onChange={(e) => setWinnerId(parseInt(e.target.value))}
            >
              <option value="">Select Winner</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.first_name} {player.last_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Loser:
            <select
              value={loserId}
              onChange={(e) => setLoserId(parseInt(e.target.value))}
            >
              <option value="">Select Loser</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.first_name} {player.last_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Submit Match</button>
      </form>
    </div>
  );
}
