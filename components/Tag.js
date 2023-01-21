import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="mr-2 mb-2 rounded-md bg-primary-200 p-2 text-sm font-medium hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

//

export default Tag
