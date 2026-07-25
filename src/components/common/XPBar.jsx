export default function XPBar({
  currentXP = 0,
  maxXP = 1000,
  level = 1,
  rank = 'Script Kiddie',
  className = '',
}) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-xs text-cyber-green">
          LVL {level}
        </span>
        <span className="font-mono text-xs text-cyber-cyan">
          {rank}
        </span>
        <span className="font-mono text-xs text-cyber-yellow">
          {currentXP} / {maxXP} XP
        </span>
      </div>
      <div className="w-full h-2.5 bg-cyber-dark rounded-full overflow-hidden border border-cyber-border">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #00ff66, #00e5ff, #9d00ff)',
            boxShadow: '0 0 10px rgba(0, 255, 102, 0.5)',
          }}
        />
      </div>
    </div>
  )
}