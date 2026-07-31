import api from './api';

export const getFeed = async (token) => {
  const response = await api.get('/posts/feed', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createPost = async (formData, token) => {
  const response = await api.post('/posts', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const likePost = async (postId, token) => {
  const response = await api.post(`/posts/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const unlikePost = async (postId, token) => {
  const response = await api.delete(`/posts/${postId}/like`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};