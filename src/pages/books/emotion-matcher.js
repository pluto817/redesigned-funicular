// 情绪检测（从原项目迁移，纯逻辑无依赖）

const EMOTION_KEYWORDS = {
  anxious: ['焦虑', '紧张', '担心', '害怕', '不安', '慌', '焦躁', '忐忑', '心慌', '好怕', '怕', '焦虑症', '着急', '急'],
  sad: ['难过', '伤心', '哭', '委屈', '难受', '不开心', '沮丧', '心碎', '失望', '崩溃', '痛哭', '泪目', '哭了', '低落'],
  angry: ['生气', '愤怒', '气死', '恼火', '烦躁', '不爽', '气人', '讨厌', '烦', '操', '妈的', '滚', '靠'],
  confused: ['迷茫', '不知道', '怎么办', '纠结', '困惑', '想不通', '没方向', '糊涂', '矛盾'],
  stressed: ['压力', '累', '疲惫', '忙', '加班', '撑不住', '好累', '辛苦', '干不动', '扛不住', '累死', '累瘫', '身心俱疲'],
  lonely: ['一个人', '没人陪', '好孤独', '好寂寞', '空虚', '没人理', '孤单', '孤独'],
  happy: ['开心', '高兴', '快乐', '太好了', '太棒了', '幸福', '好消息', '兴奋', '哈哈', '耶', '哇塞', '厉害', '成功'],
}

export function detectEmotion(text) {
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) return emotion
    }
  }
  // 启发式
  if (/[!！]{2,}/.test(text) && /气|烦|怒|讨厌|滚|靠|妈的|操/.test(text)) return 'angry'
  if (/好开心|好高兴|太棒了|太好了|哈哈哈|耶|哇|开心死|超级开心/.test(text)) return 'happy'
  if (/好累|好困|撑不住|熬不动|扛不住|身心俱疲|累死|累瘫/.test(text)) return 'stressed'
  if (/呜呜|555|5555|哭了|流泪|泪目|破防|心碎|难过死|难受死/.test(text)) return 'sad'
  if (/一个人|没人陪|好孤独|好寂寞|空虚|无聊死了|没人理/.test(text)) return 'lonely'
  return 'neutral'
}

export function getEmotionLabel(emotion) {
  const labels = {
    anxious: '焦虑',
    sad: '难过',
    angry: '生气',
    confused: '迷茫',
    stressed: '压力',
    lonely: '孤独',
    neutral: '平静',
    happy: '开心',
    warm: '温暖',
    peaceful: '平和',
  }
  return labels[emotion] || '平静'
}

export function getEmotionColor(emotion) {
  const colors = {
    anxious: { bg: 'linear-gradient(135deg, #fef3c7, #fed7aa)', accent: '#b45309', bubble: '#fffbeb' },
    sad: { bg: 'linear-gradient(135deg, #dbeafe, #e2e8f0)', accent: '#2563eb', bubble: '#eff6ff' },
    angry: { bg: 'linear-gradient(135deg, #ffe4e6, #fed7aa)', accent: '#dc2626', bubble: '#fff1f2' },
    confused: { bg: 'linear-gradient(135deg, #f3e8ff, #fce7f3)', accent: '#9333ea', bubble: '#faf5ff' },
    stressed: { bg: 'linear-gradient(135deg, #ffedd5, #fef3c7)', accent: '#ea580c', bubble: '#fff7ed' },
    lonely: { bg: 'linear-gradient(135deg, #e0e7ff, #dbeafe)', accent: '#4f46e5', bubble: '#eef2ff' },
    neutral: { bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', accent: '#059669', bubble: '#ecfdf5' },
    happy: { bg: 'linear-gradient(135deg, #fef9c3, #fef3c7)', accent: '#ca8a04', bubble: '#fefce8' },
    warm: { bg: 'linear-gradient(135deg, #ffe4e6, #fce7f3)', accent: '#e11d48', bubble: '#fff1f2' },
    peaceful: { bg: 'linear-gradient(135deg, #ccfbf1, #a5f3fc)', accent: '#0d9488', bubble: '#f0fdfa' },
  }
  return colors[emotion] || colors.neutral
}
