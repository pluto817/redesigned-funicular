import { useRef, useState, useEffect } from 'react'
import './BooksBgm.css'

export default function BooksBgm() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.5
    const tryPlay = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
    tryPlay()
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/books-bgm.mp3" loop preload="auto" />
      <button
        className={`books-music ${playing ? 'books-music--on' : ''}`}
        onClick={toggleMusic}
        aria-label={playing ? '暂停音乐' : '播放音乐'}
      >
        {playing ? '🎵' : '🔇'}
      </button>
    </>
  )
}
