import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a
        className="mr-2 mb-2 rounded-md 
        border border-gray-800 bg-primary-200 p-2 text-sm
        font-medium transition duration-300
        ease-in-out hover:scale-105 
        hover:bg-primary-500 hover:shadow-2xl dark:border-white dark:bg-primary-500 dark:hover:bg-primary-600
        "
      >
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

//

export default Tag
