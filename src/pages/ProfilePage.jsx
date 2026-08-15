import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../services/authService';
import './Profile.css';

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

  if (error) return <p className="profile-error">{error}</p>;
  if (!profile) return <p className="profile-loading">Loading...</p>;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{profile.user.username.charAt(0).toUpperCase()}</div>

        <div className="profile-info">
          <div className="profile-info-top">
            <h2 className="profile-username">{profile.user.username}</h2>

            {!profile.is_own_profile && (
              <button
                className={`profile-follow-btn ${profile.followed_by_me ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {profile.followed_by_me ? (
                  <>
                    <span className="following-label">Following</span>
                    <span className="unfollow-label">Unfollow</span>
                  </>
                ) : (
                  'Follow'
                )}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <span>
              <span className="profile-stat-count">{profile.posts.length}</span>
              <span className="profile-stat-label">posts</span>
            </span>
          </div>

          <p className="profile-bio">{/* Bio will be added when backend supports it */}</p>
        </div>
      </div>

      {profile.posts.length === 0 ? (
        <div className="profile-empty">
          <div className="profile-empty-icon">📷</div>
          <p className="profile-empty-text">No posts yet</p>
        </div>
      ) : (
        <div className="profile-grid">
          {profile.posts.map((post) => (
            <div className="profile-grid-item" key={post.id}>
              {brokenImages[post.id] ? (
                <div className="post-image-fallback">📷</div>
              ) : (
                <img
                  src={`http://localhost:5000${post.image_url}`}
                  alt={post.caption}
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