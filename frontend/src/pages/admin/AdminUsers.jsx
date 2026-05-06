import { useEffect, useState, useCallback } from 'react'
import api from '../../api/axios'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // lưu id đang xử lý để disable nút, tránh double-click
  const [togglingId, setTogglingId] = useState(null)

  const fetchUsers = useCallback(async (q = '') => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get(`/admin/users?search=${encodeURIComponent(q)}`)
      setUsers(data)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Không tải được danh sách thí sinh'
      setError(msg)
      // giữ nguyên dữ liệu cũ, không xóa
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const toggleLock = async (user) => {
    if (togglingId === user.id) return           // chặn double-click
    setTogglingId(user.id)

    // Cập nhật UI ngay lập tức (optimistic update)
    setUsers((prev) =>
      prev.map((u) => u.id === user.id ? { ...u, is_locked: !u.is_locked } : u)
    )

    try {
      await api.patch(`/admin/users/${user.id}/lock`)
      // Sau khi API xác nhận, reload lại để đồng bộ dữ liệu thật từ DB
      await fetchUsers(search)
    } catch (err) {
      // Rollback UI nếu API thất bại
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, is_locked: user.is_locked } : u)
      )
      const msg = err.response?.data?.detail || 'Thao tác thất bại, vui lòng thử lại'
      setError(msg)
    } finally {
      setTogglingId(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers(search)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý thí sinh</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Đang tải...' : 'Tìm kiếm'}
        </button>
        {search && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setSearch(''); fetchUsers('') }}
          >
            Xóa lọc
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Họ tên', 'Email', 'Điện thoại', 'Ngày tạo', 'Trạng thái', 'Hành động'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">Đang tải...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  {search ? `Không tìm thấy thí sinh với từ khóa "${search}"` : 'Chưa có thí sinh nào'}
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isToggling = togglingId === u.id
                return (
                  <tr key={u.id} className={`hover:bg-gray-50 ${isToggling ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-medium">{u.full_name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.is_locked
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {u.is_locked ? 'Đã khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleLock(u)}
                        disabled={isToggling}
                        className={`text-xs px-3 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          u.is_locked
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {isToggling ? '...' : u.is_locked ? 'Mở khóa' : 'Khóa'}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Loading overlay khi đang reload sau toggle */}
        {loading && users.length > 0 && (
          <div className="text-center py-2 text-xs text-gray-400 border-t bg-gray-50">
            Đang cập nhật...
          </div>
        )}
      </div>
    </div>
  )
}
