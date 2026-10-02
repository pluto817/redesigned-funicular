import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GrasslandBgm from './GrasslandBgm.jsx'
import './StationPage.css'

export default function BridgePage() {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const timerRef = useRef(null)
  const lastTsRef = useRef(null)

  const SUGGESTED = 600 // 10分钟

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const progress = Math.min((elapsed / SUGGESTED) * 100, 100)

  const toggleTimer = () => {
    if (!running) {
      setRunning(true)
      setPaused(false)
      lastTsRef.current = Date.now()
      timerRef.current = setInterval(() => {
        if (paused) {
          lastTsRef.current = Date.now()
          return
        }
        const now = Date.now()
        setElapsed(prev => prev + Math.floor((now - lastTsRef.current) / 1000))
        lastTsRef.current = now
      }, 1000)
    } else {
      completeTask()
    }
  }

  const togglePause = () => {
    if (!running) return
    setPaused(p => !p)
    if (paused) {
      lastTsRef.current = Date.now()
    }
  }

  const completeTask = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    localStorage.setItem('bridge_done', '1')
    localStorage.setItem('bridge_time', elapsed)
    setRunning(false)
    alert('🌉 打卡成功！今天的散步完成啦～')
    navigate('/grassland')
  }

  const goBack = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    navigate('/grassland')
  }

  // Three.js 3D模型
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const box = containerRef.current
    const w = box.offsetWidth || 260
    const h = box.offsetHeight || 350

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.set(0, 0.6, 4.0)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    scene.add(new THREE.AmbientLight(0xffffff, 1.6))
    const dirLight = new THREE.DirectionalLight(0xfff5e0, 2.2)
    dirLight.position.set(3, 5, 3)
    scene.add(dirLight)
    scene.add(new THREE.DirectionalLight(0xe0f0ff, 1.0))

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = false
    controls.target.set(0, 0.3, 0)
    controls.enableZoom = true
    controls.minDistance = 2
    controls.maxDistance = 10

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      '/grassland/lulu3d.glb',
      (gltf) => {
        const model = gltf.scene
        const box3 = new THREE.Box3().setFromObject(model)
        const center = box3.getCenter(new THREE.Vector3())
        const size = box3.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.2 / maxDim

        model.scale.set(scale, scale, scale)
        model.position.set(0, -center.y * scale + 0.5, 0)
        model.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true
            c.receiveShadow = true
          }
        })
        scene.add(model)
      },
      undefined,
      (err) => console.error('模型加载失败:', err)
    )

    const handleResize = () => {
      const rw = box.offsetWidth || 260
      const rh = box.offsetHeight || 350
      camera.aspect = rw / rh
      camera.updateProjectionMatrix()
      renderer.setSize(rw, rh)
    }
    window.addEventListener('resize', handleResize)

    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
    }
  }, [])

  // 背景粒子和桃花
  useEffect(() => {
    // 桃花飘落
    const peachContainer = document.getElementById('peach-blossoms')
    if (peachContainer) {
      peachContainer.innerHTML = ''
      for (let i = 0; i < 30; i++) {
        const b = document.createElement('div')
        b.className = 'blossom'
        const size = 8 + Math.random() * 10
        b.style.width = size + 'px'
        b.style.height = size + 'px'
        b.style.left = Math.random() * 100 + '%'
        b.style.top = -20 + 'px'
        b.style.animationDuration = (6 + Math.random() * 10) + 's'
        b.style.animationDelay = Math.random() * 8 + 's'
        b.style.opacity = 0.5 + Math.random() * 0.4
        peachContainer.appendChild(b)
      }
    }

    // 背景漂浮粒子
    const bgParticles = document.getElementById('bridge-bg-particles')
    if (bgParticles) {
      bgParticles.innerHTML = ''
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div')
        p.className = 'bg-particle'
        const size = 2 + Math.random() * 6
        p.style.width = size + 'px'
        p.style.height = size + 'px'
        p.style.left = Math.random() * 100 + '%'
        p.style.top = Math.random() * 100 + '%'
        p.style.animationDuration = (8 + Math.random() * 12) + 's'
        p.style.animationDelay = Math.random() * 5 + 's'
        bgParticles.appendChild(p)
      }
    }

    // 视差效果
    const handleMouseMove = (e) => {
      const bg = document.querySelector('.bridge-page')
      if (!bg) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      bg.style.backgroundPosition = `${50 + x * 3}% ${50 + y * 2}%`
    }
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="station-page bridge-page">
      <div className="bg-particles" id="bridge-bg-particles" />
      <div className="peach-blossoms" id="peach-blossoms" />
      <button className="back-btn" onClick={goBack}>← 下次再去</button>
      <GrasslandBgm />

      <div className="char-3d-container" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>

      <div className="corner-bubble">桥那边，有不一样的风哦～</div>

      <div className="bridge-layout">
        <div className="top-bubble">
          <h3>🏃 今日木桥挑战</h3>
          <p>出门走到桥的那头，看看风经过的地方</p>
          <div className="bubble-tags">⏱ 建议10分钟 | 轻散步 | 不赶路</div>
        </div>

        <div className="main-card">
          <h2>陪我走过一座小桥</h2>
          <div className="timer-big">{formatTime(elapsed)}</div>
          <div className="timer-bar">
            <div className="timer-progress" style={{ width: `${progress}%` }} />
          </div>
          <div className="footprint">👣 已陪伴 {formatTime(elapsed)}</div>
          <div className="mood-tags">
            <span className="mood-tag">🍃 听风声</span>
            <span className="mood-tag">💧 看水面</span>
            <span className="mood-tag">🍃 慢慢走</span>
          </div>
          <div className="card-btns">
            <button
              className="btn-go"
              style={{ background: running ? '#7ab8c9' : '#e8a05c' }}
              onClick={toggleTimer}
            >
              {running ? '完成打卡' : '出发走走'}
            </button>
            <button
              className="btn-pause"
              onClick={togglePause}
              disabled={!running}
            >
              {paused ? '继续走' : '暂停一下'}
            </button>
            <button className="soft-btn btn-secondary" onClick={goBack}>
              下次再去
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
