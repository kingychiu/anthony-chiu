import { useState, useEffect, useRef } from 'react'

const DATABASE = [
  { key: 'Anthony', value: 1000 },
  { key: 'Tom', value: 2000 },
  { key: 'Tony', value: 3000 },
]

function computeScores(query) {
  if (!query.trim()) return DATABASE.map(() => 0)
  const q = query.toLowerCase()
  const raw = DATABASE.map((r) => {
    const k = r.key.toLowerCase()
    if (k === q) return 10
    if (k.startsWith(q)) return 8
    if (k.includes(q)) return 5
    let overlap = 0
    for (let i = 0; i < Math.min(q.length, k.length); i++) {
      if (q[i] === k[i]) overlap++
      else break
    }
    return overlap
  })
  const sum = raw.reduce((a, b) => a + b, 0)
  if (sum === 0) return DATABASE.map(() => 0)
  return raw.map((r) => r / sum)
}

function AnimatedNumber({ value, prefix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)
  const startRef = useRef(display)
  const startTimeRef = useRef(null)

  useEffect(() => {
    startRef.current = display
    startTimeRef.current = performance.now()
    const duration = 400

    const animate = (now) => {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(startRef.current + (value - startRef.current) * eased)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
    </span>
  )
}

export default function FuzzyMatchRetrieval() {
  const [query, setQuery] = useState('An')
  const scores = computeScores(query)
  const weightedSum = DATABASE.reduce((sum, r, i) => sum + r.value * scores[i], 0)
  const hasScores = scores.some((s) => s > 0)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Retrieval System UI */}
        <div
          style={{
            border: '2px solid #888',
            borderRadius: '8px',
            padding: '16px 20px',
            minWidth: '220px',
            background: 'var(--retrieval-bg, #fafafa)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#666',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            Retrieval System UI
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Query-Person</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '6px',
                background: 'white',
                padding: '4px 8px',
              }}
            >
              <span style={{ color: '#999', marginRight: '6px' }}>🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a name..."
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  width: '100%',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
              Output-Income
            </div>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: 'white',
                fontSize: '18px',
                fontWeight: 700,
                color: hasScores ? '#4f46e5' : '#999',
                transition: 'color 0.3s',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {hasScores ? <AnimatedNumber value={weightedSum} prefix="$" decimals={0} /> : '—'}
            </div>
          </div>

          {/* Weighted sum breakdown */}
          {hasScores && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px',
                background: '#f0f0ff',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4f46e5',
                lineHeight: 1.6,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>Weighted Sum:</div>
              {DATABASE.map((r, i) =>
                scores[i] > 0 ? (
                  <div key={r.key}>
                    ${r.value} × {scores[i].toFixed(2)} = ${(r.value * scores[i]).toFixed(0)}
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Score arrows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            gap: '0px',
            minWidth: '100px',
          }}
        >
          <svg width="100" height="120" viewBox="0 0 100 120">
            {DATABASE.map((r, i) => {
              const y = 20 + i * 40
              const score = scores[i]
              const opacity = Math.max(0.15, score)
              const strokeWidth = 1 + score * 3
              return (
                <g key={r.key}>
                  <defs>
                    <marker
                      id={`arrowFuzzy${i}`}
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L8,3 L0,6" fill="#4f46e5" opacity={opacity} />
                    </marker>
                  </defs>
                  <line
                    x1="5"
                    y1={60}
                    x2="60"
                    y2={y}
                    stroke="#4f46e5"
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    markerEnd={`url(#arrowFuzzy${i})`}
                    style={{ transition: 'all 0.3s' }}
                  />
                  <text
                    x="68"
                    y={y + 4}
                    fontSize="11"
                    fill="#4f46e5"
                    opacity={Math.max(0.3, score)}
                    style={{ transition: 'opacity 0.3s' }}
                  >
                    {score.toFixed(2)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Database */}
        <div style={{ minWidth: '200px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#666',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            Personal Income Database
          </div>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr style={{ background: '#6b7280', color: 'white' }}>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Key-Person</th>
                <th style={{ padding: '8px 16px', textAlign: 'right' }}>Value-Income</th>
              </tr>
            </thead>
            <tbody>
              {DATABASE.map((r, i) => {
                const score = scores[i]
                const bgAlpha = Math.round(score * 40)
                return (
                  <tr
                    key={r.key}
                    style={{
                      background:
                        score > 0
                          ? `rgba(79, 70, 229, ${bgAlpha / 255})`
                          : i % 2 === 0
                          ? '#f9fafb'
                          : 'white',
                      transition: 'background 0.3s',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <td style={{ padding: '8px 16px' }}>{r.key}</td>
                    <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                      ${r.value.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Score bar visualization */}
          <div style={{ marginTop: '12px' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              Compatibility Scores
            </div>
            {DATABASE.map((r, i) => (
              <div
                key={r.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '12px', width: '60px', color: '#666' }}>{r.key}</span>
                <div
                  style={{
                    flex: 1,
                    height: '16px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${scores[i] * 100}%`,
                      background: '#4f46e5',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease-out',
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#888', width: '32px' }}>
                  {scores[i].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
