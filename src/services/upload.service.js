import { api } from './api'
export const uploadService = { create: (file) => api('/uploads', { method: 'POST', body: file, headers: {} }) }
