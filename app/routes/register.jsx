import { Link } from "@remix-run/react";
import supabase from "../utils/supabase";
import { useNavigate } from "@remix-run/react";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const profilePhoto = formData.get("profilePhoto");
      const { data: fileData, error: fileError } = await supabase.storage
        .from("player-profile-photos")
        .upload(`${profilePhoto.name}`, profilePhoto);

      if (fileError) {
        console.error("Error uploading profile photo:", fileError);
        return;
      }

      // The URL of the uploaded file
      console.log("Successfully uploaded photo");
      console.log({ fileData });
      const profilePhotoUrl = fileData.path;

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert([
          {
            first_name: formData.get("firstName"),
            last_name: formData.get("lastName"),
            profile_photo_url: profilePhotoUrl, // Store the URL in your database
            program: formData.get("program"),
          },
        ]);

      if (playerError) {
        console.error("Error registering player:", playerError);
        return;
      }

      console.log("Player registered successfully:", playerData);

      navigate("/");
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
        <label>
          Program:
          <select name="program">
            <option value="SYDE">SYDE</option>
            <option value="BME">BME</option>
          </select>
        </label>
        <label>
          Profile Photo:
          <input type="file" name="profilePhoto" accept="image/*" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
