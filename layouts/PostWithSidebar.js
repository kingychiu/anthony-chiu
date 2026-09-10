import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Tag from '@/components/Tag'
import { BlogSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TOCSidebar from '@/components/TOCSidebar'

export default function PostWithSidebar({ frontMatter, authorDetails, next, prev, toc, children }) {
  const { date, title, tags } = frontMatter

  return (
    <>
      <BlogSEO url={`${siteMetadata.siteUrl}/blog/${frontMatter.slug}`} {...frontMatter} />
      <ScrollTopAndComment />
      <article>
        {/* Header */}
        <header>
          <div className="space-y-1 pb-0">
            <dl>
              <div>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>{formatDate(date)}</time>
                </dd>
              </div>
            </dl>
            <div>
              <PageTitle>{title}</PageTitle>
            </div>
            <div className="text-sm font-medium leading-5">
              {tags && (
                <div className="py-4">
                  <div className="flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content + Sidebar grid */}
        <div className="relative xl:grid xl:grid-cols-[1fr_220px] xl:gap-8">
          {/* Main content */}
          <div className="pb-8 md:text-justify">
            <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
            <Comments frontMatter={frontMatter} />
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${next.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>

          {/* TOC Sidebar — desktop only in grid, mobile via floating button */}
          <aside className="pt-10">
            <TOCSidebar toc={toc} exclude="Preface" />
          </aside>
        </div>
      </article>
    </>
  )
}
