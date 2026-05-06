import { useEffect, useState } from 'react'
import api from '../../api/axios'

const empty = { title: '', content: '', type: 'news' }

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const fetch = () => api.get('/posts').then((r) => setPosts(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (p) => { setForm({ title: p.title, content: p.content, type: p.type }); setEditing(p.id); setShowForm(true); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) await api.put(`/posts/${editing}`, form)
      else await api.post('/posts', form)
      setShowForm(false)
      fetch()
    } catch (err) {
      setError(err.response?.data?.detail || 'Lỗi lưu bài viết')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return
    await api.delete(`/posts/${id}`)
    fetch()
  }

  const typeLabel = { news: 'Tin tức', notice: 'Thông báo' }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <button onClick={openCreate} className="btn-primary">+ Thêm bài viết</button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">{editing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại</label>
                <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="news">Tin tức</option>
                  <option value="notice">Thông báo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nội dung *</label>
              <textarea className="input-field" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Lưu</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.type === 'notice' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                    {typeLabel[p.type]}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(p.published_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.content}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => openEdit(p)} className="btn-secondary text-sm py-1">Sửa</button>
                <button onClick={() => handleDelete(p.id)} className="btn-danger text-sm py-1">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
