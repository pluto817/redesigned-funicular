// 绘本数据统一管理（localStorage 持久化）
import { generateBookFromMood } from './book-generator.js'

const STORAGE_KEY = 'slow_island_books'

// 默认示例绘本（使用新数据结构：含 scene/narration/userLine）
const DEFAULT_BOOKS = [
  {
    id: '1',
    title: '慢慢来，比较快',
    petType: 'capybara',
    createdAt: Date.now() - 86400000 * 2,
    pages: [
      { id: 'p1', type: 'cover', title: '慢慢来，比较快', text: '卡门陪你度过的时光', emotion: 'neutral', scene: 'grass', illustration: 'capybara-cover' },
      { id: 'p2', type: 'content', title: '焦虑', text: '焦虑就焦虑吧，我被鸟啄的时候也慌。后来鸟飞走了，我还在水里。', userLine: '今天有点焦虑，事情好多做不完…', narration: '这一天，心里的小鼓又咚咚敲了起来。', emotion: 'anxious', scene: 'onsen', illustration: 'capybara-anxious' },
      { id: 'p3', type: 'content', title: '平静', text: '来，泡进水里。世界就安静了。', userLine: '', narration: '卡门说，不如先停下来，喝口水。', emotion: 'peaceful', scene: 'onsen', illustration: 'capybara-peaceful' },
      { id: 'p4', type: 'back-cover', text: '今天也辛苦了。\n不管明天怎么样，\n卡门永远陪着你 🦫', emotion: 'warm', scene: 'sunset', illustration: 'capybara-waving' },
    ],
  },
  {
    id: '2',
    title: '噜噜的花园冒险',
    petType: 'lulu',
    createdAt: Date.now() - 86400000,
    pages: [
      { id: 'l1', type: 'cover', title: '噜噜的花园冒险', text: '噜噜陪你度过的时光', emotion: 'happy', scene: 'grass', illustration: 'lulu-cover' },
      { id: 'l2', type: 'content', title: '开心', text: '开心呀！那多笑一会儿。我陪你一起开心。', userLine: '今天发现了一朵特别的花！', narration: '今天的风里都带着甜甜的味道。', emotion: 'happy', scene: 'grass', illustration: 'lulu-happy' },
      { id: 'l3', type: 'content', title: '平和', text: '心情好的时候，草都更甜了。', userLine: '', narration: '卡门啃着西瓜，笑眯眯地看着你。', emotion: 'peaceful', scene: 'watermelon', illustration: 'lulu-peaceful' },
      { id: 'l4', type: 'back-cover', text: '今天也辛苦了。\n不管明天怎么样，\n噜噜永远陪着你 🐰', emotion: 'warm', scene: 'sunset', illustration: 'lulu-waving' },
    ],
  },
]

export function getBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const books = JSON.parse(raw)
      // 数据迁移：如果第一本绘本的页面没有 scene 字段，说明是旧格式，重置为新默认数据
      if (books.length > 0 && books[0].pages && !books[0].pages[0].scene) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS))
        return DEFAULT_BOOKS
      }
      return books
    }
  } catch (e) {
    console.error('读取绘本失败', e)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS))
  return DEFAULT_BOOKS
}

export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export function getBookById(id) {
  const books = getBooks()
  return books.find((b) => b.id === id) || null
}

export function createBook(mood, petType) {
  const newBook = generateBookFromMood(mood, petType)
  const books = getBooks()
  books.unshift(newBook)
  saveBooks(books)
  return newBook
}

export function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id)
  saveBooks(books)
}
