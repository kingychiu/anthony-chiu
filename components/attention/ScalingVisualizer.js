import { useState, useMemo } from 'react'

function softmax(values) {
  const max = Math.max(...values)
  const exps = values.map((v) => Math.exp(v - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

function randomDotProducts(dk, seed) {
  const rng = mulberry32(seed)
  const scores = []
  for (let i = 0; i < 5; i++) {
    let dot = 0
    for (let j = 0; j < dk; j++) {
      const q = (rng() - 0.5) * 2
      const k = (rng() - 0.5) * 2
      dot += q * k
    }
    scores.push(dot)
  }
  return scores
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    var t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const WORDS = ['i', 'like', 'to', 'eat', 'apple']

export default function ScalingVisualizer() {
  const [dk, setDk] = useState(64)
  const [useScaling, setUseScaling] = useState(false)

  const rawScores = useMemo(() => randomDotProducts(dk, 42), [dk])
  const scaledScores = useMemo(
    () => (useScaling ? rawScores.map((s) => s / Math.sqrt(dk)) : rawScores),
    [rawScores, dk, useScaling]
  )
  const weights = useMemo(() => softmax(scaledScores), [scaledScores])

  const maxAbsScore = Math.max(...rawScores.map(Math.abs), 1)
  const entropy = -weights.reduce((s, w) => s + (w > 1e-10 ? w * Math.log2(w) : 0), 0)
  const maxEntropy = Math.log2(WORDS.length)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            Dimension d<sub>k</sub> = {dk}
          </label>
          <input
            type="range"
            min="2"
            max="512"
            value={dk}
            onChange={(e) => setDk(Number(e.target.value))}
            style={{ width: '100%', marginTop: '4px' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94a3b8',
            }}
          >
            <span>2</span>
            <span>512</span>
          </div>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            color: '#475569',
          }}
        >
          <input
            type="checkbox"
            checked={useScaling}
            onChange={(e) => setUseScaling(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          Scale by 1/√d<sub>k</sub>
          {useScaling && (
            <span style={{ color: '#16a34a', fontWeight: 400 }}>
              {' '}
              (÷ {Math.sqrt(dk).toFixed(1)})
            </span>
          )}
        </label>
      </div>

      {/* Visualization */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* Scores */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            {useScaling ? 'Scaled Compatibility Scores' : 'Raw Dot-Product Scores'}
          </div>
          {WORDS.map((word, i) => {
            const score = scaledScores[i]
            const rawScore = rawScores[i]
            const barWidth = Math.min(
              (Math.abs(score) / (maxAbsScore * (useScaling ? 1 / Math.sqrt(dk) : 1) + 1)) * 80,
              100
            )
            const isPositive = score >= 0
            return (
              <div
                key={word}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    width: '44px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                  }}
                >
                  {word}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '20px',
                    background: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: isPositive ? '50%' : undefined,
                      right: isPositive ? undefined : '50%',
                      width: `${barWidth / 2}%`,
                      height: '100%',
                      background: isPositive ? '#4f46e5' : '#ef4444',
                      borderRadius: '4px',
                      transition: 'all 0.3s',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      background: '#94a3b8',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    width: '52px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                >
                  {score.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Attention Weights */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            Attention Weights (after softmax)
          </div>
          {WORDS.map((word, i) => {
            const weight = weights[i]
            return (
              <div
                key={word}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    width: '44px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                  }}
                >
                  {word}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '20px',
                    background: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${weight * 100}%`,
                      height: '100%',
                      background: weight > 0.5 ? '#dc2626' : weight > 0.2 ? '#f59e0b' : '#4f46e5',
                      borderRadius: '4px',
                      transition: 'all 0.3s',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    width: '52px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                >
                  {weight.toFixed(3)}
                </span>
              </div>
            )
          })}
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: entropy / maxEntropy < 0.5 ? '#fef2f2' : '#f0fdf4',
              borderRadius: '6px',
              fontSize: '12px',
              border: `1px solid ${entropy / maxEntropy < 0.5 ? '#fecaca' : '#bbf7d0'}`,
            }}
          >
            <span style={{ fontWeight: 600 }}>Distribution entropy: </span>
            {entropy.toFixed(2)} / {maxEntropy.toFixed(2)}
            <span style={{ color: '#64748b' }}>
              {' '}
              —{' '}
              {entropy / maxEntropy < 0.3
                ? 'nearly one-hot (peaked)'
                : entropy / maxEntropy < 0.7
                ? 'moderately spread'
                : 'well distributed'}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#64748b',
          lineHeight: 1.6,
          padding: '10px 12px',
          background: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}
      >
        {dk >= 128 && !useScaling ? (
          <>
            At d<sub>k</sub>={dk}, raw dot products are large → softmax saturates →{' '}
            <strong>nearly all weight on one token</strong>. Toggle scaling to fix this.
          </>
        ) : dk >= 128 && useScaling ? (
          <>
            Scaling by 1/√{dk} = 1/{Math.sqrt(dk).toFixed(1)} brings scores back to a moderate range
            → softmax produces a <strong>smoother distribution</strong> with useful gradients.
          </>
        ) : (
          <>
            At low d<sub>k</sub>, dot products are small and scaling has little effect. Increase d
            <sub>k</sub> to see why scaling matters.
          </>
        )}
      </div>
    </div>
  )
}
