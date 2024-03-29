import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import SocialIcon from '@/components/social-icons'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between">
              <Link className="mr-3" href="/" aria-label={siteMetadata.headerTitle}>
                <Image width="50px" height="50px" alt="logo" src={siteMetadata.siteLogo} />
              </Link>
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <h1 className="hidden text-2xl font-semibold sm:block">
                  {siteMetadata.headerTitle}
                </h1>
              </Link>
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <Image width="100px" height="100px" alt="logo" src="/static/images/sorb.gif" />
              </Link>
            </div>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
