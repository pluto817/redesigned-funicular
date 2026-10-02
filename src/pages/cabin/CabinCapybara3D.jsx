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
          🐱 卡通角色
        </div>
      )
    }
    return this.props.children
  }
}

// 加载模型 + 自动居中 + 调整相机
function CabinModel({ controlsRef, state = 'idle', idleAction = null }) {
  const { scene } = useGLTF('/assets/models/cabin-new.glb')
  const groupRef = useRef()
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (!groupRef.current) return

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    scene.position.sub(center)

    const maxDim = Math.max(size.x, size.y, size.z)

    // 材质提亮
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
          if (m.color) m.color.multiplyScalar(1.25)
          if ('envMapIntensity' in m) m.envMapIntensity = 1.1
          if ('roughness' in m) m.roughness = Math.min(m.roughness, 0.85)
        })
      }
    })

    // 3/4 朝向
    groupRef.current.rotation.y = Math.PI + Math.PI * 0.14

    const distance = maxDim * 2.4
    camera.position.set(distance * 0.65, maxDim * 0.45, distance * 0.75)
    camera.lookAt(0, -maxDim * 0.05, 0)

    if (controlsRef.current) {
      controlsRef.current.target.set(0, -maxDim * 0.05, 0)
      controlsRef.current.update()
    }
  }, [scene, camera, controlsRef])

  // 呼吸浮动 + 状态驱动动画
  useFrame((stateClock) => {
    if (!groupRef.current) return
    const t = stateClock.clock.getElapsedTime()

    // 不同状态的呼吸参数
    let breathSpeed = 0.9
    let breathAmp = 0.06    // 缩放幅度
    let floatAmp = 0.05     // 上下浮动
    let baseY = -0.02
    let leanX = 0           // 前倾
    let turnY = Math.PI + Math.PI * 0.14  // 基础朝向

    if (state === 'resting') {
      breathSpeed = 0.5
      breathAmp = 0.04
      floatAmp = 0.02
      baseY = -0.05
    } else if (state === 'cheerful') {
      breathSpeed = 1.2
      breathAmp = 0.08
      floatAmp = 0.07
    } else if (state === 'listening') {
      breathSpeed = 0.7
      leanX = -0.06  // 微微前倾
    } else if (state === 'comforting') {
      breathSpeed = 0.6
      floatAmp = 0.03
    } else if (state === 'eating') {
      // 咀嚼：快速小幅上下
      const chew = Math.sin(t * 6) * 0.015
      groupRef.current.position.y = baseY + chew
      groupRef.current.scale.setScalar(1)
      groupRef.current.rotation.x = chew * 0.3
      return
    }

    // idle 特殊动作
    if (idleAction === 'look_out') {
      turnY = Math.PI + Math.PI * 0.14 + Math.sin(t * 0.8) * 0.3
    }

    const cycle = (Math.sin(t * breathSpeed) + 1) / 2
    groupRef.current.position.y = baseY + cycle * floatAmp
    groupRef.current.scale.setScalar(1 - breathAmp / 2 + cycle * breathAmp)
    groupRef.current.rotation.x = leanX
    groupRef.current.rotation.y = turnY
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

export default function CabinCapybara3D({ state = 'idle', idleAction = null }) {
  const controlsRef = useRef()

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [3, 1.5, 3], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        {/* 小屋暖光环境 */}
        <ambientLight intensity={1.6} color="#fff0d8" />
        <directionalLight position={[0, 3, 5]} intensity={2.0} color="#ffe0a0" />
        <directionalLight position={[-4, 2, 2]} intensity={1.1} color="#ffb870" />
        <directionalLight position={[4, 1, 2]} intensity={0.9} color="#ffcc88" />
        <pointLight position={[0, 5, 0]} intensity={0.9} color="#fff0c0" distance={10} />
        <hemisphereLight args={['#fff0d0', '#5a4a30', 0.7]} />

        <Suspense fallback={<Loader />}>
          <CabinModel controlsRef={controlsRef} state={state} idleAction={idleAction} />
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

        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.18}
          scale={5}
          blur={4}
          far={3}
          color="#4a3a20"
        />
      </Canvas>
    </ErrorBoundary>
  )
}

useGLTF.preload('/assets/models/cabin-new.glb')
