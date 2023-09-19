import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { ChevronLeftRounded } from "@mui/icons-material";

import ProfilePicture from "./profile-picture";
import { fetchLeaderboardData } from "../utils/supabase";

const Leaderboard = ({
  numEntries = 200,
  hasBack = false,
  hasViewAll = false,
}) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLeaderboardData({ numEntries });
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchData();
  }, []);

  const podiumClasses = {
    0: "bg-yellow-400", // 1st place
    1: "bg-silver", // 2nd place
    2: "bg-orange-400", // 3rd place
    default: "bg-white", // Default for other positions
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center h-8">
        {hasBack && (
          <Link to="/" className="w-10 -ml-2">
            <ChevronLeftRounded fontSize="large" />
          </Link>
        )}
        <h2 className="stroke-single" title="Leaderboard">
          Foosball Leaderboard
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {leaderboardData.length > 0
          ? leaderboardData.slice(0, numEntries).map((player, index) => {
              const podiumClass = podiumClasses[index] || podiumClasses.default;

              return (
                <div
                  key={player.id}
                  className={`flex items-center rounded-lg p-3 border-2 border-black ${podiumClass}`}
                >
                  <h3 className="mr-4">{index + 1}</h3>
                  <div className="flex items-center flex-1 space-x-3">
                    <ProfilePicture
                      imageUrl={player.profile_photo_url}
                      alt={`${player?.first_name} ${player?.last_name}'s profile`}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <h3>
                      {player?.first_name} {player?.last_name} (
                      {player?.program})
                    </h3>
                  </div>
                  <p>{player?.elo}</p>
                </div>
              );
            })
          : Array.from({ length: numEntries }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
      </div>
      {hasViewAll && (
        <Link
          to="/leaderboard"
          className="block text-center w-full px-4 py-2 rounded-md bg-purple-400"
        >
          <h3>View full leaderboard</h3>
        </Link>
      )}
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="flex items-center rounded-lg p-3 border-2 border-gray-500 bg-gray-200">
      <div className="w-2 mr-4 h-4 bg-gray-300 rounded"></div>
      <div className="flex items-center flex-1 space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
        <div className="w-40 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-10 h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

export default Leaderboard;
