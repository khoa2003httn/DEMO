import { useEffect, useState } from 'react'
import api from '../../api/axios'

const empty = { name: '', address: '', website: '', description: '' }

export default function AdminUniversities() {
  const [unis, setUnis] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const fetch = () => api.get('/universities').then((r) => setUnis(r.data)).catch(() => {})

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (u) => { setForm({ name: u.name, address: u.address || '', website: u.website || '', description: u.description || '' }); setEditing(u.id); setShowForm(true); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) await api.put(`/universities/${editing}`, form)
      else await api.post('/universities', form)
      setShowForm(false)
      fetch()
    } catch (err) {
      setError(err.response?.data?.detail || 'Lỗi lưu dữ liệu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa trường này?')) return
    await api.delete(`/universities/${id}`)
    fetch()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý trường đại học</h1>
        <button onClick={openCreate} className="btn-primary">+ Thêm trường</button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">{editing ? 'Sửa trường' : 'Thêm trường mới'}</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[['Tên trường *', 'name'], ['Địa chỉ', 'address'], ['Website', 'website']].map(([label, key]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input className="input-field" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key === 'name'} />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">Lưu</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {unis.map((u) => (
          <div key={u.id} className="card flex justify-between items-center">
            <div>
              <p className="font-semibold">{u.name}</p>
              {u.address && <p className="text-sm text-gray-400">{u.address}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(u)} className="btn-secondary text-sm py-1">Sửa</button>
              <button onClick={() => handleDelete(u.id)} className="btn-danger text-sm py-1">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
