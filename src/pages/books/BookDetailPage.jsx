import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookById } from './booksStorage.js'
import ComicPanel from './ComicPanel.jsx'
import BooksBgm from './BooksBgm.jsx'
import './BooksPage.css'

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (id) {
      const found = getBookById(id)
      if (found) setBook(found)
    }
  }, [id])

  const goToPage = useCallback((index) => {
    if (!book) return
    if (index >= 0 && index < book.pages.length) setCurrentPage(index)
  }, [book])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1)
      if (e.key === 'ArrowRight') goToPage(currentPage + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentPage, goToPage])

  if (!book) {
    return (
      <div className="books-page">
        <BooksBgm />
        <header className="detail-header">
          <button className="back-btn-icon" onClick={() => navigate('/books')}>← 书架</button>
          <span className="detail-title">绘本不存在</span>
          <div style={{ width: 60 }} />
        </header>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
          <p style={{ color: '#d97706', marginBottom: 20 }}>这本绘本不存在或已被删除</p>
          <button className="generate-submit" onClick={() => navigate('/books')}>返回书架</button>
        </div>
      </div>
    )
  }

  const page = book.pages[currentPage]
  const isFirst = currentPage === 0
  const isLast = currentPage === book.pages.length - 1

  return (
    <div className="book-detail-page">
      <BooksBgm />
      <header className="detail-header">
        <button className="back-btn-icon" onClick={() => navigate('/books')}>← 书架</button>
        <span className="detail-title">{book.title}</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="book-reader">
        <div className="reader-frame" key={currentPage}>
          <ComicPanel
            type={page.type}
            title={page.title}
            text={page.text}
            userLine={page.userLine}
            narration={page.narration}
            emotion={page.emotion}
            scene={page.scene}
            petType={book.petType || 'capybara'}
            pageIndex={currentPage}
            totalPages={book.pages.length}
          />
        </div>

        {/* 翻页热区 */}
        {!isFirst && (
          <button
            className="page-hotspot left"
            onClick={() => goToPage(currentPage - 1)}
            aria-label="上一页"
          />
        )}
        {!isLast && (
          <button
            className="page-hotspot right"
            onClick={() => goToPage(currentPage + 1)}
            aria-label="下一页"
          />
        )}

        {/* 翻页箭头 */}
        {!isFirst && (
          <button className="page-arrow left" onClick={() => goToPage(currentPage - 1)}>‹</button>
        )}
        {!isLast && (
          <button className="page-arrow right" onClick={() => goToPage(currentPage + 1)}>›</button>
        )}

        {/* 页码点 */}
        <div className="reader-dots">
          {book.pages.map((_, i) => (
            <button
              key={i}
              className={`reader-dot ${i === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>

        {/* 进度 */}
        <div className="reader-progress">
          <span>第 {currentPage + 1} 页 / 共 {book.pages.length} 页</span>
        </div>
      </div>
    </div>
  )
}
