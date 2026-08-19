import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../services/authService';

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getUserProfile(userId, token);
        setProfile(data);
      } catch (err) {
        setError('Could not load profile');
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    const token = localStorage.getItem('token');

    if (profile.followed_by_me) {
      await unfollowUser(userId, token);
    } else {
      await followUser(userId, token);
    }

    setProfile({ ...profile, followed_by_me: !profile.followed_by_me });
  };

  if (error) return <p className="text-center text-rose-500 text-sm mt-16">{error}</p>;
  if (!profile) return <p className="text-center text-slate-400 text-sm mt-16">Loading...</p>;

  return (
    <div className="max-w-[935px] mx-auto px-5 py-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl md:text-5xl font-bold text-rose-600">
            {profile.user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">{profile.user.username}</h2>

            {!profile.is_own_profile && (
              <button
                onClick={handleFollow}
                className={`text-sm font-semibold px-5 py-2 rounded-full transition-colors ${
                  profile.followed_by_me
                    ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                    : 'text-white bg-gradient-to-r from-rose-500 to-amber-500'
                }`}
              >
                {profile.followed_by_me ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="flex justify-center md:justify-start gap-8 mt-4">
            <div className="text-sm">
              <span className="font-bold text-slate-900">{profile.posts.length}</span>{' '}
              <span className="text-slate-500">posts</span>
            </div>
          </div>

          <p className="profile-bio">{/* Bio will be added later*/}</p>
        </div>
      </div>

      {profile.posts.length === 0 ? (
        <div className="text-center mt-16">
          <div className="text-5xl text-slate-300">📷</div>
          <p className="text-slate-400 text-sm mt-3">No posts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {profile.posts.map((post) => (
            <div key={post.id} className="aspect-square bg-slate-50 overflow-hidden">
              {brokenImages[post.id] ? (
                <div className="w-full h-full flex items-center justify-center text-2xl text-slate-300">📷</div>
              ) : (
                <img
                  src={`http://localhost:5000${post.image_url}`}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                  onError={() => setBrokenImages({ ...brokenImages, [post.id]: true })}
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