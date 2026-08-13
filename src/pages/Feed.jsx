import { useEffect, useState } from 'react';
import { getFeed, likePost, unlikePost, addComment, getComments } from '../services/postService';
import { followUser, unfollowUser } from '../services/authService';
import { getCurrentUserId } from '../utils/auth';
import '../components/common/post/PostCard.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
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
      {error && <p>{error}</p>}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="post-card-header">
            <div className="post-card-info">
              <div className="post-card-avatar">{post.username.charAt(0).toUpperCase()}</div>
              <p className="post-card-username">{post.username}</p>
            </div>
            {post.user_id !== currentUserId && (
              <button className="follow-btn" onClick={() => handleFollow(post.user_id, post.followed_by_me)}>
                {post.followed_by_me ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <img src={`http://localhost:5000${post.image_url}`} alt={post.caption} />

          <div className="post-card-body">
            <p className="post-card-caption">{post.caption}</p>

            <div className="post-actions">
              <button className="action-btn" onClick={() => handleLike(post.id, post.liked_by_me)}>
                {post.liked_by_me ? 'Unlike' : 'Like'}
              </button>
              <button className="action-btn" onClick={() => handleToggleComments(post.id)}>
                Comment
              </button>
            </div>

            {openComments[post.id] && (
              <div className="comments-section">
                {comments[post.id] && comments[post.id].map((comment) => (
                  <p key={comment.id} className="comment-line">
                    <strong>{comment.username}</strong> {comment.text}
                  </p>
                ))}

                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                  />
                  <button onClick={() => handleCommentSubmit(post.id)}>Post</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;