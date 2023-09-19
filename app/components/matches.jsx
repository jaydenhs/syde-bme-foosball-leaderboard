import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { ChevronLeftRounded } from "@mui/icons-material";

import ProfilePicture from "./profile-picture";
import { fetchLeaderboardData, fetchMatchData } from "../utils/supabase";

const Matches = ({ numEntries = 200, hasBack = false, hasViewAll = false }) => {
  const [matchData, setMatchData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matches = await fetchMatchData({ numEntries });
        setMatchData(matches);

        const leaderboard = await fetchLeaderboardData({ numEntries: 1000 });
        setLeaderboardData(leaderboard);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center h-8">
        {hasBack && (
          <Link to="/" className="w-10 -ml-2">
            <ChevronLeftRounded fontSize="large" />
          </Link>
        )}
        <h2 className="stroke-single" title="Leaderboard">
          Recent Foosball Matches
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {matchData.length > 0 && leaderboardData.length > 0
          ? matchData.map((match) => {
              const winner = leaderboardData.find(
                (player) => player.id === match.winner_player_id
              );
              const loser = leaderboardData.find(
                (player) => player.id === match.loser_player_id
              );

              return (
                <div
                  key={match.match_id}
                  className="bg-white rounded-lg p-3 border-2 border-black flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ProfilePicture
                        imageUrl={winner?.profile_photo_url}
                        alt={`${winner?.first_name} ${winner?.last_name}'s profile`}
                        className="w-10 h-10 rounded object-cover"
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
                        className="w-10 h-10 rounded object-cover"
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
            })
          : Array.from({ length: numEntries }).map((_, index) => (
              <SkeletonMatchCard key={index} />
            ))}
      </div>
      {hasViewAll && (
        <Link
          to="/matches"
          className="block text-center w-full px-4 py-2 rounded-md bg-purple-400"
        >
          <h3>View all matches</h3>
        </Link>
      )}
    </div>
  );
};

const SkeletonMatchCard = () => {
  return (
    <div className="bg-gray-200 rounded-lg p-3 border-2 border-gray-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-40 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-10 h-3 bg-gray-300 rounded"></div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-40 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-10 h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default Matches;
