import { Link } from "@remix-run/react";
import supabase from "../utils/supabase";
import { useEffect, useState } from "react";
import ProfilePicture from "../components/profile-picture";

export default function Index() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [isFABOpen, setIsFABOpen] = useState(false);
  const [bmePercentage, setBmePercentage] = useState(0);
  const [sydePercentage, setSydePercentage] = useState(0);

  useEffect(() => {
    // Fetch leaderboard data
    async function fetchLeaderboardData() {
      try {
        const { data, error } = await supabase
          .from("players")
          .select("*")
          .order("elo", { ascending: false });
        if (error) {
          console.error("Error fetching leaderboard data:", error);
        } else {
          setLeaderboardData(data);
          calculateProgramPercentages(data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    // Fetch match data
    async function fetchMatchData() {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("match_date", { ascending: false });
        if (error) {
          console.error("Error fetching match data:", error);
        } else {
          setMatchData(data);
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    }

    fetchLeaderboardData();
    fetchMatchData();
  }, []);

  const calculateProgramPercentages = (data) => {
    const defaultElo = 1000;

    const totalPointsBME = data
      .filter((player) => player.program === "BME")
      .reduce((acc, player) => acc + player.elo - defaultElo, 0);

    const totalPointsSYDE = data
      .filter((player) => player.program === "SYDE")
      .reduce((acc, player) => acc + player.elo - defaultElo, 0);

    const totalPoints = totalPointsBME + totalPointsSYDE;

    if (totalPoints === 0) {
      // Both departments get 50% each
      setBmePercentage(50);
      setSydePercentage(50);
    } else {
      setBmePercentage(
        ((Math.max(totalPointsBME, 0) / totalPoints) * 100).toFixed(2)
      );
      setSydePercentage(
        ((Math.max(totalPointsSYDE, 0) / totalPoints) * 100).toFixed(2)
      );
    }

    console.log({
      totalPointsBME,
      totalPointsSYDE,
      bmePercentage,
      sydePercentage,
    });
  };

  return (
    <div className="space-y-12">
      <img
        className="object-contain block w-64 mx-auto"
        src="/images/logo.png"
        alt="Logo"
      />

      <div className="space-y-4">
        <div className="flex justify-between">
          <h2>SYDE</h2>
          <h2>BME</h2>
        </div>
        <div className="flex">
          <div
            className="w-1/2 bg-red-500 h-10"
            style={{ width: `${sydePercentage}%` }}
          />
          <div
            className="w-1/2 bg-blue-500 h-10"
            style={{ width: `${bmePercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="stroke-single" title="Leaderboard">
          Leaderboard
        </h2>
        <div className="flex flex-col gap-2">
          {leaderboardData.map((player, index) => {
            const podiumClasses = {
              0: "bg-yellow-400", // 1st place
              1: "bg-gray-400", // 2nd place
              2: "bg-orange-400", // 3rd place
              default: "bg-white", // Default for other positions
            };

            const podiumClass = podiumClasses[index] || podiumClasses.default;

            return (
              <div
                key={player.id}
                className={`flex items-center rounded-lg p-3 border-2 border-black  ${podiumClass}`}
              >
                <h3 className="mr-4">{index + 1}</h3>
                <div className="flex items-center flex-1 space-x-3">
                  <ProfilePicture
                    imageUrl={player.profile_photo_url}
                    alt={`${player?.first_name} ${player?.last_name}'s profile`}
                    className="w-10 h-10 rounded"
                  />
                  <h3>
                    {player?.first_name} {player?.last_name} ({player?.program})
                  </h3>
                </div>
                <p>{player?.elo}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h2>Matches</h2>
        <div className="flex flex-col gap-2">
          {matchData.map((match) => {
            const winner = leaderboardData.find(
              (player) => player.id === match.winner_player_id
            );
            const loser = leaderboardData.find(
              (player) => player.id === match.loser_player_id
            );

            return (
              <div
                key={match.match_id}
                className="bg-white rounded-lg p-4 border-2 border-black flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ProfilePicture
                      imageUrl={winner?.profile_photo_url}
                      alt={`${winner?.first_name} ${winner?.last_name}'s profile`}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex items-center space-x-2">
                      <h3>{`${winner?.first_name} ${winner?.last_name}`}</h3>
                      <p>({winner?.elo})</p>
                    </div>
                  </div>
                  <p className="text-green-600">Win</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ProfilePicture
                      imageUrl={loser?.profile_photo_url}
                      alt={`${loser?.first_name} ${loser?.last_name}'s profile`}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex items-center space-x-2">
                      <h3>{`${loser?.first_name} ${loser?.last_name}`}</h3>
                      <p>({loser?.elo})</p>
                    </div>
                  </div>
                  <p className="text-red-500">Loss</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-4">
          {isFABOpen && (
            <div className="mt-2 p-2 bg-white rounded-lg shadow-lg">
              <Link to="/register" className="block mb-2">
                Register a Player
              </Link>
              <Link to="/submit-match" className="block">
                Submit a Match
              </Link>
            </div>
          )}
          <button
            onClick={() => setIsFABOpen(!isFABOpen)}
            className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Options
          </button>
        </div>
      </div>
    </div>
  );
}
