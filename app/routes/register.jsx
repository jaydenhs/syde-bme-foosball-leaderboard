// src/routes/register.tsx

import { Link } from "@remix-run/react";
import supabase from "../utils/supabase";

export default function Register() {
  const handleSubmit = async (e) => {
    console.log("Form submitted");

    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      // Insert player data into the database
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert([
          {
            first_name: formData.get("firstName"),
            last_name: formData.get("lastName"),
          },
        ]);

      if (playerError) {
        console.error("Error registering player:", playerError);
        return;
      }

      // Player registration successful
      console.log("Player registered successfully:", playerData);

      // Redirect to the leaderboard or a confirmation page
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Register a New Player</h1>
      <Link to="/">Back to Leaderboard</Link>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for first name and last name */}
        <label>
          First Name:
          <input type="text" name="firstName" />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
