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
          color: 'rgba(90,70,40,0.5)', fontSize: '14px'
        }}>
          🦫 卡皮巴拉
        </div>
      )
    }
    return this.props.children
  }
}

function GardenModel({ controlsRef, action = null, sunStage = 1 }) {
  const { scene } = useGLTF('/assets/models/garden-bear.glb')
  const groupRef = useRef()
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (!groupRef.current) return

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    scene.position.sub(center)

    const maxDim = Math.max(size.x, size.y, size.z)

    // 材质提亮（户外明亮光）
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
          if (m.color) m.color.multiplyScalar(1.4)
          if ('envMapIntensity' in m) m.envMapIntensity = 1.0
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

  // 晒太阳的慵懒呼吸浮动 + 动作
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    if (action === 'stretch') {
      // 伸懒腰：向上拉伸
      const s = 1 + Math.sin(t * 4) * 0.04
      groupRef.current.scale.set(s, s * 1.06, s)
      groupRef.current.position.y = 0.05 + Math.sin(t * 4) * 0.02
    } else if (action === 'drink') {
      // 喝饮料：轻微前倾低头
      groupRef.current.rotation.x = Math.sin(t * 5) * 0.12
      groupRef.current.position.y = -0.02
      groupRef.current.scale.setScalar(1)
    } else if (action === 'doze') {
      // 打瞌睡：缓慢下沉 + 呼吸变缓
      const cycle = (Math.sin(t * 0.4) + 1) / 2
      groupRef.current.position.y = -0.06 + cycle * 0.015
      groupRef.current.scale.setScalar(0.97 + cycle * 0.02)
      groupRef.current.rotation.x = 0.08
    } else {
      // 正常慵懒呼吸
      const cycle = (Math.sin(t * 0.7) + 1) / 2
      groupRef.current.position.y = cycle * 0.04 - 0.015
      const breath = 0.98 + cycle * 0.05
      groupRef.current.scale.setScalar(breath)
      groupRef.current.rotation.x = 0
    }
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

export default function GardenCapybara3D({ action = null, sunStage = 1 }) {
  const controlsRef = useRef()

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [3, 1.5, 3], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        {/* 户外明亮日光 */}
        <ambientLight intensity={2.2} color="#fff8e8" />
        <directionalLight position={[2, 5, 3]} intensity={2.5} color="#fff4d0" />
        <directionalLight position={[-3, 2, 1]} intensity={1.2} color="#a0d0ff" />
        <directionalLight position={[0, 1, -4]} intensity={1.0} color="#ffe8c0" />
        <directionalLight position={[0, 3, 0]} intensity={0.8} color="#ffffff" />
        <hemisphereLight args={['#bfe0ff', '#90c878', 1.2]} />

        <Suspense fallback={<Loader />}>
          <GardenModel controlsRef={controlsRef} action={action} sunStage={sunStage} />
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
          opacity={0.12}
          scale={5}
          blur={4}
          far={3}
          color="#6a7a4a"
        />
      </Canvas>
    </ErrorBoundary>
  )
}

useGLTF.preload('/assets/models/garden-bear.glb')
