import { api } from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials).then(({ data }) => data),
  register: (details) => api.post('/auth/register/', details).then(({ data }) => data),
  refresh: () =>
    api
      .post('/auth/refresh/')
      .then(({ data }) => data)
      .catch((error) => {
        console.error('Auth refresh failed:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        })
        throw error
      }),
  me: () => api.get('/auth/me/').then(({ data }) => data),
  logout: () => api.post('/auth/logout/').then(({ data }) => data),
}
