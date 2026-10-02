import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import './StationPage.css'

const tasks = [
  {
    title: '🔍 街角寻宝',
    desc: '挑一家路过的小店，像探险家一样打量它——门头是什么颜色？门口摆着什么有趣的小东西？有没有一张手写的小黑板？把最吸引你目光的那个细节记下来。',
    type: 'text',
    placeholder: '写下你发现的宝藏细节...',
  },
  {
    title: '☁️ 天空日记',
    desc: '抬起头，用镜头或文字收藏此刻的天空——是像棉花糖一样的云，还是漏下一束光的样子？风正往哪个方向吹？这些转瞬即逝的画面，只属于今天的你。',
    type: 'file',
  },
  {
    title: '💌 善意漂流',
    desc: '对今天遇到的人递出一句轻轻的问候，不用刻意，像一片落叶飘到肩头那样自然。一句"谢谢"或者"你的花真好看"，都可能成为对方一天里的小小温暖。',
    type: 'check',
  },
]

const replies = [
  '今天的你也有在认真生活呀✨',
  '即使是很小的出门，也是很棒的一步🌱',
  '谢谢你愿意和这个世界打个招呼💛',
  '你的每一天都值得被记住📖',
]

export default function ForestPage() {
  const navigate = useNavigate()
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [fileSelected, setFileSelected] = useState(false)
  const [fileName, setFileName] = useState('')
  const [textInput, setTextInput] = useState('')
  const [showTreehole, setShowTreehole] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [treeholeText, setTreeholeText] = useState('')
  const [showDone, setShowDone] = useState(false)
  const canvasRef = useRef(null)
  const modelBoxRef = useRef(null)

  const selectTask = (idx) => {
    setSelectedIdx(idx)
  }

  const canSubmit = () => {
    if (selectedIdx === null) return false
    if (selectedIdx === 0) return textInput.trim().length > 0
    if (selectedIdx === 1) return fileSelected
    if (selectedIdx === 2) return true
    return false
  }

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(true)
      setFileName('已选择：' + e.target.files[0].name)
    }
  }

  const completeTask = () => {
    localStorage.setItem('forest_done', '1')
    setShowDone(true)
  }

  const submitTreehole = () => {
    if (!treeholeText.trim()) {
      alert('写点什么再投递吧～')
      return
    }
    setShowTreehole(false)
    const r = replies[Math.floor(Math.random() * replies.length)]
    setReplyText(r)
    setShowReply(true)
    setTreeholeText('')
  }

  const goBack = () => {
    navigate('/grassland')
  }

  // Three.js 3D模型（河马）
  useEffect(() => {
    if (!canvasRef.current || !modelBoxRef.current) return

    const canvas = canvasRef.current
    const box = modelBoxRef.current
    const w = box.offsetWidth || 360
    const h = 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.set(1.5, 1.5, 6.0)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    scene.add(new THREE.AmbientLight(0xffffff, 1.5))
    const dirLight = new THREE.DirectionalLight(0xfff5e0, 2.0)
    dirLight.position.set(3, 5, 3)
    scene.add(dirLight)
    scene.add(new THREE.DirectionalLight(0xe0f0ff, 0.8))

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = false
    controls.target.set(-1.3, -0.2, 0)
    controls.enableZoom = true
    controls.minDistance = 2
    controls.maxDistance = 15

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      '/grassland/hippo3d.glb',
      (gltf) => {
        const model = gltf.scene
        const box3 = new THREE.Box3().setFromObject(model)
        const center = box3.getCenter(new THREE.Vector3())
        const size = box3.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.8 / maxDim

        model.scale.set(scale, scale, scale)
        model.position.set(-1.3, -center.y * scale - 0.3, 0)
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
      const rw = box.offsetWidth || 360
      camera.aspect = rw / h
      camera.updateProjectionMatrix()
      renderer.setSize(rw, h)
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

  // 绿叶飘落 + 视差
  useEffect(() => {
    const leavesContainer = document.getElementById('falling-leaves')
    if (leavesContainer) {
      leavesContainer.innerHTML = ''
      const colors = ['#8faa7a', '#9ab88a', '#a3c08a', '#8b9e6e', '#9ebf7a']
      const count = 10
      for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div')
        leaf.className = 'leaf'
        const size = 6 + Math.random() * 8
        leaf.style.width = size + 'px'
        leaf.style.height = size * 1.4 + 'px'
        leaf.style.left = Math.random() * 100 + '%'
        leaf.style.background = colors[Math.floor(Math.random() * colors.length)]
        leaf.style.animationDuration = (5 + Math.random() * 6) + 's'
        leaf.style.animationDelay = Math.random() * 8 + 's'
        leaf.style.transform = 'rotate(' + Math.random() * 360 + 'deg)'
        leavesContainer.appendChild(leaf)
      }
    }

    const handleMouseMove = (e) => {
      const bg = document.querySelector('.forest-page')
      if (!bg) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      bg.style.backgroundPosition = `${50 + x * 3}% ${50 + y * 2}%`
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="station-page forest-page">
      <div className="falling-leaves" id="falling-leaves" />
      <button className="back-btn" onClick={goBack}>← 先回去啦</button>
      <button className="treehole-btn" onClick={() => setShowTreehole(true)}>
        🌰 树洞邮筒
      </button>

      <div className="forest-container">
        <div className="forest-left">
          <div className="model-box" ref={modelBoxRef}>
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="forest-right">
          <div className="forest-header">
            <h2>🌰 橡果森林探索清单</h2>
            <p>选一件你今天想做的事，不必勉强，像散步一样轻松 · 建议探索30分钟</p>
          </div>

          <div className="task-list">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className={`task-card ${selectedIdx === idx ? 'selected' : ''}`}
                onClick={() => selectTask(idx)}
              >
                <div className="checkbox">{selectedIdx === idx ? '✓' : ''}</div>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.desc}</p>
                  <div className={`checkin-area ${selectedIdx === idx ? 'active' : ''}`}>
                    {task.type === 'text' && (
                      <input
                        className="checkin-input"
                        placeholder={task.placeholder}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {task.type === 'file' && (
                      <>
                        <button
                          className="soft-btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            document.getElementById('forest-file-input').click()
                          }}
                        >
                          📷 选择照片
                        </button>
                        <input
                          type="file"
                          className="file-input"
                          id="forest-file-input"
                          accept="image/*"
                          onChange={handleFile}
                        />
                        <div style={{ fontSize: '13px', color: '#8a7a6a' }}>
                          {fileName}
                        </div>
                      </>
                    )}
                    {task.type === 'check' && (
                      <div style={{ background: 'transparent', border: 'none', paddingLeft: 0, fontSize: '14px', color: '#8a7a6a' }}>
                        勾选即表示已完成 ✓
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="btn-group" style={{ justifyContent: 'center', marginTop: '8px' }}>
            <button
              className="soft-btn btn-primary"
              onClick={completeTask}
              disabled={!canSubmit()}
              style={{ opacity: canSubmit() ? 1 : 0.5, cursor: canSubmit() ? 'pointer' : 'not-allowed' }}
            >
              完成探索
            </button>
            <button className="soft-btn btn-secondary" onClick={goBack}>
              下次再去
            </button>
          </div>
        </div>
      </div>

      {/* 树洞弹窗 */}
      {showTreehole && (
        <div className="modal-overlay active" onClick={() => setShowTreehole(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>🌰 树洞邮筒</h3>
            <p>写下今天出门的心情或小事吧</p>
            <textarea
              rows="4"
              placeholder="今天发生了什么呢..."
              value={treeholeText}
              onChange={(e) => setTreeholeText(e.target.value)}
            />
            <div className="btn-group" style={{ marginTop: 0 }}>
              <button className="soft-btn btn-primary" onClick={submitTreehole}>
                投递
              </button>
              <button className="soft-btn btn-secondary" onClick={() => setShowTreehole(false)}>
                下次再说
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 树洞回复弹窗 */}
      {showReply && (
        <div className="modal-overlay active" onClick={() => setShowReply(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>💌 来自树洞的回信</h3>
            <p>{replyText}</p>
            <button className="soft-btn btn-primary" onClick={() => setShowReply(false)}>
              收下这份温暖
            </button>
          </div>
        </div>
      )}

      {/* 完成弹窗 */}
      {showDone && (
        <div className="modal-overlay active" onClick={() => setShowDone(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>🌰 探索完成</h3>
            <p>你今天又发现了新东西，真棒！</p>
            <button className="soft-btn btn-primary" onClick={goBack}>
              回地图看看
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
