import { api, refreshAccessToken } from './api.js'

const data = ({ data: response }) => response

export const authService = {
  google: (credential) => api.post('/auth/google', { credential }, { skipAuthRefresh: true }).then(data),
  login: (details) => api.post('/auth/login', details, { skipAuthRefresh: true }).then(data),
  register: (details) => api.post('/auth/register', details, { skipAuthRefresh: true }).then(data),
  verifyEmail: (details) => api.post('/auth/verify-email', details, { skipAuthRefresh: true }).then(data),
  forgotPassword: (details) => api.post('/auth/forgot-password', details, { skipAuthRefresh: true }).then(data),
  resetPassword: (details) => api.post('/auth/reset-password', details, { skipAuthRefresh: true }).then(data),
  refresh: (options) => refreshAccessToken(options),
  me: () => api.get('/auth/me', { skipAuthRefresh: true }).then(data),
  updateProfile: (details) => api.patch('/auth/me', details, { skipAuthRefresh: true }).then(data),
  verifyProfileEmail: (details) => api.post('/auth/me/verify-email', details, { skipAuthRefresh: true }).then(data),
  changePassword: (details) => api.post('/auth/change-password', details, { skipAuthRefresh: true }).then(data),
  logout: () => api.post('/auth/logout', undefined, { skipAuthRefresh: true }).then(data),
}
