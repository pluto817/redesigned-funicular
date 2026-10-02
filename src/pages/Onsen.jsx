import { useState, useEffect, useRef } from 'react'
import SceneTransition from '../components/SceneTransition.jsx'
import OnsenEnvironment from '../components/OnsenEnvironment.jsx'
import Capybara3D from '../components/Capybara3D.jsx'
import BreathingCircle from '../components/BreathingCircle.jsx'
import { useScene } from '../context/SceneContext.jsx'
import './Onsen.css'

// 状态：entering(入场) → intro(引导文字) → breathing(呼吸) → complete(完成反馈) → good/stay
export default function Onsen() {
  const { navigateTo } = useScene()
  const [phase, setPhase] = useState('entering')
  const [introStep, setIntroStep] = useState(0) // 0:第一句 1:第二句 2:第三句+按钮
  const [breathRound, setBreathRound] = useState(1) // 1-3
  const [breathPhase, setBreathPhase] = useState('in') // in | hold | out
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // 入场动画结束 → intro
  useEffect(() => {
    if (phase === 'entering') {
      const t = setTimeout(() => setPhase('intro'), 6500)
      timers.current.push(t)
      return () => clearTimeout(t)
    }
  }, [phase])

  // intro 阶段：逐句显示文字
  useEffect(() => {
    if (phase !== 'intro') return
    setIntroStep(0)
    const t1 = setTimeout(() => setIntroStep(1), 2200)
    const t2 = setTimeout(() => setIntroStep(2), 4400)
    timers.current.push(t1, t2)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  // breathing 阶段：3轮呼吸 in(4s) → hold(2s) → out(6s)
  useEffect(() => {
    if (phase !== 'breathing') return
    clearTimers()

    let round = 1
    let step = 'in'
    setBreathRound(1)
    setBreathPhase('in')

    const next = () => {
      if (step === 'in') {
        step = 'hold'
        setBreathPhase('hold')
        timers.current.push(setTimeout(next, 2000))
      } else if (step === 'hold') {
        step = 'out'
        setBreathPhase('out')
        timers.current.push(setTimeout(next, 6000))
      } else {
        // out 结束 → 下一轮或完成
        round += 1
        if (round > 3) {
          setPhase('complete')
          return
        }
        setBreathRound(round)
        step = 'in'
        setBreathPhase('in')
        timers.current.push(setTimeout(next, 4000))
      }
    }
    // 第一轮吸气 4s
    timers.current.push(setTimeout(next, 4000))

    return clearTimers
  }, [phase])

  const handleStart = () => setPhase('breathing')
  const handleGood = () => setPhase('good')
  const handleStay = () => setPhase('stay')

  // intro 阶段的文字
  const introTexts = [
    '今天好像有点累。',
    '没关系，先什么都不用做。',
    '跟我一起呼吸。',
  ]

  return (
    <SceneTransition className="onsen-scene">
      {/* 环境 —— breathPhase 控制水波跟随呼吸 */}
      <OnsenEnvironment breathPhase={phase === 'breathing' ? breathPhase : null} />

      {/* 3D 卡皮巴拉 —— 外层 div 控制入场位置，Canvas 内做浮动呼吸动画 */}
      <div className={`capybara-3d-wrapper capybara-3d--${phase}`}>
        <Capybara3D breathPhase={phase === 'breathing' ? breathPhase : null} />
      </div>

      {/* 呼吸圆环（仅 breathing 阶段） */}
      {phase === 'breathing' && (
        <BreathingCircle phase={breathPhase} round={breathRound} />
      )}

      {/* 底部内容区 */}
      <div className={`onsen-bottom onsen-bottom--${phase}`}>
        {phase === 'intro' && (
          <div className="onsen-intro">
            {introStep >= 0 && <p className="onsen-intro-line">{introTexts[0]}</p>}
            {introStep >= 1 && <p className="onsen-intro-line">{introTexts[1]}</p>}
            {introStep >= 2 && (
              <>
                <p className="onsen-intro-line">{introTexts[2]}</p>
                <button className="onsen-btn" onClick={handleStart}>
                  开始放松
                </button>
              </>
            )}
          </div>
        )}

        {phase === 'breathing' && (
          <p className="onsen-breathe-tip">跟着卡皮巴拉呼吸。</p>
        )}

        {phase === 'complete' && (
          <div className="onsen-feedback">
            <p className="onsen-feedback-main">慢一点，也没关系。</p>
            <p className="onsen-feedback-sub">现在感觉怎么样？</p>
            <div className="onsen-feedback-btns">
              <button className="onsen-btn onsen-btn--ghost" onClick={handleGood}>
                好多了
              </button>
              <button className="onsen-btn onsen-btn--ghost" onClick={handleStay}>
                再待一会
              </button>
            </div>
          </div>
        )}

        {phase === 'good' && (
          <div className="onsen-feedback">
            <p className="onsen-feedback-main">很好。</p>
            <p className="onsen-feedback-main">不用一次解决所有事情。</p>
            <button className="onsen-btn" onClick={() => navigateTo('/island')}>
              回到慢岛
            </button>
          </div>
        )}

        {phase === 'stay' && (
          <p className="onsen-stay-tip">那就再坐一会儿。</p>
        )}
      </div>

      {/* 左上角返回按钮 —— 低透明度，悬停变明显 */}
      <button
        className="onsen-back"
        onClick={() => navigateTo('/island')}
        aria-label="回到慢岛"
      >
        ← 回到慢岛
      </button>
    </SceneTransition>
  )
}
