import axios from 'axios';

// Build base URL safely to avoid duplicate slashes
// If REACT_APP_API_URL is set, it should already include /api or be the base backend URL
// If not set, default to relative /api for same-origin requests
const rawBase = (process.env.REACT_APP_API_URL || '').trim();
let API_BASE_URL;

if (rawBase) {
  // Remove trailing slashes
  let base = rawBase;
  while (base.endsWith('/')) base = base.slice(0, -1);
  
  // Check if it already has /api in it
  if (base.includes('/api')) {
    API_BASE_URL = base;
  } else {
    API_BASE_URL = base + '/api';
  }
} else {
  // Use relative path for same-origin
  API_BASE_URL = '/api';
}



const api = axios.create({
  baseURL: API_BASE_URL,
});

// Normalize URL to avoid duplicate slashes and add token to requests
api.interceptors.request.use((config) => {
  // Normalize baseURL + url into a single absolute/relative url without duplicate slashes
  if (config.baseURL) {
    const base = String(config.baseURL).replace(/\/+$|^\s+|\s+$/g, '');
    const urlPart = String(config.url || '').replace(/^\/+/, '');
    config.url = base ? `${base}/${urlPart}` : `/${urlPart}`;
    // prevent axios from resolving again against baseURL
    delete config.baseURL;
  }

  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const dataAPI = {
  getCategories: () => api.get('/data/categories'),
  getPreview: (category) => api.get(`/data/preview/${category}`),
  getDailyRequirements: (params) => api.get('/data/daily-requirements', { params }),
  getDailyUploadedData: (category, dayOfWeek, date) => api.get('/data/daily-data', { params: { category, dayOfWeek, date } }),
  collectDaily: (data) => api.post('/admin/users/collect-daily', data),
};

export const purchaseAPI = {
  createRequest: (data) => api.post('/purchase/request', data),
  getRequests: () => api.get('/purchase/requests'),
  getPurchased: () => api.get('/purchase/purchased'),
  generatePayment: (requestId) => api.post('/purchase/payment', { requestId }),
  confirmPayment: (data) => api.post('/purchase/payment/success', data),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}`, { status }),
  bulkBlock: (userIds) => api.put('/admin/users/bulk/block', { userIds }),
  bulkUnblock: (userIds) => api.put('/admin/users/bulk/unblock', { userIds }),
  bulkDelete: (userIds) => api.delete('/admin/users/bulk/delete', { data: { userIds } }),
  getPurchaseRequests: (params) => api.get('/admin/purchase-requests', { params }),
  updatePurchaseRequest: (id, status) => api.put(`/admin/purchase-requests/${id}`, { status }),
  bulkDeletePurchaseRequests: (requestIds) => api.delete('/admin/purchase-requests/bulk/delete', { data: { requestIds } }),
  getAnalytics: () => api.get('/admin/analytics'),
  uploadData: (formData) => api.post('/data/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getDataItems: () => api.get('/admin/data-items'),
  getDataItemsByCategory: (category) => api.get(`/admin/data-items/category/${category}`),
  updateDataItemPrice: (id, price) => api.put(`/admin/data-items/${id}/price`, { price }),
  getCategories: () => api.get('/admin/categories'),
  updateCategory: (categoryId, data) => api.put(`/admin/categories/${categoryId}`, data),
  getFixedCategories: () => api.get('/admin/categories/fixed'),
  createFixedCategory: (data) => api.post('/admin/categories/fixed', data),
  updateFixedCategory: (id, data) => api.put(`/admin/categories/fixed/${id}`, data),
  deleteFixedCategory: (id) => api.delete(`/admin/categories/fixed/${id}`),
  deleteCategoryData: (id) => api.delete(`/admin/categories/fixed/${id}/data`),
  getUserProfile: (userId) => api.get(`/profile/${userId}`),
  updateUserProfile: (userId, data) => api.put(`/profile/${userId}`, data),
  updateUserPassword: (userId, newPassword) => api.put(`/profile/${userId}/password`, { newPassword }),
  getAllUsers: () => api.get('/profile'),
  setDailyRequirements: (data) => api.post('/admin/daily-requirements', data),
  getDailyRequirements: (params) => api.get('/admin/daily-requirements', { params }),
  uploadDailyData: (data) => api.post('/admin/daily-data/upload', data),
};

export const userAPI = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
};

export default api;
