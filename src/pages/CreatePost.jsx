import { useState } from 'react';
import { createPost } from '../services/postService';
import '../components/common/AuthForm.css';

function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await createPost(formData, token);
      setSuccess(true);
      setCaption('');
      setImage(null);
    } catch (err) {
      setError('Something went wrong, please try again');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Post</h2>

      {error && <p>{error}</p>}
      {success && <p>Post created successfully!</p>}

      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePost;