import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'

import SocialIcon from '@/components/social-icons'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('blog')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('blog', params.slug.join('/'))
  const authorList = post.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts)
    fs.writeFileSync('./public/feed.xml', rss)
  }

  return { props: { post, authorDetails, prev, next } }
}

export default function Blog({ post, authorDetails, prev, next }) {
  const { mdxSource, toc, frontMatter } = post
  const defaultAuthorDetails = authorDetails[0]
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
  } = defaultAuthorDetails
  return (
    <>
      {frontMatter.draft !== true ? (
        <div className="divide-y">
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
          <div className="pt-4">
            <MDXLayoutRenderer
              layout={frontMatter.layout || DEFAULT_LAYOUT}
              toc={toc}
              mdxSource={mdxSource}
              frontMatter={frontMatter}
              authorDetails={authorDetails}
              prev={prev}
              next={next}
            />
          </div>
        </div>
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
