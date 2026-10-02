import { useRef, Suspense, Component, useLayoutEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// 错误边界
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,245,220,0.6)', fontSize: '14px'
        }}>
          🦫 卡皮巴拉
        </div>
      )
    }
    return this.props.children
  }
}

// 加载模型 + 自动居中 + 调整相机
// breathPhase: 'in' | 'hold' | 'out' | null —— 呼吸引导阶段
function CapybaraModel({ controlsRef, breathPhase = null }) {
  const { scene } = useGLTF('/assets/models/capybara.glb')
  const groupRef = useRef()
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (!groupRef.current) return

    // 计算模型 bounding box
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // 把模型居中到原点
    scene.position.sub(center)

    // 模型最大尺寸
    const maxDim = Math.max(size.x, size.y, size.z)

    // 遍历材质，提亮、去除过黑
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
          // 提亮材质
          if (m.color) m.color.multiplyScalar(1.3)
          // 提高环境光响应，避免死黑
          if ('envMapIntensity' in m) m.envMapIntensity = 1.2
          if ('roughness' in m) m.roughness = Math.min(m.roughness, 0.85)
        })
      }
    })

    // 3/4 朝向
    groupRef.current.rotation.y = Math.PI + Math.PI * 0.14

    // 相机
    const distance = maxDim * 2.4
    camera.position.set(distance * 0.65, maxDim * 0.45, distance * 0.75)
    camera.lookAt(0, -maxDim * 0.05, 0)

    if (controlsRef.current) {
      controlsRef.current.target.set(0, -maxDim * 0.05, 0)
      controlsRef.current.update()
    }
  }, [scene, camera, controlsRef])

  // 呼吸 + 浮动动画：吸气放大上浮，呼气缩小下沉
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // 缓慢呼吸曲线，周期约 6 秒
    const cycle = (Math.sin(t * 1.0) + 1) / 2 // 0~1
    // 浮动：吸气（cycle→1）上升，呼气（cycle→0）下沉
    groupRef.current.position.y = cycle * 0.06 - 0.02
    // 呼吸缩放：吸气变大，呼气变小
    const breath = 0.96 + cycle * 0.08 // 0.96 ~ 1.04
    groupRef.current.scale.setScalar(breath)
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#c09060" wireframe />
    </mesh>
  )
}

export default function Capybara3D({ breathPhase = null }) {
  const controlsRef = useRef()

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [3, 1.5, 3], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        {/* 强环境光，避免模型死黑 */}
        <ambientLight intensity={1.8} color="#fff5e0" />
        {/* 主光：正面暖黄高光 */}
        <directionalLight position={[0, 3, 5]} intensity={2.2} color="#ffe8b0" />
        {/* 左补光 */}
        <directionalLight position={[-4, 2, 2]} intensity={1.2} color="#ffc080" />
        {/* 右补光 */}
        <directionalLight position={[4, 1, 2]} intensity={1.0} color="#ffd090" />
        {/* 顶部柔光 */}
        <pointLight position={[0, 5, 0]} intensity={1.0} color="#fff0c0" distance={10} />
        {/* 半球光：天空暖 + 地面暗 */}
        <hemisphereLight args={['#fff0d0', '#5a4a30', 0.8]} />

        <Suspense fallback={<Loader />}>
          <CapybaraModel controlsRef={controlsRef} breathPhase={breathPhase} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableRotate
          enableZoom
          enablePan
          minDistance={1.2}
          maxDistance={8}
          maxPolarAngle={Math.PI * 0.82}
          minPolarAngle={Math.PI * 0.15}
          enableDamping
          dampingFactor={0.08}
        />

        {/* 极淡阴影，避免底部过黑 */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.15}
          scale={5}
          blur={4}
          far={3}
          color="#4a3a20"
        />
      </Canvas>
    </ErrorBoundary>
  )
}

useGLTF.preload('/assets/models/capybara.glb')
