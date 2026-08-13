import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const signup = async (username, email, password) => {
  const response = await api.post('/users/signup', { username, email, password });
  return response.data;
};
export const followUser = async (userId, token) => {
  const response = await api.post(`/users/${userId}/follow`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const unfollowUser = async (userId, token) => {
  const response = await api.delete(`/users/${userId}/follow`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};