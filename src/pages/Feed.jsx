import { useEffect, useState } from 'react';
import { getFeed, likePost, unlikePost } from '../services/postService';
import '../components/common/post/PostCard.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div className="feed">
      {error && <p>{error}</p>}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <img src={`http://localhost:5000${post.image_url}`} alt={post.caption} />
          <div className="post-card-body">
            <p className="post-card-username">{post.username}</p>
            <p className="post-card-caption">{post.caption}</p>
            <button onClick={() => handleLike(post.id, post.liked_by_me)}>
              {post.liked_by_me ? 'Unlike' : 'Like'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;