import './Capybara.css'

// 卡皮巴拉组件（CSS 绘制）
// phase: 'entering' | 'ready' | 'breathing' | 'complete' | 'good' | 'stay'
// breathPhase: 'in' | 'hold' | 'out' —— 呼吸阶段（仅 breathing 时有值）
export default function Capybara({ phase, breathPhase = null }) {
  // 决定卡皮巴拉的动画 class
  const animClass =
    phase === 'entering'
      ? 'capybara--entering'
      : phase === 'breathing'
        ? `capybara--breathing capybara--breath-${breathPhase}`
        : 'capybara--resting'

  return (
    <div className={`capybara ${animClass}`}>
      <div className="capy-body">
        <div className="capy-head">
          <span className="capy-ear ear-l" />
          <span className="capy-ear ear-r" />
          <span className="capy-eye eye-l" />
          <span className="capy-eye eye-r" />
          <span className="capy-nose" />
        </div>
      </div>
    </div>
  )
}
