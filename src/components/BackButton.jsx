import { useScene } from '../context/SceneContext.jsx'
import './BackButton.css'

// 通用返回按钮：淡出后回到慢岛
export default function BackButton() {
  const { navigateTo } = useScene()
  return (
    <button className="back-btn" onClick={() => navigateTo('/island')}>
      <span className="back-btn__arrow">←</span>
      <span className="back-btn__text">回到慢岛</span>
    </button>
  )
}
