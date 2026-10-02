import { useState, useEffect, useRef, useCallback } from 'react'
import SceneTransition from '../components/SceneTransition.jsx'
import GardenEnvironment from '../components/GardenEnvironment.jsx'
import GardenCapybara3D from './garden/GardenCapybara3D.jsx'
import { useScene } from '../context/SceneContext.jsx'
import IslandBgm from './IslandBgm.jsx'
import './Garden.css'

// 陪伴时间文案
const TIME_MESSAGES = [
  { sec: 0, text: '找个舒服的位置吧。' },
  { sec: 60, text: '好像开始暖起来了。' },
  { sec: 180, text: '什么都不做，也没关系。' },
  { sec: 300, text: '今天也辛苦了。' },
]

function getTimeMessage(sec) {
  let msg = TIME_MESSAGES[0].text
  for (const t of TIME_MESSAGES) {
    if (sec >= t.sec) msg = t.text
  }
  return msg
}

export default function Garden() {
  const { navigateTo } = useScene()

  // 阳光状态：0 清晨 | 1 午后 | 2 傍晚
  const [sunStage, setSunStage] = useState(1)
  // 是否已开始晒太阳
  const [started, setStarted] = useState(false)
  // 陪伴时间（秒）
  const [seconds, setSeconds] = useState(0)
  // 卡皮巴拉动作
  const [capyAction, setCapyAction] = useState(null) // stretch | drink | doze
  // 卡皮巴拉气泡
  const [capyMsg, setCapyMsg] = useState('')
  // 探索反馈
  const [exploreTip, setExploreTip] = useState('')
  // 蝴蝶是否飞走
  const [butterflyGone, setButterflyGone] = useState(false)
  // 蒲公英是否吹散
  const [dandelionBlown, setDandelionBlown] = useState(false)
  // 野餐篮是否打开
  const [basketOpen, setBasketOpen] = useState(false)

  const idleTimer = useRef(null)
  const actionTimer = useRef(null)
  const timeInterval = useRef(null)

  // 陪伴时间计时
  useEffect(() => {
    if (!started) return
    timeInterval.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timeInterval.current)
  }, [started])

  // 长时间无操作 → 卡皮巴拉打瞌睡
  const resetIdle = useCallback(() => {
    clearTimeout(idleTimer.current)
    if (started) {
      idleTimer.current = setTimeout(() => {
        setCapyAction('doze')
      }, 25000)
    }
  }, [started])

  useEffect(() => {
    window.addEventListener('mousemove', resetIdle)
    window.addEventListener('click', resetIdle)
    return () => {
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('click', resetIdle)
      clearTimeout(idleTimer.current)
    }
  }, [resetIdle])

  // 清除动作
  const clearAction = () => {
    clearTimeout(actionTimer.current)
    actionTimer.current = setTimeout(() => setCapyAction(null), 2500)
  }

  // 点击卡皮巴拉 → 伸懒腰
  const handleCapyClick = () => {
    if (capyAction === 'doze') {
      setCapyAction(null)
      setCapyMsg('嗯？你来了。')
    } else {
      setCapyAction('stretch')
      const msgs = ['嗯～伸个懒腰。', '今天的阳光真好。', '再晒一会儿吧。']
      setCapyMsg(msgs[Math.floor(Math.random() * msgs.length)])
    }
    clearAction()
    setTimeout(() => setCapyMsg(''), 2500)
  }

  // 点击饮料 → 喝一口
  const handleDrink = () => {
    setCapyAction('drink')
    setCapyMsg('啊～凉快。')
    clearAction()
    setTimeout(() => setCapyMsg(''), 2000)
  }

  // 点击蝴蝶 → 飞走
  const handleButterfly = () => {
    setButterflyGone(true)
    setExploreTip('蝴蝶飞走了。')
    setTimeout(() => setExploreTip(''), 2000)
    setTimeout(() => setButterflyGone(false), 15000)
  }

  // 点击蒲公英 → 种子飘散
  const handleDandelion = () => {
    setDandelionBlown(true)
    setExploreTip('种子随风飘走了。')
    setTimeout(() => setExploreTip(''), 2000)
    setTimeout(() => setDandelionBlown(false), 12000)
  }

  // 点击野餐篮 → 小点心
  const handleBasket = () => {
    setBasketOpen(true)
    setExploreTip('篮子里有几块小饼干。')
    setTimeout(() => setExploreTip(''), 2500)
    setTimeout(() => setBasketOpen(false), 8000)
  }

  // 点击树叶
  const handleLeaf = () => {
    setExploreTip('树叶轻轻晃了晃。')
    setTimeout(() => setExploreTip(''), 1800)
  }

  // 开始晒太阳
  const handleStart = () => {
    setStarted(true)
    resetIdle()
  }

  const timeMsg = getTimeMessage(seconds)
  const timeStr = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <SceneTransition className="garden-scene">
      <GardenEnvironment
        sunStage={sunStage}
        started={started}
        butterflyGone={butterflyGone}
        dandelionBlown={dandelionBlown}
        basketOpen={basketOpen}
        onButterfly={handleButterfly}
        onDandelion={handleDandelion}
        onBasket={handleBasket}
        onLeaf={handleLeaf}
        onDrink={handleDrink}
      />

      {/* 3D 卡皮巴拉 */}
      <div className="garden-3d-wrap" onClick={handleCapyClick}>
        <GardenCapybara3D action={capyAction} sunStage={sunStage} />
      </div>

      {/* 卡皮巴拉气泡 */}
      {capyMsg && (
        <div className="garden-capy-bubble">
          <p>{capyMsg}</p>
        </div>
      )}

      {/* 探索轻提示 */}
      {exploreTip && (
        <div className="garden-explore-tip">{exploreTip}</div>
      )}

      {/* 开始晒太阳按钮（开始后淡化消失） */}
      {!started && (
        <div className="garden-start">
          <p className="garden-start-line">今天，就在这里歇一会儿吧。</p>
          <button className="garden-btn garden-btn--sun" onClick={handleStart}>
            ☀ 开始晒太阳
          </button>
        </div>
      )}

      {/* 陪伴时间 + 文案 */}
      {started && (
        <div className="garden-time">
          <span className="garden-time__clock">已经陪你晒太阳 {timeStr}</span>
          <span className="garden-time__msg">{timeMsg}</span>
        </div>
      )}

      {/* 阳光控制（隐蔽） */}
      <div className={`garden-sun-control ${started ? 'garden-sun-control--show' : ''}`}>
        <span className="garden-sun-control__label">☀ 阳光</span>
        <input
          type="range"
          min="0"
          max="2"
          step="1"
          value={sunStage}
          onChange={(e) => setSunStage(Number(e.target.value))}
        />
        <span className="garden-sun-control__stages">
          <em className={sunStage === 0 ? 'active' : ''}>清晨</em>
          <em className={sunStage === 1 ? 'active' : ''}>午后</em>
          <em className={sunStage === 2 ? 'active' : ''}>傍晚</em>
        </span>
      </div>

      {/* 左上角返回 */}
      <button className="garden-back" onClick={() => navigateTo('/island')} aria-label="回到慢岛">
        ← 回到慢岛
      </button>
      <IslandBgm />
    </SceneTransition>
  )
}
