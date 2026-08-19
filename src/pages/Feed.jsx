import { useEffect, useState } from "react";
import {
  getFeed,
  likePost,
  unlikePost,
  addComment,
  getComments,
  deletePost,
} from "../services/postService";
import { followUser, unfollowUser } from "../services/authService";
import { getCurrentUserId } from "../utils/Auth";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import StoriesBar from "../components/StoriesBar";

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

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await deletePost(postId, token);

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );

      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        delete updatedComments[postId];
        return updatedComments;
      });

      setOpenComments((prevOpenComments) => {
        const updatedOpenComments = { ...prevOpenComments };
        delete updatedOpenComments[postId];
        return updatedOpenComments;
      });

      setCommentText((prevCommentText) => {
        const updatedCommentText = { ...prevCommentText };
        delete updatedCommentText[postId];
        return updatedCommentText;
      });

      setBrokenImages((prevBrokenImages) => {
        const updatedBrokenImages = { ...prevBrokenImages };
        delete updatedBrokenImages[postId];
        return updatedBrokenImages;
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Could not delete post");
    }
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
    <div className="mx-auto max-w-[500px] px-4 py-6">
      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      <StoriesBar />

      {posts.map((post) => (
        <div
          className="mb-6 overflow-hidden rounded-2xl border border-border bg-white shadow-card"
          key={post.id}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-sm font-bold text-white">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <Link
                to={`/profile/${post.user_id}`}
                className="text-sm font-semibold text-text-primary hover:underline"
              >
                {post.username}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {post.user_id !== currentUserId && (
                <button
                  type="button"
                  onClick={() => handleFollow(post.user_id, post.followed_by_me)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    post.followed_by_me
                      ? "bg-surface-soft text-text-secondary hover:bg-border"
                      : "bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
                  }`}
                >
                  {post.followed_by_me ? "Following" : "Follow"}
                </button>
              )}

              {post.user_id === currentUserId && (
                <button
                  type="button"
                  aria-label="Delete post"
                  onClick={() => handleDelete(post.id)}
                  className="text-xs font-semibold text-error hover:underline"
                >
                  Delete
                </button>
              )}

              <span className="text-xs text-text-muted">{formatTime(post.created_at)}</span>
            </div>
          </div>

          {/* Image */}
          <div className="aspect-square w-full bg-surface-soft">
            {brokenImages[post.id] ? (
              <div className="flex h-full w-full items-center justify-center text-4xl text-text-muted">
                📷
              </div>
            ) : (
              <img
                className="h-full w-full object-cover"
                src={`http://localhost:5000${post.image_url}`}
                alt={post.caption}
                onError={() => setBrokenImages({ ...brokenImages, [post.id]: true })}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 px-4 py-3">
            <button
              type="button"
              aria-label={post.liked_by_me ? "Unlike post" : "Like post"}
              onClick={() => handleLike(post.id, post.liked_by_me)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                post.liked_by_me
                  ? "text-brand-primary hover:bg-brand-soft"
                  : "text-text-primary hover:bg-brand-soft hover:text-brand-primary"
              }`}
            >
              <Heart size={23} strokeWidth={2} fill={post.liked_by_me ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              aria-label="View comments"
              onClick={() => handleToggleComments(post.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-all duration-200 hover:bg-brand-soft hover:text-brand-primary active:scale-90"
            >
              <MessageCircle size={23} strokeWidth={2} />
            </button>
          </div>

          {post.liked_by_me && (
            <p className="px-4 pb-1 text-sm font-semibold text-text-primary">Liked by you</p>
          )}

          {post.caption && (
            <p className="px-4 pb-1.5 text-sm leading-relaxed text-text-secondary">
              <strong className="font-semibold text-text-primary">{post.username}</strong>{" "}
              {post.caption}
            </p>
          )}

          <button
            type="button"
            onClick={() => handleToggleComments(post.id)}
            className="px-4 pb-3 text-left text-sm text-text-muted hover:text-text-secondary"
          >
            {comments[post.id] ? (openComments[post.id] ? "Hide comments" : "View comments") : "View comments"}
          </button>

          {openComments[post.id] && (
            <div className="border-t border-border px-4 pb-4 pt-3">
              {comments[post.id] &&
                comments[post.id].map((comment) => (
                  <p key={comment.id} className="mb-1.5 text-sm">
                    <span className="font-semibold text-text-primary">{comment.username}</span>{" "}
                    <span className="text-text-secondary">{comment.text}</span>
                  </p>
                ))}

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post.id] || ""}
                  onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                  className="flex-1 rounded-full border border-border bg-surface-soft px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                />
                <button
                  type="button"
                  disabled={!commentText[post.id]}
                  onClick={() => handleCommentSubmit(post.id)}
                  className="text-sm font-semibold text-brand-primary disabled:opacity-40"
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