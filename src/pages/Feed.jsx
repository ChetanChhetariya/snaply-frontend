import { useEffect, useState } from "react";
import {
  getFeed,
  likePost,
  unlikePost,
  addComment,
  getComments,
} from "../services/postService";
import { followUser, unfollowUser } from "../services/authService";
import { getCurrentUserId } from "../utils/Auth";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import "../components/common/post/PostCard.css";

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

  return `${Math.floor(diff / 604800)}w`;
};

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [brokenImages, setBrokenImages] = useState({});

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getFeed(token);
        setPosts(data.posts);
      } catch (err) {
        setError("Could not load feed");
      }
    };

    fetchFeed();
  }, []);

  const handleLike = async (postId, likedByMe) => {
    const token = localStorage.getItem("token");

    if (likedByMe) {
      await unlikePost(postId, token);
    } else {
      await likePost(postId, token);
    }

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked_by_me: !likedByMe }
          : post
      )
    );
  };

  const handleFollow = async (userId, followedByMe) => {
    const token = localStorage.getItem("token");

    if (followedByMe) {
      await unfollowUser(userId, token);
    } else {
      await followUser(userId, token);
    }

    setPosts(
      posts.map((post) =>
        post.user_id === userId
          ? { ...post, followed_by_me: !followedByMe }
          : post
      )
    );
  };

  const handleToggleComments = async (postId) => {
    const isOpen = openComments[postId];

    if (!isOpen && !comments[postId]) {
      const token = localStorage.getItem("token");
      const data = await getComments(postId, token);

      setComments({
        ...comments,
        [postId]: data.comments,
      });
    }

    setOpenComments({
      ...openComments,
      [postId]: !isOpen,
    });
  };

  const handleCommentTextChange = (postId, value) => {
    setCommentText({ ...commentText, [postId]: value });
  };

  const handleCommentSubmit = async (postId) => {
    const token = localStorage.getItem("token");
    const text = commentText[postId];

    if (!text) return;

    await addComment(postId, text, token);

    setCommentText({
      ...commentText,
      [postId]: "",
    });

    const data = await getComments(postId, token);

    setComments({
      ...comments,
      [postId]: data.comments,
    });
  };

  return (
    <div className="max-w-[490px] mx-auto px-4 py-6">
      {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          {/* Post Header */}
          <div className="post-header">
            <div className="post-header-left">
              <div className="post-avatar">
                {post.username.charAt(0).toUpperCase()}
              </div>

              <Link
                to={`/profile/${post.user_id}`}
                className="post-username"
              >
                {post.username}
              </Link>
            </div>

            <div className="post-header-right">
              {post.user_id !== currentUserId && (
                <button
                  type="button"
                  className={`follow-btn ${
                    post.followed_by_me ? "following" : ""
                  }`}
                  onClick={() =>
                    handleFollow(
                      post.user_id,
                      post.followed_by_me
                    )
                  }
                >
                  {post.followed_by_me ? "Following" : "Follow"}
                </button>
              )}

              <span className="post-timestamp">
                {formatTime(post.created_at)}
              </span>
            </div>
          </div>

          {/* Post Image */}
          <div className="post-image-wrap">
            {brokenImages[post.id] ? (
              <div className="post-image-fallback">📷</div>
            ) : (
              <img
                className="post-image"
                src={`http://localhost:5000${post.image_url}`}
                alt={post.caption}
                onError={() =>
                  setBrokenImages({
                    ...brokenImages,
                    [post.id]: true,
                  })
                }
              />
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-1 px-4 py-3">
            {/* Like */}
            <button
              type="button"
              aria-label={
                post.liked_by_me ? "Unlike post" : "Like post"
              }
              onClick={() =>
                handleLike(post.id, post.liked_by_me)
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                post.liked_by_me
                  ? "text-brand-primary hover:bg-brand-soft"
                  : "text-text-primary hover:bg-brand-soft hover:text-brand-primary"
              }`}
            >
              <Heart
                size={23}
                strokeWidth={2}
                fill={
                  post.liked_by_me
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            {/* Comment */}
            <button
              type="button"
              aria-label="View comments"
              onClick={() => handleToggleComments(post.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-all duration-200 hover:bg-brand-soft hover:text-brand-primary active:scale-90"
            >
              <MessageCircle
                size={23}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Liked by You */}
          {post.liked_by_me && (
            <p className="post-likes">Liked by you</p>
          )}

          {/* Caption */}
          {post.caption && (
            <p className="post-caption">
              <strong>{post.username}</strong>{" "}
              {post.caption}
            </p>
          )}

          {/* Comments Toggle */}
          <p
            className="comments-toggle"
            onClick={() => handleToggleComments(post.id)}
          >
            {comments[post.id]
              ? openComments[post.id]
                ? "Hide comments"
                : "View comments"
              : "View comments"}
          </p>

          {/* Comments */}
          {openComments[post.id] && (
            <div className="comments-list">
              {comments[post.id] &&
                comments[post.id].map((comment) => (
                  <p key={comment.id} className="comment">
                    <span className="comment-user">
                      {comment.username}
                    </span>

                    <span className="comment-text">
                      {comment.text}
                    </span>
                  </p>
                ))}

              {/* Add Comment */}
              <div className="comment-input-row">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post.id]: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className="comment-post-btn"
                  disabled={!commentText[post.id]}
                  onClick={() =>
                    handleCommentSubmit(post.id)
                  }
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