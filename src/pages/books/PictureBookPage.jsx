import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from './booksStorage.js'
import './BooksPage.css'

export default function PictureBookPage() {
  const navigate = useNavigate()
  const [mood, setMood] = useState('')
  const [petType, setPetType] = useState('capybara')
  const [isGenerating, setIsGenerating] = useState(false)

  const canGenerate = mood.trim().length > 0

  const handleGenerate = () => {
    if (!canGenerate) return
    setIsGenerating(true)
    // 模拟生成过程
    setTimeout(() => {
      const newBook = createBook(mood, petType)
      setIsGenerating(false)
      navigate(`/books/${newBook.id}`)
    }, 2500)
  }

  if (isGenerating) {
    return (
      <div className="generate-page">
        <header className="detail-header">
          <button className="back-btn-icon" onClick={() => navigate('/books')}>← 返回</button>
          <span className="detail-title">生成绘本</span>
          <div style={{ width: 60 }} />
        </header>
        <div className="generating">
          <div className="generating-icon">{petType === 'capybara' ? '🦫' : '🐰'}</div>
          <div className="generating-text">正在为你画绘本…</div>
          <div className="generating-desc">
            {petType === 'capybara' ? '卡门' : '噜噜'}正在认真画画，请稍等一会儿～
          </div>
          <div className="generating-progress">
            <div className="generating-progress-bar" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="generate-page">
      <header className="detail-header">
        <button className="back-btn-icon" onClick={() => navigate('/books')}>← 返回</button>
        <span className="detail-title">生成绘本</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="generate-content">
        <div className="generate-card">
          <h2>✨ 定制你的专属绘本</h2>
          <p className="generate-subtitle">告诉{petType === 'capybara' ? '卡门' : '噜噜'}你今天的心情</p>

          <div className="form-group">
            <label className="form-label">选择小伙伴</label>
            <div className="pet-selector">
              <div
                className={`pet-option ${petType === 'capybara' ? 'selected' : ''}`}
                onClick={() => setPetType('capybara')}
              >
                <div className="emoji">🦫</div>
                <div className="name">卡门</div>
              </div>
              <div
                className={`pet-option ${petType === 'lulu' ? 'selected' : ''}`}
                onClick={() => setPetType('lulu')}
              >
                <div className="emoji">🐰</div>
                <div className="name">噜噜</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">今天的心情是…</label>
            <textarea
              className="form-textarea"
              placeholder="比如：今天有点焦虑，感觉事情好多做不完…"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
          </div>

          <button
            className="generate-submit"
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{ opacity: canGenerate ? 1 : 0.5 }}
          >
            开始生成绘本 ✨
          </button>
        </div>
      </div>
    </div>
  )
}
