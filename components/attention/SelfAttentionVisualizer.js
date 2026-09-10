import { useState, useMemo } from 'react'

function softmax(values) {
  const max = Math.max(...values)
  const exps = values.map((v) => Math.exp(v - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
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

const SENTENCES = {
  disambiguation: {
    label: 'Word disambiguation',
    words: ['i', 'like', 'to', 'eat', 'apple'],
    attentionMatrix: [
      [0.3, 0.2, 0.1, 0.2, 0.2],
      [0.1, 0.3, 0.1, 0.2, 0.3],
      [0.15, 0.15, 0.3, 0.2, 0.2],
      [0.05, 0.15, 0.1, 0.4, 0.3],
      [0.05, 0.1, 0.05, 0.45, 0.35],
    ],
  },
  coreference: {
    label: 'Coreference',
    words: ['the', 'cat', 'sat', 'because', 'it', 'was', 'tired'],
    attentionMatrix: [
      [0.4, 0.3, 0.05, 0.05, 0.05, 0.05, 0.1],
      [0.1, 0.4, 0.1, 0.05, 0.1, 0.05, 0.2],
      [0.05, 0.25, 0.35, 0.05, 0.1, 0.05, 0.15],
      [0.05, 0.1, 0.2, 0.35, 0.1, 0.1, 0.1],
      [0.05, 0.55, 0.05, 0.05, 0.15, 0.05, 0.1],
      [0.05, 0.15, 0.15, 0.05, 0.2, 0.3, 0.1],
      [0.05, 0.2, 0.1, 0.05, 0.15, 0.1, 0.35],
    ],
  },
  negation: {
    label: 'Negation',
    words: ['i', 'do', 'not', 'like', 'rain'],
    attentionMatrix: [
      [0.45, 0.15, 0.1, 0.15, 0.15],
      [0.15, 0.3, 0.25, 0.15, 0.15],
      [0.1, 0.25, 0.3, 0.2, 0.15],
      [0.1, 0.1, 0.4, 0.25, 0.15],
      [0.05, 0.05, 0.25, 0.3, 0.35],
    ],
  },
}

function getColor(weight) {
  const intensity = Math.min(weight * 2.5, 1)
  const r = Math.round(79 + (255 - 79) * (1 - intensity))
  const g = Math.round(70 + (255 - 70) * (1 - intensity))
  const b = Math.round(229 + (255 - 229) * (1 - intensity))
  return `rgb(${r}, ${g}, ${b})`
}

export default function SelfAttentionVisualizer() {
  const [selectedSentence, setSelectedSentence] = useState('disambiguation')
  const [selectedQuery, setSelectedQuery] = useState(4)

  const sentence = SENTENCES[selectedSentence]
  const words = sentence.words
  const matrix = sentence.attentionMatrix
  const queryWeights = matrix[selectedQuery] || matrix[0]

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sentence selector */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(SENTENCES).map(([key, s]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedSentence(key)
              setSelectedQuery(Math.min(selectedQuery, s.words.length - 1))
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: selectedSentence === key ? '2px solid #4f46e5' : '1px solid #d1d5db',
              background: selectedSentence === key ? '#eef2ff' : 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: selectedSentence === key ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: sentence with highlights */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div
            style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}
          >
            Click a word to see what it attends to:
          </div>
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '16px',
            }}
          >
            {words.map((word, i) => (
              <button
                key={i}
                onClick={() => setSelectedQuery(i)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: selectedQuery === i ? '2px solid #4f46e5' : '1px solid #d1d5db',
                  background: selectedQuery === i ? '#4f46e5' : 'white',
                  color: selectedQuery === i ? 'white' : '#1e293b',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: selectedQuery === i ? 700 : 400,
                  transition: 'all 0.2s',
                  fontFamily: 'monospace',
                }}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Attention weights for selected query */}
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            Query: &ldquo;{words[selectedQuery]}&rdquo; attends to:
          </div>
          {words.map((word, i) => {
            const weight = queryWeights[i]
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    width: '64px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    textAlign: 'right',
                  }}
                >
                  {word}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '22px',
                    background: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${weight * 100}%`,
                      height: '100%',
                      background: getColor(weight),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease-out',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    width: '40px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                >
                  {weight.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Right: attention heatmap */}
        <div style={{ minWidth: '240px' }}>
          <div
            style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}
          >
            Full Attention Matrix
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      color: '#94a3b8',
                      textAlign: 'right',
                    }}
                  >
                    Q \ K
                  </th>
                  {words.map((w, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '4px 6px',
                        fontFamily: 'monospace',
                        fontWeight: 500,
                        color: '#475569',
                        writingMode: words.length > 5 ? 'vertical-rl' : undefined,
                        textOrientation: words.length > 5 ? 'mixed' : undefined,
                      }}
                    >
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {words.map((qWord, qi) => (
                  <tr
                    key={qi}
                    style={{
                      outline: qi === selectedQuery ? '2px solid #4f46e5' : 'none',
                      borderRadius: '4px',
                    }}
                  >
                    <td
                      style={{
                        padding: '4px 8px',
                        fontFamily: 'monospace',
                        fontWeight: qi === selectedQuery ? 700 : 400,
                        color: qi === selectedQuery ? '#4f46e5' : '#475569',
                        textAlign: 'right',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedQuery(qi)}
                    >
                      {qWord}
                    </td>
                    {matrix[qi].map((weight, ki) => (
                      <td
                        key={ki}
                        style={{
                          padding: '6px',
                          textAlign: 'center',
                          background: getColor(weight),
                          color: weight > 0.35 ? 'white' : '#1e293b',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          fontWeight: weight > 0.3 ? 600 : 400,
                          transition: 'background 0.3s',
                          cursor: 'pointer',
                          minWidth: '36px',
                        }}
                        onClick={() => setSelectedQuery(qi)}
                      >
                        {weight.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#94a3b8',
            }}
          >
            Row = query word, Column = key word. Click a row to inspect.
          </div>
        </div>
      </div>
    </div>
  )
}
