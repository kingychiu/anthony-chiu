import { useState, useEffect, useRef } from 'react'

const TOCSidebar = ({ toc, exclude = '' }) => {
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const observerRef = useRef(null)

  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter(
    (heading) => heading.depth >= 1 && heading.depth <= 3 && !re.test(heading.value)
  )

  useEffect(() => {
    const headingEls = filteredToc
      .map((h) => document.getElementById(h.url.replace('#', '')))
      .filter(Boolean)

    if (headingEls.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headingEls.forEach((el) => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [toc])

  const handleClick = (url) => {
    setIsOpen(false)
    const el = document.getElementById(url.replace('#', ''))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-colors hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 xl:hidden"
        aria-label="Toggle table of contents"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="9" y2="18" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-72 transform overflow-y-auto bg-white p-6 pt-16 shadow-xl transition-transform duration-300 dark:bg-gray-900 xl:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close table of contents"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          On this page
        </p>
        <nav>
          <ul className="space-y-1">
            {filteredToc.map((heading) => (
              <li key={heading.value}>
                <a
                  href={heading.url}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick(heading.url)
                  }}
                  className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                    heading.depth >= 3 ? 'pl-6' : ''
                  } ${
                    activeId === heading.url.replace('#', '')
                      ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop sticky sidebar */}
      <nav className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto xl:block">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          On this page
        </p>
        <ul className="space-y-1 border-l border-gray-200 dark:border-gray-700">
          {filteredToc.map((heading) => (
            <li key={heading.value}>
              <a
                href={heading.url}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(heading.url)
                }}
                className={`-ml-px block border-l-2 py-1.5 text-sm transition-colors ${
                  heading.depth >= 3 ? 'pl-6' : 'pl-4'
                } ${
                  activeId === heading.url.replace('#', '')
                    ? 'border-primary-500 font-medium text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {heading.value}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default TOCSidebar
