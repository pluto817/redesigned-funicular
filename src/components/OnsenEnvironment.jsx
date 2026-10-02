import { useEffect, useRef } from 'react'
import './OnsenEnvironment.css'

// 温泉场景：温泉插画背景 + 2.5D 鼠标视差 + 轻量动态效果
export default function OnsenEnvironment({ breathPhase = null }) {
  const bgRef = useRef(null)
  const steamRef = useRef(null)
  const firefliesRef = useRef(null)
  const petalsRef = useRef(null)

  // 2.5D 鼠标视差：柔和的分层移动
  useEffect(() => {
    let raf = null
    const handleMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5

        // 背景：极轻微倾斜 + 小幅平移
        if (bgRef.current) {
          bgRef.current.style.transform =
            `rotateY(${nx * 2}deg) rotateX(${-ny * 1.2}deg) translate(${nx * 12}px, ${ny * 8}px) scale(1.08)`
        }
        // 蒸汽：中景
        if (steamRef.current) {
          steamRef.current.style.transform = `translateX(-50%) translate(${nx * 20}px, ${ny * 14}px)`
        }
        // 萤火虫：近景
        if (firefliesRef.current) {
          firefliesRef.current.style.transform = `translate(${nx * 32}px, ${ny * 22}px)`
        }
        // 花瓣：最近景
        if (petalsRef.current) {
          petalsRef.current.style.transform = `translate(${nx * 44}px, ${ny * 30}px)`
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
    <div className="onsen-env">
      {/* 背景图（带 3D 倾斜） */}
      <div className="onsen-bg-wrap">
        <div className="onsen-bg" ref={bgRef} />
      </div>

      {/* 底部渐变遮罩 */}
      <div className="onsen-vignette" />

      {/* 温泉蒸汽（中景） */}
      <div className="onsen-steam" ref={steamRef}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`steam s${(i % 5) + 1}`} style={{ animationDelay: `${(i * 0.7).toFixed(1)}s` }} />
        ))}
      </div>

      {/* 萤火虫（近景） */}
      <div className="onsen-fireflies" ref={firefliesRef}>
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`firefly f${(i % 8) + 1}`}
            style={{ animationDelay: `${(i * 0.6).toFixed(1)}s` }}
          />
        ))}
      </div>

      {/* 飘落花瓣（最近景） */}
      <div className="onsen-petals-falling" ref={petalsRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`falling-petal fp${i + 1}`} style={{ animationDelay: `${(i * 1.5).toFixed(1)}s` }} />
        ))}
      </div>

      {/* 水面波光叠加 */}
      <div className={`onsen-water-overlay ${breathPhase ? `water--${breathPhase}` : ''}`} />
    </div>
  )
}
