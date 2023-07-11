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
import Image from 'next/image'

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
        <div className="space-y-2 pt-4 pb-4">
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
        <div className="space-y-2 pt-4 pb-4">
          <div className="font-bold">Projects</div>
          <a
            href="https://github.com/kingychiu/target-permutation-importances"
            target="_blank"
            rel="noreferrer"
            key="target-permutation-importances"
            className="
                    hover:
                    flex flex-col overflow-hidden rounded-lg  transition duration-300
                    ease-in-out hover:scale-105 hover:shadow-2xl  md:w-[50%]"
          >
            <div className="flex flex-1 flex-col justify-between bg-transparent p-6">
              <div className="flex-1">
                <div className="mt-2 block">
                  <p className="text-base font-semibold text-gray-900  dark:text-white">
                    Target Permutation Importances (Null Importances)
                  </p>
                  <div className="flex space-x-1">
                    <img
                      src="https://img.shields.io/pypi/v/target-permutation-importances.svg"
                      alt="Downloads"
                      style={{
                        height: '20px',
                        width: '96px',
                      }}
                    />
                    <img
                      src="https://static.pepy.tech/badge/target-permutation-importances"
                      alt="Downloads"
                      style={{
                        height: '20px',
                        width: '96px',
                      }}
                    />
                  </div>
                  <p className="dark:text-grey-400 mt-3 text-base  text-gray-500">
                    A Python Package that computes Target Permutation Importances (Null Importances)
                    of a machine learning model.
                  </p>
                </div>
              </div>
            </div>
          </a>
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
