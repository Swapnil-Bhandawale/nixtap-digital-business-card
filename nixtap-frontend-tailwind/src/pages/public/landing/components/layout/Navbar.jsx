import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react'
import NixtapLogo from '../ui/NixtapLogo.jsx'
import Button from '../ui/Button.jsx'
import { Link } from 'react-router-dom'
import { useScrollPosition } from '../../hooks/useScrollPosition.js'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'
import { audienceLinks, productLinks, resourceLinks } from '../../utils/navigation.js'

const EASE = [0.16, 1, 0.3, 1]

export default function Navbar() {
  const scrolled = useScrollPosition(12)
  const [openMenu, setOpenMenu] = useState(null) // 'products' | 'resources' | null
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const isAuthenticated = !!localStorage.getItem('nixtap_token');

  useLockBodyScroll(mobileOpen)

  // Close any open mega-menu when clicking outside the nav.
  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile drawer automatically if viewport grows to desktop size.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItemClass =
    'flex items-center gap-1 text-[14.5px] font-medium text-ink-800 dark:text-white hover:text-ink-900 dark:text-white transition-colors duration-150 py-2'

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-nav' : 'bg-white/0 dark:bg-slate-900/0'
      }`}
    >
      <nav className="max-w-container-lg mx-auto container-px">
        <div className="flex items-center justify-between h-[76px]">
          {/* Logo */}
          <a href="#" className="shrink-0" aria-label="Nixtap home">
            <NixtapLogo />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {audienceLinks.map((item) => (
              <a key={item.label} href={item.href} className={navItemClass + ' px-3'}>
                {item.label}
              </a>
            ))}

            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('products')}
              onMouseLeave={() => setOpenMenu((m) => (m === 'products' ? null : m))}
            >
              <button
                className={navItemClass + ' px-3'}
                onClick={() => setOpenMenu((m) => (m === 'products' ? null : 'products'))}
                aria-expanded={openMenu === 'products'}
              >
                Products
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    openMenu === 'products' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openMenu === 'products' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[340px]"
                  >
                    <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-card-hover border border-cloud-200 dark:border-slate-800 p-2.5">
                      {productLinks.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-cloud-100 transition-colors duration-150 group"
                        >
                          <span className="mt-0.5 shrink-0 w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors duration-150">
                            <item.icon size={17} strokeWidth={2} />
                          </span>
                          <span>
                            <span className="block text-[14px] font-semibold text-ink-900 dark:text-white">
                              {item.label}
                            </span>
                            <span className="block text-[13px] text-cloud-600 mt-0.5 leading-snug">
                              {item.description}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('resources')}
              onMouseLeave={() => setOpenMenu((m) => (m === 'resources' ? null : m))}
            >
              <button
                className={navItemClass + ' px-3'}
                onClick={() => setOpenMenu((m) => (m === 'resources' ? null : 'resources'))}
                aria-expanded={openMenu === 'resources'}
              >
                Resources
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    openMenu === 'resources' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openMenu === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[520px]"
                  >
                    <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-card-hover border border-cloud-200 dark:border-slate-800 p-4 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-cloud-500 px-3 pb-1">
                          Learn
                        </p>
                        {resourceLinks.main.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-cloud-100 transition-colors duration-150 group"
                          >
                            <span className="mt-0.5 shrink-0 w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors duration-150">
                              <item.icon size={17} strokeWidth={2} />
                            </span>
                            <span>
                              <span className="block text-[14px] font-semibold text-ink-900 dark:text-white">
                                {item.label}
                              </span>
                              <span className="block text-[13px] text-cloud-600 mt-0.5 leading-snug">
                                {item.description}
                              </span>
                            </span>
                          </a>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-cloud-500 px-3 pb-1">
                          Company
                        </p>
                        {resourceLinks.company.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-cloud-100 transition-colors duration-150 group"
                          >
                            <span className="mt-0.5 shrink-0 w-9 h-9 rounded-lg bg-cloud-100 text-ink-700 dark:text-white flex items-center justify-center group-hover:bg-ink-900 group-hover:text-white transition-colors duration-150">
                              <item.icon size={17} strokeWidth={2} />
                            </span>
                            <span>
                              <span className="block text-[14px] font-semibold text-ink-900 dark:text-white">
                                {item.label}
                              </span>
                              <span className="block text-[13px] text-cloud-600 mt-0.5 leading-snug">
                                {item.description}
                              </span>
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#pricing" className={navItemClass + ' px-3'}>
              Pricing
            </a>
          </div>

                    {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 ml-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 text-[14px] font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg shadow-brand-500/20 rounded-full flex items-center gap-1.5 transition-all duration-200"
              >
                Go to Dashboard
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-[14px] font-bold text-ink-900 dark:text-white hover:text-brand-600 bg-cloud-50 dark:bg-slate-800 hover:bg-cloud-100 rounded-full transition-all duration-200"
                >
                  Log in
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2.5 text-[14px] font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg shadow-brand-500/20 rounded-full flex items-center gap-1.5 transition-all duration-200"
                >
                  Sign up free
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-cloud-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="lg:hidden bg-white dark:bg-slate-950 border-t border-cloud-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="container-px py-5 flex flex-col gap-1 max-h-[calc(100vh-76px)] overflow-y-auto">
              {audienceLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[15px] font-semibold text-ink-900 dark:text-white py-3 border-b border-cloud-100 dark:border-slate-800"
                >
                  {item.label}
                </a>
              ))}

              <p className="text-[11px] font-semibold uppercase tracking-wider text-cloud-500 pt-4 pb-1">
                Products
              </p>
              {productLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <item.icon size={16} />
                  </span>
                  <span className="text-[14.5px] font-medium text-ink-800 dark:text-white">
                    {item.label}
                  </span>
                </a>
              ))}

              <p className="text-[11px] font-semibold uppercase tracking-wider text-cloud-500 pt-4 pb-1">
                Resources
              </p>
              {[...resourceLinks.main, ...resourceLinks.company].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span className="w-8 h-8 rounded-lg bg-cloud-100 text-ink-700 dark:text-white flex items-center justify-center shrink-0">
                    <item.icon size={16} />
                  </span>
                  <span className="text-[14.5px] font-medium text-ink-800 dark:text-white">
                    {item.label}
                  </span>
                </a>
              ))}

              <a
                href="#pricing"
                className="text-[15px] font-semibold text-ink-900 dark:text-white py-3 mt-2 border-t border-cloud-100 dark:border-slate-800"
              >
                Pricing
              </a>

                            <div className="flex items-center gap-3 mt-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex-1">
                    <div className="w-full h-12 flex items-center justify-center text-[15px] font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 rounded-xl transition-colors">
                      Go to Dashboard
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <div className="w-full h-12 flex items-center justify-center text-[15px] font-bold text-ink-900 dark:text-white bg-cloud-50 dark:bg-slate-800 hover:bg-cloud-100 rounded-xl transition-colors">
                        Log in
                      </div>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <div className="w-full h-12 flex items-center justify-center text-[15px] font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 rounded-xl transition-colors">
                        Sign up free
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}





