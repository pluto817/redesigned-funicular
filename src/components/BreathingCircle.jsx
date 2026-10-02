import './BreathingCircle.css'

// 呼吸圆环
// phase: 'in' | 'hold' | 'out'
// round: 当前轮次 1-3
export default function BreathingCircle({ phase, round }) {
  const textMap = { in: '吸气', hold: '停一下', out: '呼气' }

  return (
    <div className="breath-guide">
      <div className={`breath-circle breath-${phase}`} />
      <p className="breath-text">{textMap[phase]}</p>
      <p className="breath-round">第 {round} / 3 轮</p>
    </div>
  )
}
