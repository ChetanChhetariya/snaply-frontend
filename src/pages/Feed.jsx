import { useEffect, useState } from 'react';
import { getFeed, likePost, unlikePost } from '../services/postService';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);

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

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');

    if (likedPosts.includes(postId)) {
      await unlikePost(postId, token);
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      await likePost(postId, token);
      setLikedPosts([...likedPosts, postId]);
    }
  };

  return (
    <div>
      <h2>Feed</h2>
      {error && <p>{error}</p>}

      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.username}</p>
          <img src={`http://localhost:5000${post.image_url}`} alt={post.caption} width="300" />
          <p>{post.caption}</p>
          <button onClick={() => handleLike(post.id)}>
            {likedPosts.includes(post.id) ? 'Unlike' : 'Like'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Feed;