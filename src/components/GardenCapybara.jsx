import './GardenCapybara.css'

// 花园场景的卡皮巴拉（躺着晒太阳）
// clickCount: 点击次数，用于轻微互动
// relaxStage: 0 | 1 | 2 —— 放松阶段，stage 2 呼吸更慢
export default function GardenCapybara({ clickCount = 0, relaxStage = 0 }) {
  return (
    <div className={`garden-capy garden-capy--click-${clickCount % 3} garden-capy--stage-${relaxStage}`}>
      <div className="garden-capy__body">
        {/* 耳朵 */}
        <span className="garden-capy__ear ear-l" />
        <span className="garden-capy__ear ear-r" />
        {/* 眼睛 */}
        <span className="garden-capy__eye eye-l" />
        <span className="garden-capy__eye eye-r" />
        {/* 鼻子 */}
        <span className="garden-capy__nose" />
      </div>
    </div>
  )
}
