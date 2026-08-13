import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../services/authService';
import './Profile.css';

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

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

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{profile.user.username.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h2>{profile.user.username}</h2>
          <p className="profile-post-count">{profile.posts.length} posts</p>
        </div>
        {!profile.is_own_profile && (
          <button className="profile-follow-btn" onClick={handleFollow}>
            {profile.followed_by_me ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="profile-grid">
        {profile.posts.map((post) => (
          <img
            key={post.id}
            src={`http://localhost:5000${post.image_url}`}
            alt={post.caption}
            className="profile-grid-img"
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;