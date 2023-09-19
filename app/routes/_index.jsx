import { Link } from "@remix-run/react";
import supabase from "../utils/supabase";
import { useEffect, useState } from "react";
import { AddRounded } from "@mui/icons-material";
import { useLoaderData } from "@remix-run/react";

import Leaderboard from "../components/leaderboard";
import Matches from "../components/matches";

export default function Index() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [isFABOpen, setIsFABOpen] = useState(false);
  const [bmePercentage, setBmePercentage] = useState(0);
  const [sydePercentage, setSydePercentage] = useState(0);

  let result = useLoaderData();

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
    const pointsByPosition = [15, 12, 10, 8, 6, 5, 4, 3, 2, 1];

    const programPoints = {
      BME: 0,
      SYDE: 0,
    };

    // Iterate through the data and assign points based on position
    data.slice(0, pointsByPosition.length).forEach((player, index) => {
      const points = pointsByPosition[index];
      programPoints[player.program] += points;
    });

    const totalPoints = programPoints.BME + programPoints.SYDE;

    setBmePercentage(((programPoints.BME / totalPoints) * 100).toFixed(0));
    setSydePercentage(((programPoints.SYDE / totalPoints) * 100).toFixed(0));
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
        <div className="flex h-10">
          {sydePercentage > 0 && (
            <div
              className="bg-red-500 relative border-4 border-red-700 rounded-l-md"
              style={{ width: `${sydePercentage}%` }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-white">
                {`${sydePercentage}%`}
              </span>
            </div>
          )}
          {bmePercentage > 0 && (
            <div
              className="bg-blue-500 relative border-4 border-blue-700 rounded-r-md"
              style={{ width: `${bmePercentage}%` }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-white">
                {`${bmePercentage}%`}
              </span>
            </div>
          )}
        </div>
      </div>

      <Leaderboard numEntries={5} hasViewAll={true} />

      <Matches numEntries={3} hasViewAll={true} />

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
            className="w-20 h-20 bg-purple-500 active:bg-pink-400 text-white font-bold p-2 rounded-full"
          >
            <AddRounded fontSize="large" className="fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
