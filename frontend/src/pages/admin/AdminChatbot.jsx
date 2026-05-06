import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminChatbot() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/chatbot/admin/history')
      .then((r) => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Quản lý AI Chatbot</h1>
      <p className="text-gray-500 text-sm mb-6">Lịch sử hội thoại của người dùng với AI Chatbot.</p>

      <div className="card mb-6 bg-blue-50 border-blue-100">
        <h3 className="font-semibold text-blue-700 mb-2">Thông tin AI</h3>
        <p className="text-sm text-gray-600">Model: <strong>Claude Sonnet 4.6</strong> (Anthropic)</p>
        <p className="text-sm text-gray-600 mt-1">Dữ liệu context: Tự động lấy từ danh sách ngành học và trường đại học trong hệ thống.</p>
        <p className="text-sm text-gray-500 mt-1">Để cập nhật dữ liệu cho AI, hãy cập nhật thông tin tại mục <strong>Ngành học</strong> và <strong>Trường ĐH</strong>.</p>
      </div>

      <h2 className="font-semibold mb-3">Lịch sử hội thoại ({history.length})</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Đang tải...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Chưa có hội thoại nào</div>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div key={h.id} className="card">
              <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>User #{h.user_id}</span>
                <span>{new Date(h.created_at).toLocaleString('vi-VN')}</span>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Người dùng hỏi:</p>
                  <p className="text-sm">{h.message}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">AI trả lời:</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{h.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
