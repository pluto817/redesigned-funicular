import './CabinCapybara.css'

// 小屋场景的卡皮巴拉（站着/坐着）
// phase: 'entering' | 'idle' | 'sitting'
export default function CabinCapybara({ phase = 'idle' }) {
  const animClass =
    phase === 'entering'
      ? 'capy-cabin--entering'
      : phase === 'sitting'
        ? 'capy-cabin--sitting'
        : 'capy-cabin--idle'

  return (
    <div className={`capy-cabin ${animClass}`}>
      <div className="capy-cabin__body">
        {/* 耳朵 */}
        <span className="capy-cabin__ear ear-l" />
        <span className="capy-cabin__ear ear-r" />
        {/* 眼睛 */}
        <span className="capy-cabin__eye eye-l" />
        <span className="capy-cabin__eye eye-r" />
        {/* 鼻子 */}
        <span className="capy-cabin__nose" />
      </div>
    </div>
  )
}
