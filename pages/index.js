import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import NewsletterForm from '@/components/NewsletterForm'
import { getFileBySlug } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import SocialIcon from '@/components/social-icons'
import ListLayout from '@/layouts/ListLayout'

const MAX_DISPLAY = 10

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const authorDetails = await getFileBySlug('authors', ['default'])
  return { props: { posts, authorDetails } }
}

export default function Home({ posts, authorDetails }) {
  const { _, frontMatter } = authorDetails
  const {
    name,
    nickName,
    avatar,
    occupation,
    company,
    email,
    twitter,
    linkedin,
    github,
    kaggle,
    orcid,
  } = frontMatter
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-600 dark:divide-white">
        <div className="space-y-2 space-y-4 pt-4 pb-4">
          <h2 className="pt-0 pb-0 text-2xl font-bold leading-8 tracking-tight">
            {name}, {nickName}
          </h2>
          <div className="flex space-x-4">
            <SocialIcon kind="kaggle" href={kaggle} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="orcid" href={orcid} />
            <SocialIcon kind="github" href={github} />
          </div>
        </div>
        <ListLayout posts={posts} title="HI" />
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
