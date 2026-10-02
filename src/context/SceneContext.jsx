import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const SceneContext = createContext(null)

// 过渡时长（毫秒），需与 CSS transition 保持一致
const FADE_DURATION = 450

export function SceneProvider({ children }) {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)

  // 淡出后再跳转，确保场景切换有过渡
  const navigateTo = useCallback(
    (path) => {
      if (leaving) return
      setLeaving(true)
      window.setTimeout(() => {
        navigate(path)
        // 路由切换后，由新页面的 SceneTransition 控制淡入
        // 这里稍作延迟再重置 leaving，避免闪烁
        window.setTimeout(() => setLeaving(false), 30)
      }, FADE_DURATION)
    },
    [navigate, leaving],
  )

  return (
    <SceneContext.Provider value={{ navigateTo, leaving, FADE_DURATION }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) {
    throw new Error('useScene 必须在 SceneProvider 内部使用')
  }
  return ctx
}
