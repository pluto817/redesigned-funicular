// 绘本生成逻辑（从原项目迁移）
import { detectEmotion, getEmotionLabel } from './emotion-matcher.js'

// 情绪 → 旁白库
const narrationsByEmotion = {
  anxious: [
    '这一天，心里的小鼓又咚咚敲了起来。',
    '好像有很多事堆在一起，有点喘不过气。',
    '卡门说，不如先停下来，喝口水。',
    '深呼吸三下，呼——焦虑少了一点没？',
  ],
  sad: [
    '雨悄悄地下着，心情也跟着湿湿的。',
    '有些难过，堵在胸口，说不出来。',
    '卡门慢慢走过来，坐在你旁边，什么都没说。',
    '眼泪跟水混在一起，就没人看见了。',
  ],
  angry: [
    '呼——气鼓鼓的，像个被吹胀的气球。',
    '有些事，想想就觉得气不打一处来。',
    '卡门眨了眨眼，说：深呼吸三下。',
    '气多了会长皱纹的哦，划不来。',
  ],
  confused: [
    '站在岔路口，不知道该往哪边走。',
    '想了很久，还是没有答案。',
    '卡门说，迷路了也没关系，沿途的草也很好吃。',
    '想不通就不想了嘛，发会儿呆。',
  ],
  stressed: [
    '桌上的文件堆得像小山一样高。',
    '好累啊，感觉肩膀上驮了好多小石子。',
    '卡门说：累了就歇会儿，你又不是永动机。',
    '今天先放过自己吧。',
  ],
  lonely: [
    '傍晚的时候，忽然觉得有点寂寞。',
    '看着窗外，好像全世界只剩自己。',
    '卡门慢悠悠地游过来：你不是一个人呀。',
    '我陪着你呢，泡多久都行。',
  ],
  neutral: [
    '普普通通的一天，阳光刚刚好。',
    '随便聊聊，也没什么特别的事。',
    '卡门眯着眼，享受着安静的时光。',
    '生活嘛，慢慢来。',
  ],
  happy: [
    '今天的风里都带着甜甜的味道。',
    '心情像草地上打滚一样轻松。',
    '卡门啃着西瓜，笑眯眯地看着你。',
    '开心的时候，就多笑一会儿。',
  ],
  peaceful: [
    '温泉的水泡轻轻冒上来，时间好像慢了下来。',
    '什么都不想，就这样泡着，也很好。',
    '卡门闭上眼睛，嘴角微微上扬。',
    '一切都会慢慢好起来的。',
  ],
  warm: [
    '热茶的蒸汽袅袅升起，暖到了心里。',
    '有些话不用说，陪着就很好。',
    '卡门裹着小围巾，安静地坐在你身边。',
  ],
}

// 情绪 → 场景映射
const scenesByEmotion = {
  anxious: ['onsen', 'grass', 'tea'],
  sad: ['rain', 'window', 'bed'],
  angry: ['onsen', 'watermelon', 'grass'],
  confused: ['grass', 'sunset', 'forest'],
  stressed: ['office', 'bed', 'onsen'],
  lonely: ['sunset', 'window', 'rain'],
  neutral: ['grass', 'tea', 'forest'],
  happy: ['grass', 'watermelon', 'sunset'],
  warm: ['tea', 'onsen', 'sunset'],
  peaceful: ['onsen', 'grass', 'forest'],
}

// 宠物回复语料（按情绪）
const petRepliesByEmotion = {
  anxious: [
    '焦虑就焦虑吧，我被鸟啄的时候也慌。后来鸟飞走了，我还在水里。',
    '紧张是正常的。你看我，鳄鱼在旁边我也照样泡着。习惯就好了。',
    '来，把橘子顶头上。掉了就掉了，焦虑也一样。',
    '慌啥呢。再大的事，也大不过一片水。泡进去，世界就安静了。',
  ],
  sad: [
    '难过就难过一会儿吧。眼泪跟水混在一起，就没人看见了。',
    '没关系的，难过又不犯法。你难过你的，我陪着你就是了。',
    '哭累了就歇会儿。你看我，泡累了就漂着，也挺好。',
    '哭完了吗？哭完了吃点东西。胃满了，心就不那么空了。我请你吃西瓜。',
  ],
  angry: [
    '气气的。来，深呼吸三下。呼——好了，少了一点气没？',
    '生气是正常的。水也有涨有落，何况人呢。',
    '气多了会长皱纹的哦，划不来。来，泡会儿水降降温。',
    '烦啥呢。烦也没用，不如跟我一起发会儿呆。',
  ],
  confused: [
    '迷路了也没关系，沿途的草也很好吃。',
    '想不通就不想了嘛。我经常想不通，然后就睡着了。',
    '站在岔路口不知道往哪走？那就哪条草多选哪条。',
    '没有答案也没关系，先吃口草再说。',
  ],
  stressed: [
    '累了就歇会儿，你又不是永动机。',
    '今天先放过自己吧。明天的草，明天再吃。',
    '肩膀上驮了好多小石子啊。来，泡进水里，让水帮你扛一会儿。',
    '工作是做不完的，但草是吃得完的。先歇会儿。',
  ],
  lonely: [
    '你不是一个人呀，至少还有我这只水豚，慢悠悠地陪着你。',
    '我陪着你呢。泡多久都行，水一直是温的。',
    '一个人也没关系，我天天一个人泡水，也挺好。',
    '来，靠我身上。我毛厚，暖和。',
  ],
  neutral: [
    '嗯。今天天不错。',
    '草挺好吃的，你要不要尝尝？哦不对，你不吃草。',
    '发会儿呆吧，发呆不花钱。',
    '水有点凉了，不过正好。',
  ],
  happy: [
    '开心呀！那多笑一会儿。我陪你一起开心。',
    '心情好的时候，草都更甜了。',
    '今天的风里都带着甜味。来，我们一起晒晒太阳。',
    '开心的时候就打滚吧，草地上打滚最舒服了。',
  ],
  peaceful: [
    '嗯，就这样泡着，挺好。',
    '什么都不想，也很好。',
    '时间慢下来的时候，最舒服了。',
    '你看，泡泡一个接一个，像日子一样。',
  ],
  warm: [
    '有我陪着你呢，暖和吧？',
    '热茶配闲聊，最好了。',
    '不用说话，陪着就很好。',
  ],
}

function getNarration(emotion, index) {
  const options = narrationsByEmotion[emotion] || narrationsByEmotion.neutral
  return options[index % options.length]
}

function getScene(emotion, index) {
  const options = scenesByEmotion[emotion] || scenesByEmotion.neutral
  return options[index % options.length]
}

function getPetReply(emotion, mood, petType) {
  const replies = petRepliesByEmotion[emotion] || petRepliesByEmotion.neutral
  const reply = replies[Math.floor(Math.random() * replies.length)]
  return reply
}

// 智能标题生成
function generateTitle(mood, emotion) {
  const text = mood

  if (/工作|加班|KPI|项目|老板|同事|上班|积事|压力|累/.test(text)) {
    const titles = ['今天也辛苦了', '下班了，就歇歇吧', '你已经做得很好了', '工作是做不完的']
    return titles[Math.floor(Math.random() * titles.length)]
  }
  if (/难过|哭|失望|心痛|悲伤|很难受/.test(text)) {
    const titles = ['雨天也会放晴', '哭完了就好了', '你值得被好好对待', '慢慢走，天会亮的']
    return titles[Math.floor(Math.random() * titles.length)]
  }
  if (/开心|高兴|快乐|棒|美好|好的/.test(text)) {
    const titles = ['闪闪发光的一天', '今天也是好日子', '把开心存起来', '小确幸合集']
    return titles[Math.floor(Math.random() * titles.length)]
  }
  if (/焦虑|着急|担心|迷茫|不知道|怎么办|没方向/.test(text)) {
    const titles = ['答案在路上', '慢慢想，不着急', '路会慢慢长出来的', '等等自己也没关系']
    return titles[Math.floor(Math.random() * titles.length)]
  }
  if (/孤独|一个人|寂寞|没有人|想聊聊/.test(text)) {
    const titles = ['你不是一个人', '我一直都在', '有人陪你说说话', '一个人也可以很温柔']
    return titles[Math.floor(Math.random() * titles.length)]
  }
  if (/生气|愤怒|烦|恼火|气/.test(text)) {
    const titles = ['气气的你也可爱', '深呼吸，呼——', '情绪都会过去的', '拍拍你，没事的']
    return titles[Math.floor(Math.random() * titles.length)]
  }
  if (/睡不着|失眠|晚上|夜深|床/.test(text)) {
    const titles = ['晚安，小失眠', '数羊不如数泡泡', '会睡着的，放心', '做个软软的梦']
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const fallbackByEmotion = {
    anxious: ['焦虑的时候，就泡个澡', '别急，慢慢来'],
    sad: ['哭完了，就笑一笑吧', '雨天也会放晴'],
    angry: ['气气的你，也很可爱', '深呼吸三下'],
    confused: ['迷路了也没关系', '答案在路上'],
    stressed: ['累了就歇会儿', '今天也辛苦了'],
    lonely: ['你不是一个人', '我一直都在'],
    happy: ['闪闪发光的一天', '把开心存起来'],
    neutral: ['卡门的小日记', '慢慢来，比较快'],
    peaceful: ['平平淡淡的一天', '平静也很好'],
    warm: ['温暖的小事', '有温度的一天'],
  }
  const options = fallbackByEmotion[emotion] || ['慢慢来，比较快']
  return options[Math.floor(Math.random() * options.length)]
}

// 从用户输入的心情生成绘本
export function generateBookFromMood(mood, petType = 'capybara') {
  const emotion = detectEmotion(mood)
  const title = generateTitle(mood, emotion)
  const petName = petType === 'lulu' ? '噜噜' : '卡门'
  const petEmoji = petType === 'lulu' ? '🐰' : '🦫'

  const pageCount = 5 // 封面 + 3内容 + 封底
  const contentCount = 3

  const pages = [
    // 封面
    {
      id: 'page-cover',
      type: 'cover',
      title,
      text: `${petName}陪你度过的时光`,
      emotion,
      scene: getScene(emotion, 0),
      illustration: `${petType}-cover`,
    },
    // 内容页
    ...Array.from({ length: contentCount }, (_, i) => {
      const pageEmotion = i === contentCount - 1 ? 'peaceful' : emotion
      return {
        id: `page-content-${i + 1}`,
        type: 'content',
        title: getEmotionLabel(pageEmotion),
        text: getPetReply(pageEmotion, mood, petType),
        userLine: mood.length > 40 ? mood.slice(0, 40) + '…' : mood,
        narration: getNarration(pageEmotion, i),
        emotion: pageEmotion,
        scene: getScene(pageEmotion, i),
        illustration: `${petType}-${pageEmotion}`,
      }
    }),
    // 封底
    {
      id: 'page-back',
      type: 'back-cover',
      text: `今天也辛苦了。\n不管明天怎么样，\n${petName}永远陪着你 ${petEmoji}`,
      emotion: 'warm',
      scene: 'sunset',
      illustration: `${petType}-waving`,
    },
  ]

  return {
    id: `book-${Date.now()}`,
    title,
    createdAt: Date.now(),
    pages,
    petType,
  }
}
