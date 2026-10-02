import { useEffect, useRef } from 'react'
import './GardenEnvironment.css'

// 花园场景：背景图 + 分层 2.5D 视差 + 环境动画 + 阳光状态 + 探索点
export default function GardenEnvironment({
  sunStage = 1,
  started = false,
  butterflyGone = false,
  dandelionBlown = false,
  basketOpen = false,
  onButterfly,
  onDandelion,
  onBasket,
  onLeaf,
  onDrink,
}) {
  const bgRef = useRef(null)
  const midRef = useRef(null)
  const frontRef = useRef(null)
  const cloudsRef = useRef(null)
  const particlesRef = useRef(null)

  // 2.5D 鼠标视差（轻微、自然）
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
            `rotateY(${nx * 1.5}deg) rotateX(${-ny * 0.8}deg) translate(${nx * 8}px, ${ny * 5}px) scale(1.06)`
        }
        if (midRef.current) {
          midRef.current.style.transform = `translate(${nx * 16}px, ${ny * 10}px)`
        }
        if (frontRef.current) {
          frontRef.current.style.transform = `translate(${nx * 30}px, ${ny * 20}px)`
        }
        if (cloudsRef.current) {
          cloudsRef.current.style.transform = `translate(${nx * 24}px, ${ny * 14}px)`
        }
        if (particlesRef.current) {
          particlesRef.current.style.transform = `translate(${nx * 40}px, ${ny * 26}px)`
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
    <div className={`garden-env garden-env--sun-${sunStage} ${started ? 'garden-env--started' : ''}`}>
      {/* 背景层（天空+远山+草地） */}
      <div className="garden-bg-wrap">
        <div className="garden-bg" ref={bgRef} />
      </div>

      {/* 阳光状态色彩叠加层（渐变过渡） */}
      <div className="garden-sun-overlay" />

      {/* 阳光光晕 */}
      <div className="garden-sun-glow" />

      {/* 云朵层 */}
      <div className="garden-clouds" ref={cloudsRef}>
        <div className="gcloud gc1">
          <span className="cloud-puff p1" /><span className="cloud-puff p2" />
          <span className="cloud-puff p3" /><span className="cloud-puff p4" />
          <span className="cloud-puff p5" />
        </div>
        <div className="gcloud gc2">
          <span className="cloud-puff p1" /><span className="cloud-puff p2" />
          <span className="cloud-puff p3" /><span className="cloud-puff p4" />
        </div>
        <div className="gcloud gc3">
          <span className="cloud-puff p1" /><span className="cloud-puff p2" />
          <span className="cloud-puff p3" /><span className="cloud-puff p4" />
          <span className="cloud-puff p5" /><span className="cloud-puff p6" />
        </div>
      </div>

      {/* 中景层（草叶摇摆） */}
      <div className="garden-mid" ref={midRef}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`grass g${(i % 3) + 1}`} style={{ left: `${5 + i * 10}%` }} />
        ))}
      </div>

      {/* 前景探索点 */}
      <div className="garden-front" ref={frontRef}>
        {/* 蝴蝶（SVG） */}
        {!butterflyGone && (
          <button className="explore-item butterfly" onClick={onButterfly} aria-label="蝴蝶">
            <svg viewBox="0 0 60 50" width="56" height="46">
              <defs>
                <linearGradient id="bfly1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffc4d6" />
                  <stop offset="100%" stopColor="#ff8fb0" />
                </linearGradient>
                <linearGradient id="bfly2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffe0ec" />
                  <stop offset="100%" stopColor="#ffb0c8" />
                </linearGradient>
              </defs>
              {/* 左翅 */}
              <ellipse className="w-wings wl" cx="20" cy="20" rx="16" ry="14" fill="url(#bfly1)" />
              <ellipse className="w-wings wl2" cx="22" cy="34" rx="11" ry="9" fill="url(#bfly2)" />
              {/* 右翅 */}
              <ellipse className="w-wings wr" cx="40" cy="20" rx="16" ry="14" fill="url(#bfly1)" />
              <ellipse className="w-wings wr2" cx="38" cy="34" rx="11" ry="9" fill="url(#bfly2)" />
              {/* 翅膀花纹 */}
              <circle cx="16" cy="18" r="3" fill="#fff" opacity="0.7" />
              <circle cx="44" cy="18" r="3" fill="#fff" opacity="0.7" />
              {/* 身体 */}
              <ellipse cx="30" cy="25" rx="2.5" ry="12" fill="#5a3a2a" />
              {/* 触角 */}
              <path d="M29 14 Q26 8 23 6" stroke="#5a3a2a" strokeWidth="1.2" fill="none" />
              <path d="M31 14 Q34 8 37 6" stroke="#5a3a2a" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
        )}

        {/* 蒲公英（SVG） */}
        <button
          className={`explore-item dandelion ${dandelionBlown ? 'dandelion--blown' : ''}`}
          onClick={onDandelion}
          aria-label="蒲公英"
        >
          <svg viewBox="0 0 60 80" width="44" height="58">
            {/* 茎 */}
            <path d="M30 80 Q29 50 30 30" stroke="#7a9a5a" strokeWidth="2.5" fill="none" />
            {/* 叶子 */}
            <path d="M30 55 Q18 50 14 58 Q22 56 30 60" fill="#8fbf5a" />
            {!dandelionBlown && (
              <g>
                {/* 绒毛球 */}
                <circle cx="30" cy="20" r="14" fill="rgba(255,255,255,0.3)" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2
                  const x = 30 + Math.cos(a) * 13
                  const y = 20 + Math.sin(a) * 13
                  return <line key={i} x1="30" y1="20" x2={x} y2={y} stroke="#fff" strokeWidth="0.8" opacity="0.9" />
                })}
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2
                  const x = 30 + Math.cos(a) * 13
                  const y = 20 + Math.sin(a) * 13
                  return <circle key={i} cx={x} cy={y} r="1.8" fill="#fff" opacity="0.95" />
                })}
              </g>
            )}
          </svg>
          {dandelionBlown && Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={`dandelion-seed s${i + 1}`} />
          ))}
        </button>

        {/* 野餐篮（SVG） */}
        <button
          className={`explore-item picnic-basket ${basketOpen ? 'picnic-basket--open' : ''}`}
          onClick={onBasket}
          aria-label="野餐篮"
        >
          <svg viewBox="0 0 60 55" width="56" height="52">
            {/* 篮身 */}
            <path d="M8 22 L10 50 Q30 55 50 50 L52 22 Z" fill="#c89040" stroke="#a06820" strokeWidth="1" />
            {/* 编织纹 */}
            <line x1="8" y1="30" x2="52" y2="30" stroke="#a06820" strokeWidth="0.8" opacity="0.5" />
            <line x1="8" y1="38" x2="52" y2="38" stroke="#a06820" strokeWidth="0.8" opacity="0.5" />
            <line x1="8" y1="46" x2="52" y2="46" stroke="#a06820" strokeWidth="0.8" opacity="0.5" />
            {/* 篮口 */}
            <ellipse cx="30" cy="22" rx="22" ry="5" fill="#d4a050" stroke="#a06820" strokeWidth="1" />
            {/* 提手 */}
            <path d="M12 22 Q30 -2 48 22" stroke="#a06820" strokeWidth="2.5" fill="none" />
            {/* 饼干 */}
            {basketOpen && (
              <g>
                <circle cx="24" cy="20" r="5" fill="#e8c070" stroke="#c89040" strokeWidth="0.8" />
                <circle cx="22" cy="19" r="0.8" fill="#8a5a20" />
                <circle cx="26" cy="21" r="0.8" fill="#8a5a20" />
                <circle cx="36" cy="20" r="5" fill="#e8c070" stroke="#c89040" strokeWidth="0.8" />
                <circle cx="34" cy="19" r="0.8" fill="#8a5a20" />
                <circle cx="38" cy="21" r="0.8" fill="#8a5a20" />
              </g>
            )}
          </svg>
        </button>

        {/* 饮料（SVG） */}
        <button className="explore-item drink" onClick={onDrink} aria-label="饮料">
          <svg viewBox="0 0 40 60" width="36" height="54">
            {/* 杯身 */}
            <path d="M8 14 L10 54 Q20 58 30 54 L32 14 Z" fill="url(#cupGrad)" />
            <defs>
              <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff8a8a" />
                <stop offset="50%" stopColor="#ff5a5a" />
                <stop offset="100%" stopColor="#e04040" />
              </linearGradient>
            </defs>
            {/* 液体 */}
            <path d="M9 20 L10 53 Q20 56 30 53 L31 20 Z" fill="#ffb060" opacity="0.6" />
            {/* 杯口 */}
            <ellipse cx="20" cy="14" rx="12" ry="3" fill="#ff7070" stroke="#d03030" strokeWidth="0.8" />
            {/* 吸管 */}
            <rect x="22" y="0" width="3" height="18" rx="1" fill="#fff" transform="rotate(8 23 9)" />
            {/* 高光 */}
            <ellipse cx="14" cy="30" rx="2" ry="12" fill="#fff" opacity="0.3" />
          </svg>
        </button>

        {/* 树叶（SVG） */}
        <button className="explore-item leaf" onClick={onLeaf} aria-label="树叶">
          <svg viewBox="0 0 50 50" width="48" height="48">
            <defs>
              <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a8d878" />
                <stop offset="100%" stopColor="#5a8a3a" />
              </linearGradient>
            </defs>
            <path
              d="M25 2 Q42 10 44 28 Q42 44 25 48 Q8 44 6 28 Q8 10 25 2 Z"
              fill="url(#leafGrad)"
              stroke="#4a7a2a"
              strokeWidth="1"
            />
            {/* 叶脉 */}
            <path d="M25 4 L25 46" stroke="#4a7a2a" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M25 14 Q33 16 38 22" stroke="#4a7a2a" strokeWidth="0.7" fill="none" opacity="0.5" />
            <path d="M25 24 Q33 26 37 32" stroke="#4a7a2a" strokeWidth="0.7" fill="none" opacity="0.5" />
            <path d="M25 14 Q17 16 12 22" stroke="#4a7a2a" strokeWidth="0.7" fill="none" opacity="0.5" />
            <path d="M25 24 Q17 26 13 32" stroke="#4a7a2a" strokeWidth="0.7" fill="none" opacity="0.5" />
          </svg>
        </button>
      </div>

      {/* 漂浮粒子 */}
      <div className="garden-particles" ref={particlesRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`particle pt${(i % 3) + 1}`}
            style={{ animationDelay: `${(i * 0.8).toFixed(1)}s` }}
          />
        ))}
      </div>

      {/* 底部渐变遮罩 */}
      <div className="garden-vignette" />
    </div>
  )
}
