import { useState, useEffect } from 'react'

const DATABASE = [
  { key: 'Anthony', value: 1000 },
  { key: 'Tom', value: 2000 },
  { key: 'Tony', value: 3000 },
]

export default function ExactMatchRetrieval() {
  const [query, setQuery] = useState('Anthony')
  const [matchedIdx, setMatchedIdx] = useState(0)
  const [animPhase, setAnimPhase] = useState('idle') // idle -> searching -> found

  const handleQuery = (name) => {
    if (name === query && animPhase === 'idle') return
    setQuery(name)
    setAnimPhase('searching')
    setMatchedIdx(-1)
  }

  useEffect(() => {
    if (animPhase !== 'searching') return
    const idx = DATABASE.findIndex((r) => r.key === query)
    const timer = setTimeout(() => {
      setMatchedIdx(idx)
      setAnimPhase('found')
    }, 600)
    return () => clearTimeout(timer)
  }, [animPhase, query])

  useEffect(() => {
    if (animPhase !== 'found') return
    const timer = setTimeout(() => setAnimPhase('idle'), 100)
    return () => clearTimeout(timer)
  }, [animPhase])

  const matchedRow = matchedIdx >= 0 ? DATABASE[matchedIdx] : null

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          display: 'flex',
          gap: '24px',
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
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              {DATABASE.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleQuery(r.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: query === r.key ? '2px solid #4f46e5' : '1px solid #ccc',
                    background: query === r.key ? '#eef2ff' : 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: query === r.key ? 600 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  {r.key}
                </button>
              ))}
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
                color: matchedRow ? '#16a34a' : '#999',
                transition: 'all 0.3s',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {animPhase === 'searching' ? (
                <span style={{ color: '#999' }}>Searching...</span>
              ) : matchedRow ? (
                `$${matchedRow.value.toLocaleString()}`
              ) : (
                '—'
              )}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            minWidth: '80px',
          }}
        >
          <svg width="80" height="40" viewBox="0 0 80 40">
            <defs>
              <marker
                id="arrowExact"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L8,3 L0,6" fill="#4f46e5" />
              </marker>
            </defs>
            <line
              x1="5"
              y1="20"
              x2="65"
              y2="20"
              stroke="#4f46e5"
              strokeWidth="2"
              markerEnd="url(#arrowExact)"
              style={{
                opacity: animPhase === 'searching' ? 1 : 0.4,
                transition: 'opacity 0.3s',
              }}
            />
          </svg>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#4f46e5',
              opacity: animPhase === 'searching' ? 1 : 0.5,
              transition: 'opacity 0.3s',
            }}
          >
            Exact Match
          </div>
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
                const isMatch = matchedIdx === i
                return (
                  <tr
                    key={r.key}
                    style={{
                      background: isMatch ? '#dcfce7' : i % 2 === 0 ? '#f9fafb' : 'white',
                      transition: 'background 0.3s',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <td
                      style={{
                        padding: '8px 16px',
                        fontWeight: isMatch ? 700 : 400,
                        transition: 'all 0.3s',
                      }}
                    >
                      {r.key}
                    </td>
                    <td
                      style={{
                        padding: '8px 16px',
                        textAlign: 'right',
                        fontWeight: isMatch ? 700 : 400,
                        color: isMatch ? '#16a34a' : 'inherit',
                        transition: 'all 0.3s',
                      }}
                    >
                      ${r.value.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
