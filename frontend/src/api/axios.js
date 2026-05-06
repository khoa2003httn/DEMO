import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Chỉ tự logout khi /auth/me trả 401 (token hết hạn thật sự)
    // Không logout khi API data trả 401/403 để tránh kick oan
    const isAuthCheck = err.config?.url?.includes('/auth/me')
    if (err.response?.status === 401 && isAuthCheck) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default api
