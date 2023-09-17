import React from "react";

const ProfilePicture = ({ imageUrl, ...rest }) => {
  const CDN_URL =
    "https://ggtvlwlsjikmlivqfrym.supabase.co/storage/v1/object/public/player-profile-photos/";

  return <img src={`${CDN_URL}${imageUrl}`} {...rest} />;
};

export default ProfilePicture;
