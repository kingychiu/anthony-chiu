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
      <div className="space-y-2 pt-4 pb-4">
        <ul>
          {!filteredBlogPosts.length && 'No posts found.'}
          <div className="font-bold">Articles</div>
          <div className="mx-auto mt-2 grid gap-5">
            {displayPosts.map((frontMatter) => {
              const { slug, date, title, summary, tags, images } = frontMatter
              return (
                <a
                  href={`/blog/${slug}`}
                  key={slug}
                  className="
                    hover: flex flex-col overflow-hidden rounded-lg  transition
                    duration-300 ease-in-out hover:scale-105 hover:shadow-2xl md:w-[50%]"
                >
                  {/* <div className="mt-6 flex-shrink-0 text-center">
                    <Image
                ./build      src={images[0]}
                      alt=""
                      width="300"
                      height="200"
                      className="object-cover"
                    />
                  </div> */}
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
