// import { Link, usePage } from '@inertiajs/react'
// import React, { useState, useEffect, useRef } from 'react'

// const slugify = (value) =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '')

// const PRODUCTS_MENU = [
//   {name:'Fire Alarm', slug:'fire-detection-notification-and-suppression'},
//   {name:'Public Address', slug:'public-audio-system'},
//   {name:'Access Control', slug:'modern-access-control-systems',},
//   {name:'CCTV', slug:'integrated-security-systems'},
//  {name:'Digital Lighting', slug: 'digital-lighting'},
//  { name:'Data Network',slug:'data-network'},
//  {name:'Grounding ERT', slug: 'grounding-ert'},
//  { name:'Control and Monitor System',slug: 'control-and-monitor-system'},
// ].map((label) => ({
//   label:label.name,
//   path: `/category/${label.slug}`,
// }))

// const NAV_LINKS = [
//   { label: 'Home',               path: '/' },
//   { label: 'About Us',           path: '/about' },
//   { label: 'Products',           path: '/product', hasDropdown: true },
//   { label: 'Services',           path: '/service' },
//   { label: 'Projects', path: '/projects-page' },
//   { label: 'Contact Us',         path: '/contact' },
// ]

// const ChevronDown = ({ open }) => (
//   <svg
//     className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
//     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//   </svg>
// )

// const ArrowRight = () => (
//   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//   </svg>
// )

// const CloseIcon = () => (
//   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//   </svg>
// )

// export default function Navbar() {
//   const [dropdownOpen,   setDropdownOpen]   = useState(false)
//   const [mobileOpen,     setMobileOpen]     = useState(false)
//   const [mobileProdOpen, setMobileProdOpen] = useState(false)
//   const [scrolled,       setScrolled]       = useState(false)
//   const [productMenu] = useState(PRODUCTS_MENU)
//   const dropdownRef = useRef(null)
//   const { url } = usePage()

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60)
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setDropdownOpen(false)
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   useEffect(() => {
//     setDropdownOpen(false)
//     setMobileOpen(false)
//     setMobileProdOpen(false)
//   }, [url])

//   // Lock body scroll when mobile menu is open
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? 'hidden' : ''
//     return () => { document.body.style.overflow = '' }
//   }, [mobileOpen])

//   // FIX: use exact match for '/', otherwise check that the URL
//   // starts with the path AND the next character is '/' or end-of-string.
//   // This prevents '/service' from matching '/service-ticket'.
//   const isActive = (path) => {
//     if (path === '/') return url === '/'
//     return url === path || url.startsWith(path + '/') || url.startsWith(path + '?')
//   }

//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap"
//         rel="stylesheet"
//       />

//       {/* ── Fixed outer wrapper ─────────────────────────────────── */}
//       <div
//         className={[
//           'fixed top-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-300',
//           !scrolled ? 'pt-4 lg:pt-10' : 'pt-0',
//         ].join(' ')}
//         style={{ fontFamily: 'Barlow, sans-serif' }}
//       >

//         {/* ── Main bar ──────────────────────────────────────────── */}
//         <div
//           className={[
//             'flex items-center justify-between transition-all duration-300',
//             scrolled
//               ? 'w-full px-4 sm:px-8 lg:px-14 py-3 lg:py-2 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)] rounded-none gap-4 lg:gap-14'
//               : 'w-[calc(100%-32px)] lg:w-auto mx-auto px-4 sm:px-8 lg:px-10 py-3 lg:py-4 bg-white rounded-3xl gap-4 lg:gap-14',
//           ].join(' ')}
//         >

//           {/* ── Logo ──────────────────────────────────────────── */}
//           <Link href="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
//             <div className="border border-[#bb1403] rounded-full flex items-center justify-center flex-shrink-0 ">
//               <img className='sm:w-14 sm:h-14 w-10 h-10 rounded-full' src="/images/logo.png" alt="" />
//             </div>
//           </Link>

//           {/* ── Desktop nav ────────────────────────────────────── */}
//           <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center">
//             {NAV_LINKS.map((item) =>
//               item.hasDropdown ? (
//                 <div key={item.label} className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={() => setDropdownOpen((o) => !o)}
//                     className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap border-none bg-transparent cursor-pointer
//                       ${isActive(item.path) || dropdownOpen ? 'text-[#bb1403]' : 'text-gray-600 hover:text-[#bb1403]'}`}
//                   >
//                     {item.label}
//                     <ChevronDown open={dropdownOpen} />
//                   </button>

//                   {dropdownOpen && (
//                     <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[260px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
//                       <div className="h-[3px] bg-[#bb1403]" />
//                       <ul className="py-1.5 m-0 p-0 list-none max-h-[340px] overflow-y-auto">
//                         {productMenu.map((sub) => (
//                           <li key={sub.label}>
//                             <Link
//                               href={sub.path}
//                               className="flex items-center gap-2.5 px-4 py-2.5 text-md font-medium text-gray-600 hover:text-[#bb1403] hover:bg-red-50 no-underline transition-colors"
//                             >
//                               <span className="w-1.5 h-1.5 rounded-full bg-[#bb1403] opacity-40 flex-shrink-0" />
//                               {sub.label}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link
//                   key={item.label}
//                   href={item.path}
//                   className={`px-3 py-2 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap no-underline
//                     ${isActive(item.path) ? 'text-[#bb1403]' : 'text-gray-600 hover:text-[#bb1403]'}`}
//                 >
//                   {item.label}
//                 </Link>
//               )
//             )}
//           </nav>

//           {/* ── Right: CTA + hamburger ──────────────────────────── */}
//           <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
//             <Link
//               href="/service-ticket"
//               className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm lg:text-lg font-bold rounded-full transition-colors whitespace-nowrap no-underline shadow-sm"
//             >
//               Service Ticket
//               <ArrowRight />
//             </Link>

//             {/* Hamburger — mobile/tablet only */}
//             <button
//               onClick={() => setMobileOpen((o) => !o)}
//               className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
//               aria-label="Toggle menu"
//             >
//               <span className={`block w-[16px] h-0.5 bg-gray-700 rounded transition-transform duration-200 origin-center ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
//               <span className={`block w-[16px] h-0.5 bg-gray-700 rounded transition-opacity duration-150 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
//               <span className={`block w-[16px] h-0.5 bg-gray-700 rounded transition-transform duration-200 origin-center ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile menu — full-screen overlay ───────────────────── */}
//       {mobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 z-[60] flex flex-col bg-white"
//           style={{ fontFamily: 'Barlow, sans-serif' }}
//         >
//           {/* Header row */}
//           <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
//             <Link href="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
//               <div className="border border-[#bb1403] rounded-full flex items-center justify-center flex-shrink-0 ">
//                 <img className='w-12 h-12 rounded-full' src="/images/logo.png" alt="" />
//               </div>
//             </Link>
//             <button
//               onClick={() => setMobileOpen(false)}
//               className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
//               aria-label="Close menu"
//             >
//               <CloseIcon />
//             </button>
//           </div>

//           {/* Scrollable nav links */}
//           <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
//             {NAV_LINKS.map((item) =>
//               item.hasDropdown ? (
//                 <div key={item.label}>
//                   <button
//                     onClick={() => setMobileProdOpen((o) => !o)}
//                     className="w-full flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-gray-700 hover:text-[#bb1403] rounded-lg hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer"
//                   >
//                     {item.label}
//                     <ChevronDown open={mobileProdOpen} />
//                   </button>
//                   {mobileProdOpen && (
//                     <div className="ml-3 pl-3 pb-1 border-l-2 border-[#bb1403]/20 flex flex-col gap-0.5">
//                       {productMenu.map((sub) => (
//                         <Link
//                           key={sub.label}
//                           href={sub.path}
//                           className="py-2 text-[14px] text-gray-500 hover:text-[#bb1403] transition-colors no-underline"
//                         >
//                           {sub.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link
//                   key={item.label}
//                   href={item.path}
//                   className={`px-3 py-3 text-[15px] font-semibold rounded-lg transition-colors no-underline
//                     ${isActive(item.path) ? 'text-[#bb1403] bg-red-50' : 'text-gray-700 hover:text-[#bb1403] hover:bg-red-50'}`}
//                 >
//                   {item.label}
//                 </Link>
//               )
//             )}
//           </div>

//           {/* Sticky bottom CTA */}
//           <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100">
//             <Link
//               href="/service-ticket"
//               className="flex items-center justify-center gap-2 w-full py-3 bg-[#bb1403] hover:bg-[#9e1102] text-white text-[15px] font-bold rounded-full transition-colors no-underline"
//             >
//               Service Ticket
//               <ArrowRight />
//             </Link>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

import { Link, usePage } from '@inertiajs/react'
import React, { useState, useEffect, useRef } from 'react'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const PRODUCTS_MENU = [
  {name:'Automation / Home Automation', slug:'home-automation'},
  {name:'Fire Alarm', slug:'fire-detection-notification-and-suppression'},
  {name:'Public Address', slug:'public-audio-system'},
  {name:'Access Control', slug:'modern-access-control-systems',},
  {name:'CCTV', slug:'integrated-security-systems'},
 {name:'Digital Lighting', slug: 'digital-lighting'},
 { name:'Data Network',slug:'data-network'},
 {name:'Grounding ERT', slug: 'grounding-ert'},
 { name:'Control and Monitor System',slug: 'control-and-monitor-system'},
].map((label) => ({
  label:label.name,
  path: `/category/${label.slug}`,
}))

const NAV_LINKS = [
  { label: 'Home',               path: '/' },
  { label: 'About Us',           path: '/about' },
  { label: 'Products',           path: '/product', hasDropdown: true },
  { label: 'Services',           path: '/service' },
  { label: 'Projects', path: '/projects-page' },
  { label: 'Contact Us',         path: '/contact' },
  // { label: 'Add To Cart',         path: '/add-to-cart', isIcon: true, iconSrc: '/images/cart.png' },
]

const ChevronDown = ({ open }) => (
  <svg
    className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const CartIcon = ({ src }) => (
  <img src={src} alt="cart" className="w-6 h-6 object-contain" />
)

export default function Navbar() {
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [mobileProdOpen, setMobileProdOpen] = useState(false)
  const [scrolled,       setScrolled]       = useState(false)
  const [productMenu] = useState(PRODUCTS_MENU)
  const dropdownRef = useRef(null)
  const { url } = usePage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setDropdownOpen(false)
    setMobileOpen(false)
    setMobileProdOpen(false)
  }, [url])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // FIX: use exact match for '/', otherwise check that the URL
  // starts with the path AND the next character is '/' or end-of-string.
  // This prevents '/service' from matching '/service-ticket'.
  const isActive = (path) => {
    if (path === '/') return url === '/'
    return url === path || url.startsWith(path + '/') || url.startsWith(path + '?')
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap"
        rel="stylesheet"
      />

      {/* ── Fixed outer wrapper ─────────────────────────────────── */}
      <div
        className={[
          'fixed top-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-300',
          !scrolled ? 'pt-4 lg:pt-10' : 'pt-0',
        ].join(' ')}
        style={{ fontFamily: 'Barlow, sans-serif' }}
      >

        {/* ── Main bar ──────────────────────────────────────────── */}
        <div
          className={[
            'flex items-center justify-between transition-all duration-300',
            scrolled
              ? 'w-full px-4 sm:px-8 lg:px-14 py-3 lg:py-2 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)] rounded-none gap-4 lg:gap-14'
              : 'w-[calc(100%-32px)] lg:w-auto mx-auto px-4 sm:px-8 lg:px-10 py-3 lg:py-4 bg-white rounded-3xl gap-4 lg:gap-14',
          ].join(' ')}
        >

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
            <div className="border border-[#bb1403] rounded-full flex items-center justify-center flex-shrink-0 ">
              <img className='sm:w-14 sm:h-14 w-10 h-10 rounded-full' src="/images/logo.png" alt="" />
            </div>
          </Link>

          {/* ── Desktop nav ────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center">
            {NAV_LINKS.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap border-none bg-transparent cursor-pointer
                      ${isActive(item.path) || dropdownOpen ? 'text-[#bb1403]' : 'text-gray-600 hover:text-[#bb1403]'}`}
                  >
                    {item.label}
                    <ChevronDown open={dropdownOpen} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[260px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="h-[3px] bg-[#bb1403]" />
                      <ul className="py-1.5 m-0 p-0 list-none max-h-[340px] overflow-y-auto">
                        {productMenu.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.path}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-md font-medium text-gray-600 hover:text-[#bb1403] hover:bg-red-50 no-underline transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#bb1403] opacity-40 flex-shrink-0" />
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : item.isIcon ? (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg transition-colors no-underline flex items-center justify-center
                    ${isActive(item.path) ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  <CartIcon src={item.iconSrc} />
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg text-lg font-semibold transition-colors whitespace-nowrap no-underline
                    ${isActive(item.path) ? 'text-[#bb1403]' : 'text-gray-600 hover:text-[#bb1403]'}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* ── Right: CTA + hamburger ──────────────────────────── */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link
              href="/service-ticket"
              className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm lg:text-lg font-bold rounded-full transition-colors whitespace-nowrap no-underline shadow-sm"
            >
              Service Ticket
              <ArrowRight />
            </Link>

            {/* Hamburger — mobile/tablet only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Toggle menu"
            >
              <span className={`block w-[16px] h-0.5 bg-gray-700 rounded transition-transform duration-200 origin-center ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block w-[16px] h-0.5 bg-gray-700 rounded transition-opacity duration-150 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-[16px] h-0.5 bg-gray-700 rounded transition-transform duration-200 origin-center ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu — full-screen overlay ───────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] flex flex-col bg-white"
          style={{ fontFamily: 'Barlow, sans-serif' }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
              <div className="border border-[#bb1403] rounded-full flex items-center justify-center flex-shrink-0 ">
                <img className='w-12 h-12 rounded-full' src="/images/logo.png" alt="" />
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Scrollable nav links */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
            {NAV_LINKS.map((item) =>
              item.hasDropdown ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileProdOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-gray-700 hover:text-[#bb1403] rounded-lg hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {item.label}
                    <ChevronDown open={mobileProdOpen} />
                  </button>
                  {mobileProdOpen && (
                    <div className="ml-3 pl-3 pb-1 border-l-2 border-[#bb1403]/20 flex flex-col gap-0.5">
                      {productMenu.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.path}
                          className="py-2 text-[14px] text-gray-500 hover:text-[#bb1403] transition-colors no-underline"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.isIcon ? (
                <Link
                  key={item.path}
                  href={item.path}
                  className="px-3 py-3 flex items-center justify-start no-underline"
                >
                  <CartIcon src={item.iconSrc} />
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`px-3 py-3 text-[15px] font-semibold rounded-lg transition-colors no-underline
                    ${isActive(item.path) ? 'text-[#bb1403] bg-red-50' : 'text-gray-700 hover:text-[#bb1403] hover:bg-red-50'}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Sticky bottom CTA */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100">
            <Link
              href="/service-ticket"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#bb1403] hover:bg-[#9e1102] text-white text-[15px] font-bold rounded-full transition-colors no-underline"
            >
              Service Ticket
              <ArrowRight />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}