import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import GrasslandBgm from './GrasslandBgm.jsx'
import './StationPage.css'

export default function DandelionPage() {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [bubbleText, setBubbleText] = useState('今天也陪我伸个懒腰吧～')
  const timerRef = useRef(null)
  const bubbleRef = useRef(null)

  const SUGGESTED_TIME = 300 // 5分钟

  const bubbleTexts = {
    idle: '今天也陪我伸个懒腰吧～',
    running: '慢慢来，深呼吸哦',
    suggested: '已经5分钟啦，身体舒展开了吗？',
    done: '哇～今天也做得很棒呢',
  }

  const updateBubble = (text) => {
    setBubbleText(text)
    if (bubbleRef.current) {
      bubbleRef.current.style.animation = 'none'
      bubbleRef.current.offsetHeight
      bubbleRef.current.style.animation = 'bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const toggleTimer = () => {
    if (isFinished) {
      resetTimer()
      return
    }
    if (!isRunning) {
      startTimer()
    } else {
      finishTimer()
    }
  }

  const startTimer = () => {
    setIsRunning(true)
    updateBubble(bubbleTexts.running)
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1
        if (next === SUGGESTED_TIME) {
          updateBubble(bubbleTexts.suggested)
        }
        return next
      })
    }, 1000)
  }

  const finishTimer = () => {
    setIsRunning(false)
    setIsFinished(true)
    clearInterval(timerRef.current)
    updateBubble(bubbleTexts.done)
    localStorage.setItem('dandelion_done', '1')
    localStorage.setItem('dandelion_time', elapsed)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsFinished(false)
    setElapsed(0)
    updateBubble(bubbleTexts.idle)
  }

  const goBack = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    navigate('/grassland')
  }

  useEffect(() => {
    // 视差效果
    const handleMouseMove = (e) => {
      const bg = document.querySelector('.dandelion-page')
      if (!bg) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      bg.style.backgroundPosition = `${50 + x * 3}% ${50 + y * 2}%`
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 生成庆祝彩纸
  const confettiColors = ['#e8a858', '#b8c97a', '#f0c8a0', '#7ab8c9', '#c4a882']
  const confetti = showCelebration
    ? Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            background: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        />
      ))
    : null

  return (
    <div className="station-page dandelion-page">
      <button className="back-btn" onClick={goBack}>← 先回去啦</button>
      <GrasslandBgm />
      <div className="station-title">蒲公英草坡</div>

      {showCelebration && <div className="celebration active">{confetti}</div>}

      <div className="dandelion-container">
        <div className="left-panel">
          <div className="video-window">
            <video loop playsInline muted autoPlay>
              <source src="/grassland/lulu1.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="video-label">噜噜的伸展示范</div>
        </div>

        <div className="right-panel">
          <div className="speech-bubble" ref={bubbleRef}>
            <div className="bubble-text">{bubbleText}</div>
          </div>

          <div className="timer-display">
            <div className="timer-digits">{formatTime(elapsed)}</div>
            <div className={`timer-hint ${isFinished ? 'done' : ''}`}>
              {isFinished
                ? `本次伸展了 ${formatTime(elapsed)}`
                : isRunning
                ? '计时中...'
                : '建议时长：5分钟'}
            </div>
          </div>

          <div className="btn-group">
            <button className="soft-btn btn-primary" onClick={toggleTimer}>
              {isFinished ? '再伸一次' : isRunning ? '完成' : '开始吧'}
            </button>
            <button className="soft-btn btn-secondary" onClick={goBack}>
              先回去啦
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
