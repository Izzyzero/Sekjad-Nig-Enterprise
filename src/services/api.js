import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL 

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const setAccessToken = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}

export const getApiError = (error, fallback = 'Something went wrong. Please try again.') =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback
