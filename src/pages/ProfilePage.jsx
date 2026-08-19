import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { getUserProfile, followUser, unfollowUser } from "../services/authService";

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getUserProfile(userId, token);
        setProfile(data);
      } catch (err) {
        setError("Could not load profile");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");

    if (profile.followed_by_me) {
      await unfollowUser(userId, token);
    } else {
      await followUser(userId, token);
    }

    setProfile({ ...profile, followed_by_me: !profile.followed_by_me });
  };

  if (error)
    return <p className="mt-16 text-center text-sm text-error">{error}</p>;
  if (!profile)
    return (
      <p className="mt-16 text-center text-sm text-text-secondary">
        Loading...
      </p>
    );

  return (
    <div className="mx-auto max-w-[935px] px-5 py-10">
      <div className="mb-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-3xl font-bold text-white md:h-32 md:w-32 md:text-5xl">
          {profile.user.username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <h2 className="text-xl font-bold text-text-primary md:text-2xl">
              {profile.user.username}
            </h2>

            {!profile.is_own_profile && (
              <button
                onClick={handleFollow}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  profile.followed_by_me
                    ? "bg-surface-soft text-text-secondary hover:bg-border"
                    : "bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
                }`}
              >
                {profile.followed_by_me ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <div className="mt-4 flex justify-center gap-8 md:justify-start">
            <div className="text-sm">
              <span className="font-bold text-text-primary">
                {profile.posts.length}
              </span>{" "}
              <span className="text-text-secondary">posts</span>
            </div>
          </div>
        </div>
      </div>

      {profile.posts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Camera className="h-12 w-12 text-text-muted" />
          <p className="mt-3 text-sm text-text-muted">No posts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {profile.posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square overflow-hidden bg-surface-soft"
            >
              {brokenImages[post.id] ? (
                <div className="flex h-full w-full items-center justify-center text-2xl text-text-muted">
                  📷
                </div>
              ) : (
                <img
                  src={`http://localhost:5000${post.image_url}`}
                  alt={post.caption}
                  className="h-full w-full object-cover"
                  onError={() =>
                    setBrokenImages({ ...brokenImages, [post.id]: true })
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;