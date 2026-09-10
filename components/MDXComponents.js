/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'
import ExactMatchRetrieval from './attention/ExactMatchRetrieval'
import FuzzyMatchRetrieval from './attention/FuzzyMatchRetrieval'
import ScalingVisualizer from './attention/ScalingVisualizer'
import SelfAttentionVisualizer from './attention/SelfAttentionVisualizer'

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  ExactMatchRetrieval,
  FuzzyMatchRetrieval,
  ScalingVisualizer,
  SelfAttentionVisualizer,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
