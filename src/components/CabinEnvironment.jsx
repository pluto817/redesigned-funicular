import { useEffect, useRef } from 'react'
import './CabinEnvironment.css'

// 小屋场景：背景图 + 2.5D 鼠标视差 + 萤火虫/花瓣/灯笼/水面动态
export default function CabinEnvironment({ interactive = false, onInteract }) {
  const bgRef = useRef(null)
  const firefliesRef = useRef(null)
  const petalsRef = useRef(null)
  const lightsRef = useRef(null)

  // 2.5D 鼠标视差
  useEffect(() => {
    let raf = null
    const handleMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5

        if (bgRef.current) {
          bgRef.current.style.transform =
            `rotateY(${nx * 2}deg) rotateX(${-ny * 1.2}deg) translate(${nx * 12}px, ${ny * 8}px) scale(1.08)`
        }
        if (firefliesRef.current) {
          firefliesRef.current.style.transform = `translate(${nx * 32}px, ${ny * 22}px)`
        }
        if (petalsRef.current) {
          petalsRef.current.style.transform = `translate(${nx * 44}px, ${ny * 30}px)`
        }
        if (lightsRef.current) {
          lightsRef.current.style.transform = `translate(${nx * 24}px, ${ny * 16}px)`
        }
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="cabin-env">
      {/* 背景图 */}
      <div className="cabin-bg-wrap">
        <div className="cabin-bg" ref={bgRef} />
      </div>

      {/* 底部渐变遮罩 */}
      <div className="cabin-vignette" />

      {/* 灯笼暖光（呼吸闪烁） */}
      <div className="cabin-lanterns" ref={lightsRef}>
        <span className="lantern-glow lg1" />
        <span className="lantern-glow lg2" />
        <span className="lantern-glow lg3" />
      </div>

      {/* 萤火虫 */}
      <div className="cabin-fireflies" ref={firefliesRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`firefly ff${(i % 6) + 1}`}
            style={{ animationDelay: `${(i * 0.7).toFixed(1)}s` }}
          />
        ))}
      </div>

      {/* 飘落花瓣 */}
      <div className="cabin-petals-falling" ref={petalsRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={`falling-petal fp${(i % 4) + 1}`}
            style={{ animationDelay: `${(i * 1.8).toFixed(1)}s` }}
          />
        ))}
      </div>

      {/* 可点击物件（进入后显示） */}
      {interactive && (
        <div className="cabin-items">
          <button
            className="cabin-item cabin-item--chair"
            onClick={() => onInteract?.('chair')}
            aria-label="木椅"
          >
            🪑
          </button>
          <button
            className="cabin-item cabin-item--table"
            onClick={() => onInteract?.('table')}
            aria-label="小茶桌"
          >
            ☕
          </button>
          <button
            className="cabin-item cabin-item--shelf"
            onClick={() => onInteract?.('shelf')}
            aria-label="小书架"
          >
            📖
          </button>
          <button
            className="cabin-item cabin-item--plant"
            onClick={() => onInteract?.('plant')}
            aria-label="花盆"
          >
            🌱
          </button>
        </div>
      )}
    </div>
  )
}
