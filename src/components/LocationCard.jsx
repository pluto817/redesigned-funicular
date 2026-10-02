import { useScene } from '../context/SceneContext.jsx'
import './LocationCard.css'

// 精美的地点卡片 —— 定位在地图对应区域上，点击跳转
// props: name 中文名, enName 英文名, icon emoji, desc 短描述, x/y 百分比位置, to 跳转路径
export default function LocationCard({ name, enName, icon, desc, x, y, to }) {
  const { navigateTo } = useScene()

  return (
    <button
      className="loc-card"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => navigateTo(to)}
      aria-label={name}
    >
      <span className="loc-card__glow" />
      <span className="loc-card__inner">
        <span className="loc-card__icon">{icon}</span>
        <span className="loc-card__text">
          <span className="loc-card__name">{name}</span>
          <span className="loc-card__en">{enName}</span>
        </span>
      </span>
      <span className="loc-card__desc">{desc}</span>
    </button>
  )
}
