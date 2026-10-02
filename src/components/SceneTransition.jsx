import { useScene } from '../context/SceneContext.jsx'
import './SceneTransition.css'

// 场景过渡容器：负责淡入淡出
// - 进入页面时自动淡入
// - 调用 navigateTo 时当前页面淡出
export default function SceneTransition({ children, className = '' }) {
  const { leaving } = useScene()

  return (
    <div className={`scene-transition ${leaving ? 'scene-leaving' : 'scene-entering'} ${className}`}>
      {children}
    </div>
  )
}
