import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Majors() {
  const [majors, setMajors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchMajors = async (q = '') => {
    setLoading(true)
    try {
      const { data } = await api.get(`/majors?search=${q}`)
      setMajors(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMajors() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchMajors(search)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tra cứu ngành học</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="Tìm kiếm tên ngành..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary">Tìm kiếm</button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : majors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Không tìm thấy ngành học nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {majors.map((m) => (
            <Link key={m.id} to={`/majors/${m.id}`} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{m.name}</h3>
                  {m.university_name && <p className="text-sm text-blue-600">{m.university_name}</p>}
                  {m.subject_group && <p className="text-sm text-gray-500">Khối: {m.subject_group}</p>}
                </div>
                {m.benchmark && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {m.benchmark} điểm
                  </span>
                )}
              </div>
              {m.description && (
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{m.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
