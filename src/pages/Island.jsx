import { useNavigate } from 'react-router-dom'
import SceneTransition from '../components/SceneTransition.jsx'
import LocationCard from '../components/LocationCard.jsx'
import './Island.css'

// 主地图：背景为 island-map.png，叠加动态效果层 + 三个精美地点卡片
export default function Island() {
  const navigate = useNavigate()
  // 生成浮动光点
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 3 + Math.random() * 5,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 6,
  }))

  return (
    <SceneTransition className="island-page">
      {/* 地图底图（可替换） */}
      <div className="island-page__map" role="img" aria-label="慢岛地图" />

      {/* 动态效果层：海面波光 */}
      <div className="island-page__shimmer" />

      {/* 动态效果层：温泉热气 */}
      <div className="island-page__steam steam-1" />
      <div className="island-page__steam steam-2" />
      <div className="island-page__steam steam-3" />

      {/* 动态效果层：飘动的云 */}
      <div className="island-page__cloud cloud-a" />
      <div className="island-page__cloud cloud-b" />
      <div className="island-page__cloud cloud-c" />

      {/* 动态效果层：浮动光点 */}
      <div className="island-page__particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="island-page__particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 三个精美地点卡片 —— 定位在插画对应区域 */}
      <LocationCard
        name="泡泡温泉"
        enName="Bubble Onsen"
        icon="💧"
        desc="压力暂停站"
        x={22}
        y={24}
        to="/onsen"
      />
      <LocationCard
        name="卡皮巴拉小屋"
        enName="Capybara Cabin"
        icon="🏡"
        desc="随时可以回来"
        x={52}
        y={32}
        to="/cabin"
      />
      <LocationCard
        name="晒太阳花园"
        enName="Sunny Garden"
        icon="☀️"
        desc="能量恢复处"
        x={79}
        y={54}
        to="/garden"
      />

      {/* 右下角指南针装饰 */}
      <div className="island-page__compass" aria-hidden="true">
        <span className="island-page__compass-needle" />
      </div>

      {/* 左上角返回首页按钮 */}
      <button
        className="island-back"
        onClick={() => navigate('/')}
        aria-label="返回首页"
      >
        <span className="island-back__icon">←</span>
        <span className="island-back__text">返回首页</span>
      </button>
    </SceneTransition>
  )
}
