import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './GrasslandHome.css'

export default function GrasslandHome() {
  const navigate = useNavigate()

  const enterStation = (station) => {
    navigate(`/grassland/${station}`)
  }

  useEffect(() => {
    // 生成天空粒子
    const container = document.getElementById('grassland-particles')
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div')
      p.className = 'grassland-particle'
      const size = 3 + Math.random() * 5
      p.style.width = size + 'px'
      p.style.height = size + 'px'
      p.style.left = Math.random() * 100 + '%'
      p.style.top = -10 + 'px'
      p.style.animationDuration = (12 + Math.random() * 16) + 's'
      p.style.animationDelay = Math.random() * 10 + 's'
      container.appendChild(p)
    }
  }, [])

  useEffect(() => {
    // 2.5D视差效果
    const handleMouseMove = (e) => {
      const bg = document.querySelector('.grassland-bg')
      if (!bg) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      bg.style.backgroundPosition = `${50 + x * 3}% ${50 + y * 2}%`
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stations = [
    {
      id: 'dandelion',
      icon: '🌼',
      name: '蒲公英草坡',
      desc: '低难度 · 室内微行动',
      difficulty: '伸展放松',
      difficultyColor: '#b8c97a',
      className: 'station-dandelion',
    },
    {
      id: 'bridge',
      icon: '🌉',
      name: '溪流木桥',
      desc: '中难度 · 轻量外出',
      difficulty: '轻松散步',
      difficultyColor: '#7ab8c9',
      className: 'station-bridge',
    },
    {
      id: 'forest',
      icon: '🌰',
      name: '橡果森林',
      desc: '高难度 · 深度探索',
      difficulty: '探索发现',
      difficultyColor: '#c9a07a',
      className: 'station-forest',
    },
  ]

  return (
    <div className="grassland-home">
      <div className="grassland-bg" />
      <div className="grassland-particles" id="grassland-particles" />

      <div className="stations-layer">
        {stations.map((station, idx) => (
          <div
            key={station.id}
            className={`station-card ${station.className}`}
            style={{ animationDelay: `${idx}s` }}
            onClick={() => enterStation(station.id)}
          >
            <div className="card-inner">
              <span className="station-icon">{station.icon}</span>
              <div className="station-name">{station.name}</div>
              <div className="station-desc">{station.desc}</div>
              <span
                className="station-difficulty"
                style={{ background: station.difficultyColor }}
              >
                {station.difficulty}
              </span>
              <div className="stone-base" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
