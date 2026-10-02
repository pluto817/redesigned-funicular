import { getEmotionColor } from './emotion-matcher.js'
import './ComicPanel.css'

// 场景道具 emoji
const sceneProps = {
  office: '☕📎💻',
  rain: '☔🌧️',
  grass: '🌼🦋',
  onsen: '♨️💨',
  sunset: '🌅🐦',
  bed: '🌙💤',
  watermelon: '🍉🍃',
  tea: '🍵🧣',
  window: '🪟☁️',
  forest: '🌳🍄',
  default: '🍃✨',
}

// 场景背景渐变
const sceneBg = {
  office: 'linear-gradient(180deg, #fef3c7, #f5f5f4)',
  rain: 'linear-gradient(180deg, #e2e8f0, #dbeafe)',
  grass: 'linear-gradient(180deg, #dcfce7, #bbf7d0)',
  onsen: 'linear-gradient(180deg, #ffe4e6, #fed7aa)',
  sunset: 'linear-gradient(180deg, #ffedd5, #ffe4e6)',
  bed: 'linear-gradient(180deg, #e0e7ff, #e2e8f0)',
  watermelon: 'linear-gradient(180deg, #fce7f3, #dcfce7)',
  tea: 'linear-gradient(180deg, #fef3c7, #ffedd5)',
  window: 'linear-gradient(180deg, #e0f2fe, #fef3c7)',
  forest: 'linear-gradient(180deg, #dcfce7, #ccfbf1)',
  default: 'linear-gradient(180deg, #fffbeb, #ffedd5)',
}

// 情绪气泡图标
const bubbleIcons = {
  anxious: '💭',
  sad: '💧',
  angry: '💨',
  confused: '❓',
  stressed: '😮‍💨',
  lonely: '🌙',
  neutral: '🍃',
  happy: '♡',
  warm: '☕',
  peaceful: '🌿',
}

function SceneDecorations({ scene }) {
  if (scene === 'rain') {
    return (
      <div className="scene-decorations">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{ left: `${(i * 10 + 5) % 100}%`, animationDelay: `${i * 0.2}s` }}
          >
            💧
          </div>
        ))}
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(147,197,253,0.4), transparent)' }} />
      </div>
    )
  }
  if (scene === 'grass') {
    return (
      <div className="scene-decorations">
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(134,239,172,0.5), transparent)' }} />
        {['🌼', '🌸', '🌼', '🌸', '🌼', '🌸'].map((f, i) => (
          <div key={i} className="flower" style={{ left: `${10 + i * 15}%`, bottom: `${8 + (i % 3) * 6}%` }}>
            {f}
          </div>
        ))}
        <div className="butterfly">🦋</div>
      </div>
    )
  }
  if (scene === 'onsen') {
    return (
      <div className="scene-decorations">
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(153,246,228,0.5), transparent)', height: '50%' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="steam" style={{ left: `${20 + i * 15}%`, animationDelay: `${i * 0.5}s` }}>〰️</div>
        ))}
        <div className="stone" style={{ left: '5%' }}>🪨</div>
        <div className="stone" style={{ right: '8%' }}>🪨</div>
      </div>
    )
  }
  if (scene === 'sunset') {
    return (
      <div className="scene-decorations">
        <div className="sunset-sun">🌅</div>
        <div className="cloud" style={{ top: '12%', left: '10%' }}>☁️</div>
        <div className="cloud" style={{ top: '20%', left: '50%' }}>☁️</div>
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(253,186,116,0.4), transparent)' }} />
        <div className="bird">🐦</div>
      </div>
    )
  }
  if (scene === 'bed') {
    return (
      <div className="scene-decorations">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="star" style={{ top: `${10 + (i * 11) % 40}%`, left: `${5 + (i * 13) % 90}%`, animationDelay: `${i * 0.3}s` }}>✦</div>
        ))}
        <div className="moon">🌙</div>
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(251,207,232,0.5), transparent)' }} />
      </div>
    )
  }
  if (scene === 'office') {
    return (
      <div className="scene-decorations">
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(214,211,209,0.6), transparent)' }} />
        <div className="office-item" style={{ left: '8%' }}>📄</div>
        <div className="office-item" style={{ left: '18%', bottom: '18%' }}>📎</div>
        <div className="office-item" style={{ right: '12%' }}>☕</div>
        <div className="screen-glow" />
      </div>
    )
  }
  if (scene === 'watermelon') {
    return (
      <div className="scene-decorations">
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(187,247,208,0.5), transparent)' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="watermelon-piece" style={{ left: `${15 + i * 16}%`, bottom: `${20 + (i % 2) * 5}%` }}>🍉</div>
        ))}
        <div className="sun">☀️</div>
      </div>
    )
  }
  if (scene === 'tea') {
    return (
      <div className="scene-decorations">
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(253,230,138,0.4), transparent)' }} />
        <div className="tea-steam">〰️</div>
        <div className="office-item" style={{ left: '12%', bottom: '15%' }}>🍪</div>
        <div className="scarf">🧣</div>
      </div>
    )
  }
  if (scene === 'window') {
    return (
      <div className="scene-decorations">
        <div className="window-frame">
          <div className="window-cloud">☁️</div>
        </div>
        <div className="windowsill" />
        <div className="plant">🪴</div>
      </div>
    )
  }
  if (scene === 'forest') {
    return (
      <div className="scene-decorations">
        <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(134,239,172,0.4), transparent)' }} />
        <div className="tree" style={{ left: '3%' }}>🌳</div>
        <div className="tree" style={{ right: '5%', fontSize: '28px' }}>🌲</div>
        <div className="mushroom">🍄</div>
        <div className="sunbeam" />
      </div>
    )
  }
  return (
    <div className="scene-decorations">
      <div className="default-cloud">☁️</div>
      <div className="scene-ground" style={{ background: 'linear-gradient(to top, rgba(254,243,199,0.3), transparent)' }} />
    </div>
  )
}

function PetAvatar({ petType, size = 'lg' }) {
  const emoji = petType === 'lulu' ? '🐰' : '🦫'
  const sizeClass = size === 'xl' ? 'comic-avatar-xl' : size === 'lg' ? 'comic-avatar-lg' : 'comic-avatar-md'
  return (
    <div className={`comic-avatar ${sizeClass}`}>
      <div className="avatar-bounce">{emoji}</div>
    </div>
  )
}

export default function ComicPanel({
  type,
  title,
  text,
  userLine,
  narration,
  emotion = 'neutral',
  scene = 'default',
  petType = 'capybara',
  pageIndex,
  totalPages,
}) {
  const colors = getEmotionColor(emotion)
  const props = sceneProps[scene] || sceneProps.default
  const bg = sceneBg[scene] || sceneBg.default
  const bubbleIcon = bubbleIcons[emotion] || '🍃'
  const petName = petType === 'lulu' ? '噜噜' : '卡门'

  if (type === 'cover') {
    return (
      <div className="comic-panel cover-panel" style={{ background: colors.bg }}>
        <SceneDecorations scene={scene} />
        <div className="panel-content z-10">
          <div className="cover-avatar-wrap">
            <PetAvatar petType={petType} size="xl" />
            <div className="sparkle sparkle-1">✨</div>
            <div className="sparkle sparkle-2">🌸</div>
          </div>
          <h2 className="cover-title" style={{ color: petType === 'lulu' ? '#be185d' : '#92400e' }}>
            {title || `${petName}的小绘本`}
          </h2>
          <p className="cover-subtitle" style={{ color: petType === 'lulu' ? '#db2777' : '#d97706' }}>{text}</p>
          <div className="cover-tags">
            <span className="cover-tag">{bubbleIcon} 治愈</span>
            <span className="cover-tag">{petType === 'lulu' ? '🐰 噜噜' : '🦫 卡门'}</span>
          </div>
          <div className="cover-footer">～ 封面 ～</div>
        </div>
      </div>
    )
  }

  if (type === 'back-cover') {
    return (
      <div className="comic-panel back-cover-panel">
        <SceneDecorations scene="sunset" />
        <div className="panel-content z-10">
          <div className="cover-avatar-wrap">
            <PetAvatar petType={petType} size="lg" />
            <div className="wave-hand">👋</div>
          </div>
          <p className="back-cover-text" style={{ whiteSpace: 'pre-line' }}>{text}</p>
          <div className="back-cover-sign" style={{ color: petType === 'lulu' ? '#db2777' : '#d97706' }}>
            {petName}永远陪着你 {petType === 'lulu' ? '🐰' : '🦫'}
          </div>
          <div className="cover-footer">～ 完 ～</div>
        </div>
      </div>
    )
  }

  // 内容页
  return (
    <div className="comic-panel content-panel" style={{ background: colors.bg }}>
      <div className="paper-texture" />
      <div className="content-inner">
        {narration && (
          <div className="narration-box">
            <p className="narration-text">{narration}</p>
          </div>
        )}

        <div className="comic-scene" style={{ background: bg }}>
          <SceneDecorations scene={scene} />
          <div className="pet-center">
            <div className="pet-bounce">
              <PetAvatar petType={petType} size="md" />
              <div className="emotion-bubble">{bubbleIcon}</div>
            </div>
          </div>
          <div className="scene-props">{props}</div>
        </div>

        {userLine && (
          <div className="bubble-row user-bubble-row">
            <div className="speech-bubble user-bubble">
              <p className="bubble-label">你说</p>
              <p className="bubble-text">{userLine}</p>
            </div>
          </div>
        )}

        <div className={`bubble-row ${userLine ? 'pet-bubble-row-right' : 'pet-bubble-row-left'}`}>
          <div className={`speech-bubble pet-bubble ${petType === 'lulu' ? 'lulu-bubble' : 'capybara-bubble'}`}>
            <p className="bubble-label" style={{ color: petType === 'lulu' ? '#db2777' : '#d97706' }}>{petName}</p>
            <p className="bubble-text">{text}</p>
          </div>
        </div>

        {totalPages !== undefined && (
          <div className="panel-footer">
            <span>第 {pageIndex + 1} 格</span>
            <span>共 {totalPages} 格</span>
          </div>
        )}
      </div>
    </div>
  )
}
