import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import './CreatePost.css';

function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

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
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await createPost(formData, token);
      setSuccess(true);
      setCaption('');
      setImage(null);
      setTimeout(() => {
        navigate('/feed');
      }, 1500);
    } catch (err) {
      setError('Something went wrong, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create new post</h2>

        {success && <div className="create-post-toast">✓ Post shared successfully!</div>}
        {error && <div className="create-post-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {previewUrl ? (
            <div className="image-preview-wrap">
              <img src={previewUrl} alt="Preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => setImage(null)}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="upload-area" onClick={() => fileInputRef.current.click()}>
              <div className="upload-icon">📷</div>
              <p className="upload-title">Drag photos here</p>
              <p className="upload-subtext">Click to select from computer</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="upload-input"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <textarea
            className="caption-textarea"
            placeholder="Write a caption..."
            value={caption}
            maxLength={2200}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="char-counter">{caption.length}/2200</div>

          <button type="submit" className="share-btn" disabled={submitting}>
            {submitting ? 'Sharing...' : 'Share'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;