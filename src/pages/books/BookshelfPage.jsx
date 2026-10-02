import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooks, deleteBook } from './booksStorage.js'
import BooksBgm from './BooksBgm.jsx'
import './BooksPage.css'

export default function BookshelfPage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setBooks(getBooks())
  }, [])

  const filteredBooks = books.filter((b) => {
    if (filter === 'all') return true
    return b.petType === filter
  })

  const getPetLabel = (petType) => {
    return petType === 'lulu'
      ? { name: '噜噜', emoji: '🐰', color: '#ec4899', bgColor: '#fce7f3' }
      : { name: '卡门', emoji: '🦫', color: '#d97706', bgColor: '#fef3c7' }
  }

  const formatDate = (timestamp) => {
    const d = new Date(timestamp)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (confirm('确定要删除这本绘本吗？')) {
      deleteBook(id)
      setBooks(getBooks())
    }
  }

  return (
    <div className="books-page">
      <BooksBgm />
      <header className="books-header">
        <div className="header-left">
          <button className="back-btn-icon" onClick={() => navigate('/')}>← 返回</button>
          <div className="header-title">
            <span className="header-icon">📖</span>
            <span>我的书架</span>
          </div>
        </div>
        <button
          className="generate-btn"
          onClick={() => navigate('/books/generate')}
        >
          ✨ 生成绘本
        </button>
      </header>

      <div className="books-content">
        {books.length === 0 ? (
          <div className="empty-shelf">
            <div className="empty-icon">📖</div>
            <p className="empty-title">还没有绘本哦</p>
            <p className="empty-desc">去和小伙伴聊聊天吧～</p>
            <button
              className="start-btn"
              onClick={() => navigate('/books/generate')}
            >
              开始生成绘本
            </button>
          </div>
        ) : (
          <>
            <div className="filter-tabs">
              {[
                { key: 'all', label: '全部', emoji: '📚' },
                { key: 'capybara', label: '卡门', emoji: '🦫' },
                { key: 'lulu', label: '噜噜', emoji: '🐰' },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`filter-tab ${filter === t.key ? 'active' : ''}`}
                  onClick={() => setFilter(t.key)}
                >
                  <span>{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <p className="books-count">共有 {filteredBooks.length} 本绘本</p>

            {filteredBooks.length === 0 ? (
              <div className="empty-filter">这个分类还没有绘本哦～</div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book) => {
                  const pet = getPetLabel(book.petType)
                  return (
                    <div
                      key={book.id}
                      className="book-card"
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      <div
                        className="book-cover"
                        style={{ background: `linear-gradient(135deg, ${pet.bgColor} 0%, #fff 100%)` }}
                      >
                        <div
                          className="pet-badge"
                          style={{ background: pet.bgColor, color: pet.color, borderColor: pet.color + '40' }}
                        >
                          {pet.emoji} {pet.name}
                        </div>
                        <div className="book-cover-inner">
                          <div className="book-avatar">{pet.emoji}</div>
                          <h3 className="book-title">{book.title}</h3>
                        </div>
                        <div className="page-count">{book.pages.length} 页</div>
                      </div>
                      <div className="book-info">
                        <span className="book-date">{formatDate(book.createdAt)}</span>
                        <button
                          className="book-delete"
                          onClick={(e) => handleDelete(e, book.id)}
                          title="删除"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
