import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y">
        <ul>
          {!filteredBlogPosts.length && 'No posts found.'}

          <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {displayPosts.map((frontMatter) => {
              const { slug, date, title, summary, tags, images } = frontMatter
              return (
                <a
                  href={`/blog/${slug}`}
                  key={slug}
                  className="
                    hover: flex flex-col overflow-hidden rounded-lg border border-gray-800 transition
                    duration-300 ease-in-out hover:scale-105 hover:shadow-2xl dark:border-white"
                >
                  <div className="mt-6 flex-shrink-0 text-center">
                    <Image
                      src={images[0]}
                      alt=""
                      width="300"
                      height="200"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-transparent p-6">
                    <div className="flex-1">
                      <div className="dark:text-grey-400 flex space-x-1 text-sm text-gray-500">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </div>
                      <div className="mt-2 block">
                        <p className="text-base font-semibold text-gray-900  dark:text-white">
                          {title}
                        </p>
                        <p className="dark:text-grey-400 mt-3 text-base  text-gray-500">
                          {summary}
                        </p>
                      </div>
                    </div>
                    {/* <div className="mt-6 flex items-center">
                      <div className="flex flex-wrap ">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div> */}
                  </div>
                </a>
              )
            })}
          </div>
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
