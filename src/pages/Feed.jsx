import { useEffect, useState } from 'react';
import { getFeed } from '../services/postService';

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

  return (
    <div>
      <h2>Feed</h2>
      {error && <p>{error}</p>}

      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.username}</p>
          <img src={`http://localhost:5000${post.image_url}`} alt={post.caption} width="300" />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default Feed;