import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function MajorDetail() {
  const { id } = useParams()
  const [major, setMajor] = useState(null)

  useEffect(() => {
    api.get(`/majors/${id}`).then((r) => setMajor(r.data)).catch(() => {})
  }, [id])

  if (!major) return <div className="text-center py-20 text-gray-400">Đang tải...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/majors" className="text-blue-600 hover:underline text-sm mb-4 inline-block">← Quay lại</Link>
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">{major.name}</h1>
        {major.university_name && (
          <p className="text-blue-600 mb-4">{major.university_name}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          {major.code && <Info label="Mã ngành" value={major.code} />}
          {major.subject_group && <Info label="Khối thi" value={major.subject_group} />}
          {major.benchmark != null && <Info label="Điểm chuẩn" value={`${major.benchmark} điểm`} />}
          {major.quota && <Info label="Chỉ tiêu" value={`${major.quota} sinh viên`} />}
        </div>

        {major.description && (
          <div>
            <h3 className="font-semibold mb-2">Mô tả ngành</h3>
            <p className="text-gray-600 leading-relaxed">{major.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  )
}
