import { useState, useEffect, useRef, useCallback } from 'react'
import SceneTransition from '../components/SceneTransition.jsx'
import CabinEnvironment from '../components/CabinEnvironment.jsx'
import CabinCapybara3D from './cabin/CabinCapybara3D.jsx'
import { useScene } from '../context/SceneContext.jsx'
import IslandBgm from './IslandBgm.jsx'
import './Cabin.css'

// ===== 本地 fallback 对话策略（以后可替换为真实 AI API）=====
const CapyReplies = {
  tired: [
    '嗯……今天好像有一点累吧？',
    '累的时候，不用逼自己振作起来。',
    '要不要先陪我坐一会儿？什么都不用想。',
  ],
  stressed: [
    '听起来，好多事情一起压过来了。',
    '我们不用一次解决全部。现在先放一放，好吗？',
    '脑袋装不下的时候，就让它空一会儿。',
  ],
  good: [
    '那今天也值得好好记下来。',
    '开心的时候，也要记得慢慢享受。',
    '想说说是什么让你今天还不错吗？',
  ],
  neutral: [
    '嗯，我在听。',
    '慢慢说，不着急。',
    '今天发生了什么呀？',
  ],
}

// 根据用户输入关键词匹配情绪
function detectMood(text) {
  if (/累|疲惫|困|没力气|撑不住/.test(text)) return 'tired'
  if (/压力|焦虑|紧张|烦|崩溃|做不完|好多/.test(text)) return 'stressed'
  if (/开心|不错|挺好|顺利|完成/.test(text)) return 'good'
  return 'neutral'
}

// 生成回应（模拟 AI，关键词匹配 + 随机）
function generateReply(userText, mood) {
  const pool = CapyReplies[mood] || CapyReplies.neutral
  if (mood === 'tired' && /没做完|好多|做不完|忙/.test(userText)) {
    return '不是一件事让你累，是好多件小事一起压过来了。\n今天先做到这里，就已经很不容易了。'
  }
  if (mood === 'stressed' && /想了很久|一直想|纠结/.test(userText)) {
    return '你已经想了很久了。\n要不要先陪我坐一会儿，脑袋清空一下？'
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

// 今日心情标签生成
function buildTodayMood(mood, userText) {
  const tags = {
    tired: { emoji: '🌙', label: '有一点疲惫' },
    stressed: { emoji: '☁️', label: '事情有些多' },
    good: { emoji: '🌤️', label: '今天还不错' },
    neutral: { emoji: '🍃', label: '平平的一天' },
  }
  const tag = tags[mood] || tags.neutral
  const note = userText ? userText.slice(0, 30) : ''
  return {
    date: new Date().toLocaleDateString('zh-CN'),
    emoji: tag.emoji,
    label: tag.label,
    note,
  }
}

// ===== 主组件 =====
export default function Cabin() {
  const { navigateTo } = useScene()

  // —— 核心状态 ——
  const [characterState, setCharacterState] = useState('entering')
  // entering | idle | listening | comforting | cheerful | resting | eating | looking_out
  const [moodState, setMoodState] = useState(null)
  const [conversationState, setConversationState] = useState('greeting')
  // greeting | mood_prompt | user_turn | capy_responding | choices | resting
  const [restMode, setRestMode] = useState(false)

  // 对话消息
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // 记忆系统
  const [memories, setMemories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cabin_memories') || '[]')
    } catch { return [] }
  })
  const [todayMood, setTodayMood] = useState(null)
  const [showMemory, setShowMemory] = useState(false)

  // idle 行为
  const [idleAction, setIdleAction] = useState(null) // 'eat' | 'look_out' | null
  const idleTimer = useRef(null)
  const restTimer = useRef(null)

  // —— 入场动画 ——
  useEffect(() => {
    if (characterState === 'entering') {
      const t = setTimeout(() => {
        setCharacterState('idle')
        setConversationState('greeting')
        // 第一句问候
        pushCapyMessage('回来啦。')
        // 第二句
        setTimeout(() => {
          pushCapyMessage('今天，好像有一点累吧？')
          setConversationState('mood_prompt')
        }, 1800)
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [characterState])

  // —— idle 随机行为（呼吸/眨眼由3D组件处理，这里控制偶尔动作）——
  useEffect(() => {
    if (characterState !== 'idle' || restMode) return
    const schedule = () => {
      const delay = 8000 + Math.random() * 12000
      idleTimer.current = setTimeout(() => {
        const actions = ['eat', 'look_out', null]
        const action = actions[Math.floor(Math.random() * actions.length)]
        setIdleAction(action)
        setTimeout(() => {
          setIdleAction(null)
          schedule()
        }, action ? 3500 : 1500)
      }, delay)
    }
    schedule()
    return () => clearTimeout(idleTimer.current)
  }, [characterState, restMode])

  const pushCapyMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { from: 'capy', text }])
  }, [])

  // —— 情绪选择 ——
  const handleMoodSelect = (mood) => {
    setMoodState(mood)
    setCharacterState(mood === 'good' ? 'cheerful' : mood === 'stressed' ? 'comforting' : 'listening')
    setConversationState('capy_responding')
    setIsTyping(true)
    const reply = CapyReplies[mood][0]
    setTimeout(() => {
      setIsTyping(false)
      pushCapyMessage(reply)
      setConversationState('choices')
    }, 1200)
  }

  // —— 文字输入 ——
  const handleSend = () => {
    const text = input.trim()
    if (!text || restMode) return
    setMessages((prev) => [...prev, { from: 'user', text }])
    setInput('')
    setConversationState('capy_responding')
    setIsTyping(true)
    setCharacterState('listening')

    const mood = detectMood(text)
    setMoodState(mood)
    const reply = generateReply(text, mood)

    setTimeout(() => {
      setIsTyping(false)
      pushCapyMessage(reply)
      setCharacterState(mood === 'good' ? 'cheerful' : 'comforting')
      setConversationState('choices')
    }, 1400)
  }

  // —— 暂时不说话 ——
  const handleSilence = () => {
    pushCapyMessage('好，那我陪你安静待一会儿。')
    setCharacterState('resting')
    enterRestMode()
  }

  // —— 陪我坐一会儿（沉浸模式）——
  const enterRestMode = () => {
    setRestMode(true)
    setCharacterState('resting')
    setConversationState('resting')
    restTimer.current = setTimeout(() => {
      setShowMemory(true)
      // 生成今日心情
      if (moodState) {
        const mood = buildTodayMood(moodState, messages.filter(m => m.from === 'user').map(m => m.text).join(' '))
        setTodayMood(mood)
      }
    }, 6000)
  }

  const exitRestMode = () => {
    setRestMode(false)
    setShowMemory(false)
    setCharacterState('idle')
    setConversationState('choices')
    clearTimeout(restTimer.current)
  }

  // —— 继续待一会儿 ——
  const extendRest = () => {
    setShowMemory(false)
    restTimer.current = setTimeout(() => setShowMemory(true), 8000)
  }

  // —— 收藏今日心情 ——
  const saveMemory = () => {
    if (!todayMood) return
    const newMemories = [...memories, todayMood].slice(-20)
    setMemories(newMemories)
    localStorage.setItem('cabin_memories', JSON.stringify(newMemories))
    pushCapyMessage('今天的心情，我帮你收起来了。')
    setShowMemory(false)
    setCharacterState('idle')
    setConversationState('choices')
    setRestMode(false)
  }

  // —— 物件交互 ——
  const handleInteract = (item) => {
    if (restMode) return
    if (item === 'chair') {
      setCharacterState('resting')
      pushCapyMessage('坐下来吧，我陪你。')
    } else if (item === 'table') {
      setCharacterState('eating')
      pushCapyMessage('给你倒了杯热茶，慢慢喝。')
      setTimeout(() => setCharacterState('idle'), 3000)
    } else if (item === 'plant') {
      pushCapyMessage('它每天都在慢慢长高，和你一样。')
    } else if (item === 'shelf') {
      pushCapyMessage('书架上都是以前留下的小故事。')
    }
  }

  // 当前卡皮巴拉气泡（最近一条）
  const lastCapyMsg = [...messages].reverse().find(m => m.from === 'capy')

  return (
    <SceneTransition className="cabin-scene">
      <CabinEnvironment
        interactive={!restMode && characterState !== 'entering'}
        onInteract={handleInteract}
        restMode={restMode}
      />

      {/* 3D 角色，根据状态切换 */}
      <div className={`cabin-3d-wrap cabin-3d--${characterState} ${idleAction ? `cabin-3d--idle-${idleAction}` : ''}`}>
        <CabinCapybara3D state={characterState} idleAction={idleAction} />
      </div>

      {/* 卡皮巴拉对白气泡 */}
      {lastCapyMsg && !restMode && (
        <div className="capy-bubble capy-bubble--fade">
          {lastCapyMsg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      )}

      {/* 输入中提示 */}
      {isTyping && (
        <div className="capy-bubble capy-bubble--typing">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
        </div>
      )}

      {/* 情绪提示选择 */}
      {conversationState === 'mood_prompt' && !restMode && (
        <div className="choice-soft">
          <button className="chip" onClick={() => handleMoodSelect('tired')}>有点累</button>
          <button className="chip" onClick={() => handleMoodSelect('stressed')}>压力好大</button>
          <button className="chip" onClick={() => handleMoodSelect('good')}>还不错</button>
          <button className="chip chip--quiet" onClick={handleSilence}>先不说话</button>
        </div>
      )}

      {/* 少量下一步选择 */}
      {conversationState === 'choices' && !restMode && (
        <div className="choice-soft">
          <button className="chip chip--warm" onClick={enterRestMode}>陪我坐一会儿</button>
          <button className="chip" onClick={() => setConversationState('user_turn')}>我想继续说</button>
        </div>
      )}

      {/* 文字输入 */}
      {conversationState === 'user_turn' && !restMode && (
        <div className="chat-input-soft">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="想说点什么……"
          />
          <button onClick={handleSend}>说</button>
        </div>
      )}

      {/* 陪伴模式：沉浸文字 */}
      {restMode && (
        <div className={`rest-overlay ${showMemory ? 'rest-overlay--show-card' : ''}`}>
          {!showMemory ? (
            <div className="rest-text">
              <p>不用急着变好。</p>
              <p className="rest-text__sub">就这样，坐一会儿。</p>
            </div>
          ) : (
            <div className="rest-actions">
              <button className="chip chip--warm" onClick={extendRest}>继续待一会儿</button>
              <button className="chip" onClick={exitRestMode}>回到小屋</button>
            </div>
          )}
        </div>
      )}

      {/* 今日心情记忆卡 */}
      {showMemory && todayMood && (
        <div className="memory-card">
          <div className="memory-card__tag">{todayMood.emoji} 今日心情</div>
          <div className="memory-card__label">{todayMood.label}</div>
          {todayMood.note && <div className="memory-card__note">「{todayMood.note}」</div>}
          <button className="chip chip--warm" onClick={saveMemory}>收藏今天</button>
        </div>
      )}

      {/* 记忆卡墙（收藏后显示在桌面） */}
      {memories.length > 0 && (
        <div className="memory-wall">
          {memories.slice(-3).map((m, i) => (
            <div key={i} className="memory-mini" title={`${m.date} ${m.label}`}>
              <span>{m.emoji}</span>
              <small>{m.date}</small>
            </div>
          ))}
        </div>
      )}

      {/* 左上角返回 */}
      <button className="cabin-back" onClick={() => navigateTo('/island')} aria-label="回到慢岛">
        ← 回到慢岛
      </button>
      <IslandBgm />
    </SceneTransition>
  )
}
