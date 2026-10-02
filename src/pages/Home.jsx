import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

// 三个板块，对应插画里的场景位置
const SECTIONS = [
  {
    key: 'island',
    title: '慢慢岛',
    desc: '温泉·小屋·花园',
    icon: '🏝️',
    // 左上角小岛位置
    pos: { top: '30%', left: '12%' },
    enabled: true,
    type: 'internal',
  },
  {
    key: 'adventure',
    title: '草地探险',
    desc: '森林·桥·蒲公英',
    icon: '🌿',
    // 右侧帐篷/草地位置
    pos: { top: '42%', left: '82%' },
    enabled: true,
    type: 'internal',
    url: '/grassland',
  },
  {
    key: 'diary',
    title: '心情绘本',
    desc: '一起写故事',
    icon: '📖',
    // 底部打开的书位置
    pos: { top: '78%', left: '50%' },
    enabled: true,
    type: 'external',
    url: 'https://4m5zbuyyyjf76.doubaoapps.com/app/app_17f68kgs6ep',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  // 页面加载后尝试自动播放（很多浏览器会拦截，需要用户点击）
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.5
    const tryPlay = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        // 被浏览器拦截，等用户点击
        setPlaying(false)
      }
    }
    tryPlay()
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const handleClick = (section) => {
    if (!section.enabled) return
    if (section.type === 'internal') {
      navigate(section.url || `/${section.key}`)
    } else if (section.type === 'external' && section.url) {
      window.location.href = section.url
    }
  }

  return (
    <div className="home-page">
      {/* 背景音乐 */}
      <audio ref={audioRef} src="/assets/bgm.mp3" loop preload="auto" />

      {/* 封面插画 */}
      <div className="home-cover" style={{ backgroundImage: 'url(/assets/home-cover.png)' }} />

      {/* 轻微顶部/底部渐变遮罩，让标签更清晰 */}
      <div className="home-vignette" />

      {/* 三个入口标签 */}
      {SECTIONS.map((s) => (
        <button
          key={s.key}
          className="home-tag"
          style={{ top: s.pos.top, left: s.pos.left }}
          onClick={() => handleClick(s)}
        >
          <span className="home-tag__icon">{s.icon}</span>
          <span className="home-tag__body">
            <span className="home-tag__title">{s.title}</span>
            <span className="home-tag__desc">{s.desc}</span>
          </span>
          <span className="home-tag__arrow">→</span>
        </button>
      ))}

      <p className="home-title">卡皮小岛 Capy Haven</p>

      {/* 音乐开关 */}
      <button className={`home-music ${playing ? 'home-music--on' : ''}`} onClick={toggleMusic}>
        {playing ? '🎵' : '🔇'}
      </button>
    </div>
  )
}
