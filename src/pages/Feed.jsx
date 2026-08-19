import { useEffect, useState } from 'react';
import { getFeed, likePost, unlikePost, addComment, getComments } from '../services/postService';
import { followUser, unfollowUser } from '../services/authService';
import { getCurrentUserId } from '../utils/Auth';
import PostCard from '../components/PostCard';

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

  const handleCommentTextChange = (postId, value) => {
    setCommentText({ ...commentText, [postId]: value });
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
    <div className="max-w-[490px] mx-auto px-4 py-6">
      {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onLike={handleLike}
          onFollow={handleFollow}
          comments={comments[post.id]}
          isCommentsOpen={openComments[post.id]}
          onToggleComments={handleToggleComments}
          commentText={commentText[post.id]}
          onCommentTextChange={handleCommentTextChange}
          onCommentSubmit={handleCommentSubmit}
        />
      ))}
    </div>
  );
}

export default Feed;