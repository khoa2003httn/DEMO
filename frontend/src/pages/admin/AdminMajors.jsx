import { useEffect, useState } from 'react'
import api from '../../api/axios'

const empty = { name: '', code: '', description: '', subject_group: '', benchmark: '', quota: '', university_id: '' }

export default function AdminMajors() {
  const [majors, setMajors] = useState([])
  const [unis, setUnis] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = () => {
    api.get('/majors').then((r) => setMajors(r.data)).catch(() => {})
    api.get('/universities').then((r) => setUnis(r.data)).catch(() => {})
  }
  useEffect(() => { fetchAll() }, [])

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (m) => {
    setForm({ name: m.name, code: m.code || '', description: m.description || '', subject_group: m.subject_group || '', benchmark: m.benchmark ?? '', quota: m.quota ?? '', university_id: m.university_id })
    setEditing(m.id); setShowForm(true); setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = { ...form, benchmark: form.benchmark ? parseFloat(form.benchmark) : null, quota: form.quota ? parseInt(form.quota) : null, university_id: parseInt(form.university_id) }
    try {
      if (editing) await api.put(`/majors/${editing}`, payload)
      else await api.post('/majors', payload)
      setShowForm(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Lỗi lưu dữ liệu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa ngành này?')) return
    await api.delete(`/majors/${id}`)
    fetchAll()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý ngành học</h1>
        <button onClick={openCreate} className="btn-primary">+ Thêm ngành</button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">{editing ? 'Sửa ngành học' : 'Thêm ngành mới'}</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên ngành *</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã ngành</label>
              <input className="input-field" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Khối thi</label>
              <input className="input-field" placeholder="A00, A01, D01..." value={form.subject_group} onChange={(e) => setForm({ ...form, subject_group: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Điểm chuẩn</label>
              <input type="number" step="0.25" className="input-field" value={form.benchmark} onChange={(e) => setForm({ ...form, benchmark: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chỉ tiêu</label>
              <input type="number" className="input-field" value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trường đại học *</label>
              <select className="input-field" value={form.university_id} onChange={(e) => setForm({ ...form, university_id: e.target.value })} required>
                <option value="">-- Chọn trường --</option>
                {unis.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Tên ngành', 'Trường', 'Khối', 'Điểm chuẩn', 'Chỉ tiêu', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {majors.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{m.university_name}</td>
                <td className="px-4 py-3 text-gray-500">{m.subject_group || '—'}</td>
                <td className="px-4 py-3">{m.benchmark ?? '—'}</td>
                <td className="px-4 py-3">{m.quota ?? '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(m)} className="btn-secondary text-xs py-1">Sửa</button>
                  <button onClick={() => handleDelete(m.id)} className="btn-danger text-xs py-1">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
