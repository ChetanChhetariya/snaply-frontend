import { useEffect, useState } from 'react';
import { getFeed, likePost, unlikePost, addComment, getComments } from '../services/postService';
import { followUser, unfollowUser } from '../services/authService';
import { getCurrentUserId } from '../utils/Auth';
import { Link } from 'react-router-dom';
import '../components/common/post/PostCard.css';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
};

function HeartIcon({ filled }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? 'var(--primary)' : 'none'}
      stroke={filled ? 'var(--primary)' : 'var(--text-primary)'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [brokenImages, setBrokenImages] = useState({});
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getFeed(token);
        setPosts(data.posts);
      } catch (err) {
        setError('Could not load feed');
      }
    };

    fetchFeed();
  }, []);

  const handleLike = async (postId, likedByMe) => {
    const token = localStorage.getItem('token');

    if (likedByMe) {
      await unlikePost(postId, token);
    } else {
      await likePost(postId, token);
    }

    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, liked_by_me: !likedByMe } : post
      )
    );
  };

  const handleFollow = async (userId, followedByMe) => {
    const token = localStorage.getItem('token');

    if (followedByMe) {
      await unfollowUser(userId, token);
    } else {
      await followUser(userId, token);
    }

    setPosts(
      posts.map((post) =>
        post.user_id === userId ? { ...post, followed_by_me: !followedByMe } : post
      )
    );
  };

  const handleToggleComments = async (postId) => {
    const isOpen = openComments[postId];

    if (!isOpen && !comments[postId]) {
      const token = localStorage.getItem('token');
      const data = await getComments(postId, token);
      setComments({ ...comments, [postId]: data.comments });
    }

    setOpenComments({ ...openComments, [postId]: !isOpen });
  };

  const handleCommentSubmit = async (postId) => {
    const token = localStorage.getItem('token');
    const text = commentText[postId];
    if (!text) return;

    await addComment(postId, text, token);
    setCommentText({ ...commentText, [postId]: '' });

    const data = await getComments(postId, token);
    setComments({ ...comments, [postId]: data.comments });
  };

  return (
    <div className="feed">
      {error && <p className="feed-error">{error}</p>}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <div className="post-header-left">
              <div className="post-avatar">{post.username.charAt(0).toUpperCase()}</div>
              <Link to={`/profile/${post.user_id}`} className="post-username">
                {post.username}
              </Link>
            </div>
            <div className="post-header-right">
              {post.user_id !== currentUserId && (
                <button
                  className={`follow-btn ${post.followed_by_me ? 'following' : ''}`}
                  onClick={() => handleFollow(post.user_id, post.followed_by_me)}
                >
                  {post.followed_by_me ? 'Following' : 'Follow'}
                </button>
              )}
              <span className="post-timestamp">{formatTime(post.created_at)}</span>
            </div>
          </div>

          <div className="post-image-wrap">
            {brokenImages[post.id] ? (
              <div className="post-image-fallback">📷</div>
            ) : (
              <img
                className="post-image"
                src={`http://localhost:5000${post.image_url}`}
                alt={post.caption}
                onError={() => setBrokenImages({ ...brokenImages, [post.id]: true })}
              />
            )}
          </div>

          <div className="post-actions">
            <button className="icon-btn" onClick={() => handleLike(post.id, post.liked_by_me)}>
              <HeartIcon filled={post.liked_by_me} />
            </button>
            <button className="icon-btn" onClick={() => handleToggleComments(post.id)}>
              <CommentIcon />
            </button>
          </div>

          {post.liked_by_me && <p className="post-likes">Liked by you</p>}

          {post.caption && (
            <p className="post-caption">
              <strong>{post.username}</strong> {post.caption}
            </p>
          )}

          <p className="comments-toggle" onClick={() => handleToggleComments(post.id)}>
            {comments[post.id] ? (openComments[post.id] ? 'Hide comments' : 'View comments') : 'View comments'}
          </p>

          {openComments[post.id] && (
            <div className="comments-list">
              {comments[post.id] &&
                comments[post.id].map((comment) => (
                  <p key={comment.id} className="comment">
                    <span className="comment-user">{comment.username}</span>
                    <span className="comment-text">{comment.text}</span>
                  </p>
                ))}

              <div className="comment-input-row">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post.id] || ''}
                  onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                />
                <button
                  className="comment-post-btn"
                  disabled={!commentText[post.id]}
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feed;