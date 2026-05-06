import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, majors: 0, universities: 0, posts: 0 })

  useEffect(() => {
    Promise.allSettled([
      api.get('/admin/users'),
      api.get('/majors'),
      api.get('/universities'),
      api.get('/posts'),
    ]).then(([users, majors, unis, posts]) => {
      setStats({
        users: users.value?.data?.length ?? 0,
        majors: majors.value?.data?.length ?? 0,
        universities: unis.value?.data?.length ?? 0,
        posts: posts.value?.data?.length ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Thí sinh', value: stats.users, color: 'bg-blue-500', icon: '👥' },
    { label: 'Ngành học', value: stats.majors, color: 'bg-green-500', icon: '📚' },
    { label: 'Trường ĐH', value: stats.universities, color: 'bg-purple-500', icon: '🏫' },
    { label: 'Bài viết', value: stats.posts, color: 'bg-orange-500', icon: '📰' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} text-white rounded-xl p-6`}>
            <p className="text-3xl mb-1">{c.icon}</p>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm opacity-80 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
