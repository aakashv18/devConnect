import { useState } from "react";

// falls back to initials when there's no photo or the URL doesn't load
const Avatar = ({ user, size = "w-12" }) => {
  const [failedUrl, setFailedUrl] = useState(null);
  const showPhoto = user.photoUrl && user.photoUrl !== failedUrl;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  if (showPhoto) {
    return (
      <div className="avatar">
        <div className={`rounded-full ${size}`}>
          <img
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName ?? ""}`.trim()}
            referrerPolicy="no-referrer"
            onError={() => setFailedUrl(user.photoUrl)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="avatar avatar-placeholder">
      <div className={`bg-primary text-primary-content rounded-full ${size}`}>
        <span className={size === "w-12" ? "text-lg" : "text-4xl"}>
          {initials.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default Avatar;
