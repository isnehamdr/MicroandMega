

// import { Link } from '@inertiajs/react'
// import { useState, useEffect, useCallback, useRef } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// // Register ScrollTrigger plugin
// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger)
// }

// const SLIDES = [

//   {
//     id: 1,
//     bg: '/images/hero2.jpg',
//     tag: 'Intelligent Life Safety System for Every Building in Nepal Communication',
//     title: 'Intelligent Life Safety System ',
//     desc: 'Intelligent life safety systems enable early fire and gas leak detection in Nepal’s buildings and historic sites. They ensure rapid response, code compliance, and seamless safety integration. Adopting them builds safer, smarter communities.',
//     ctaLink: '/products',
//     video: false,
//   },
//   {
//     id: 3,
//     bg: '/images/hero3.jpg',
//     tag: 'A/V Solutions That Speak & Display Clearly',
//     title: 'A/V Solutions That Speak & Display Clearly',
//     desc: 'Professional PAVA & Audio/Visual (A/V) solutions for schools, hospitals, theaters, conference halls, auditoriums, and public spaces across Nepal. High-quality displays, crystal-clear sound systems, seamless video conferencing, and intelligent automation. ',
//     ctaLink: '/services',
//     video: false,
//   },
//   {
//     id: 4,
//     bg: '/images/hero4.jpg',
//     tag: 'Network and security solutions',
//     title: 'Network and security solutions',
//     desc: 'Network and security solutions designed for your uninterrupted 24/7 business operations. keeping you always connected, always protected, and always ahead.',
//     ctaLink: '/iot-automation',
//     video: false,
//   },
//   {
//     id: 5,
//     bg: '/images/hero5.jpg',
//     tag: 'IOT & AUTOMATION Intelligence That Works for You',
//     title: 'IOT & AUTOMATION Intelligence That Works for You',
//     desc: 'Smart lighting. Climate control. Energy monitoring. Remote access. We deliver end to end IoT and automation solutions for homes, businesses, and institutions across Nepal. ',
//     ctaLink: '/products',
//     video: false,
//   },
// ]

// const FEATURES = [
//  {
//   icon: (
//     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//       <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
//         <rect x="3" y="10" width="32" height="22" rx="3" stroke="#bb1403" strokeWidth="2" />
//         <circle cx="19" cy="21" r="6" stroke="#bb1403" strokeWidth="2" />
//         <circle cx="19" cy="21" r="2.5" fill="#bb1403" />
//         <path d="M35 13 L45 9 L45 33 L35 29" stroke="#bb1403" strokeWidth="2" strokeLinejoin="round" />
//       </svg>
//       <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
//         <rect x="4" y="6" width="20" height="36" rx="4" stroke="#bb1403" strokeWidth="2" />
//         <circle cx="9" cy="13" r="2" fill="#bb1403" />
//         <circle cx="9" cy="21" r="1.5" fill="#bb1403" />
//         <circle cx="14" cy="21" r="1.5" fill="#bb1403" />
//         <circle cx="19" cy="21" r="1.5" fill="#bb1403" />
//         <circle cx="9" cy="27" r="1.5" fill="#bb1403" />
//         <circle cx="14" cy="27" r="1.5" fill="#bb1403" />
//         <circle cx="19" cy="27" r="1.5" fill="#bb1403" />
//         <circle cx="9" cy="33" r="1.5" fill="#bb1403" />
//         <circle cx="14" cy="33" r="1.5" fill="#bb1403" />
//         <circle cx="19" cy="33" r="1.5" fill="#bb1403" />
//         <rect x="28" y="24" width="16" height="14" rx="2" stroke="#bb1403" strokeWidth="2" />
//         <path d="M31 24 L31 18 Q36 13 41 18 L41 24" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <circle cx="36" cy="31" r="2" fill="#bb1403" />
//         <rect x="35" y="31" width="2" height="4" rx="1" fill="#bb1403" />
//       </svg>
//     </div>
//   ),
//   iconSmall: (
//     <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
//       <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
//         <rect x="3" y="10" width="32" height="22" rx="3" stroke="#bb1403" strokeWidth="2" />
//         <circle cx="19" cy="21" r="6" stroke="#bb1403" strokeWidth="2" />
//         <circle cx="19" cy="21" r="2.5" fill="#bb1403" />
//         <path d="M35 13 L45 9 L45 33 L35 29" stroke="#bb1403" strokeWidth="2" strokeLinejoin="round" />
//       </svg>
//     </div>
//   ),
//   label: 'Integrated Surveillance, Control & Security Systems',
// },
  
//   {
//     icon: (
//       <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
//         <path d="M8 42 C8 30 14 26 16 16 C18 26 13 34 20 28 C22 34 20 42 8 42 Z" stroke="#bb1403" strokeWidth="1.8" strokeLinejoin="round" />
//         <line x1="30" y1="4" x2="30" y2="12" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <line x1="23" y1="12" x2="37" y2="12" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <path d="M24 16 L22 23" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M30 16 L30 24" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M36 16 L38 23" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M27 36 C27 29 30 25 34 25 C38 25 41 29 41 36 L41 39 L27 39 Z" stroke="#bb1403" strokeWidth="1.8" />
//         <line x1="25" y1="39" x2="43" y2="39" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <circle cx="34" cy="42" r="2" fill="#bb1403" />
//         <path d="M43 28 Q46 32 43 36" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M45 25 Q50 32 45 39" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//       </svg>
//     ),
//     iconSmall: (
//       <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
//         <path d="M8 42 C8 30 14 26 16 16 C18 26 13 34 20 28 C22 34 20 42 8 42 Z" stroke="#bb1403" strokeWidth="1.8" strokeLinejoin="round" />
//         <line x1="30" y1="4" x2="30" y2="12" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <line x1="23" y1="12" x2="37" y2="12" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <path d="M24 16 L22 23" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M30 16 L30 24" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M36 16 L38 23" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M27 36 C27 29 30 25 34 25 C38 25 41 29 41 36 L41 39 L27 39 Z" stroke="#bb1403" strokeWidth="1.8" />
//         <line x1="25" y1="39" x2="43" y2="39" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" />
//         <circle cx="34" cy="42" r="2" fill="#bb1403" />
//         <path d="M43 28 Q46 32 43 36" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//         <path d="M45 25 Q50 32 45 39" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round" />
//       </svg>
//     ),
//     label: 'Fire Detection, Notification, Suppression',

//   },
//   {
//   icon: (
//     <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
//       {/* Light bulb icon for luxury lighting */}
//       <path d="M24 8C18 8 14 12.5 14 18C14 22 16 25 18 27V31C18 32.1 18.9 33 20 33H28C29.1 33 30 32.1 30 31V27C32 25 34 22 34 18C34 12.5 30 8 24 8Z" stroke="#bb1403" strokeWidth="2" fill="none"/>
//       <path d="M19 37H29" stroke="#bb1403" strokeWidth="2" strokeLinecap="round"/>
//       <path d="M21 41H27" stroke="#bb1403" strokeWidth="2" strokeLinecap="round"/>
//       <circle cx="24" cy="21" r="2" fill="#bb1403"/>
//       {/* Dimming indicator */}
//       <path d="M38 14L42 18M42 14L38 18" stroke="#bb1403" strokeWidth="2" strokeLinecap="round"/>
//       <path d="M6 14L10 18M10 14L6 18" stroke="#bb1403" strokeWidth="2" strokeLinecap="round"/>
//       {/* Dimmer arc */}
//       <path d="M8 30C8 30 12 36 24 36C36 36 40 30 40 30" stroke="#bb1403" strokeWidth="2" strokeLinecap="round" fill="none"/>
//     </svg>
//   ),
//   iconSmall: (
//     <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
//       {/* Simplified light bulb for small icon */}
//       <path d="M24 10C18.5 10 15 14 15 19C15 22.5 17 25 18.5 27V31C18.5 32.1 19.4 33 20.5 33H27.5C28.6 33 29.5 32.1 29.5 31V27C31 25 33 22.5 33 19C33 14 29.5 10 24 10Z" stroke="#bb1403" strokeWidth="2" fill="none"/>
//       <path d="M20 37H28" stroke="#bb1403" strokeWidth="2" strokeLinecap="round"/>
//       <circle cx="24" cy="20" r="2" fill="#bb1403"/>
//       <path d="M36 16L39 19M39 16L36 19" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round"/>
//       <path d="M12 16L9 19M9 16L12 19" stroke="#bb1403" strokeWidth="1.5" strokeLinecap="round"/>
//     </svg>
//   ),
//   label: 'Luxury lighting & Dimming',
// },
// ]

// const DiscoverBtn = () => (
//   <Link
//     href="/contact"
//     className="inline-flex items-center gap-2 bg-[#bb1403] hover:bg-[#9e1102] text-white px-6 py-2.5 rounded-full text-md font-semibold no-underline whitespace-nowrap font-['Barlow',sans-serif] transition-colors duration-150"
//   >
//     Get Started Now
//     <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
//       <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   </Link>
// );


// export default function Hero() {
//   const [current, setCurrent] = useState(0)
//   const heroRef = useRef(null)
//   const contentRef = useRef(null)
//   const tagRef = useRef(null)
//   const titleRef = useRef(null)
//   const descRef = useRef(null)
//   const ctaRef = useRef(null)
//   const cardsRef = useRef(null)
//   const redBarRef = useRef(null)

//   const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
//   const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

//   useEffect(() => {
//     const t = setInterval(next, 6000)
//     return () => clearInterval(t)
//   }, [next])

//   const slide = SLIDES[current]

//   // GSAP Animations
//   useEffect(() => {
//     // Only run on client-side
//     if (typeof window === 'undefined') return

//     const ctx = gsap.context(() => {
//       // Set initial states
//       gsap.set([tagRef.current, titleRef.current, descRef.current, ctaRef.current], {
//         opacity: 0,
//         y: 30,
//       })
      
//       gsap.set(redBarRef.current, {
//         scaleY: 0,
//         transformOrigin: 'top',
//       })
      
//       gsap.set(cardsRef.current, {
//         opacity: 0,
//         y: 50,
//       })

//       // Animate red accent bar
//       gsap.to(redBarRef.current, {
//         scaleY: 1,
//         duration: 0.8,
//         ease: 'power2.out',
//         delay: 0.2,
//       })

//       // Animate content with stagger
//       const tl = gsap.timeline()
//       tl.to(tagRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.6,
//         ease: 'power2.out',
//       })
//       .to(titleRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.6,
//         ease: 'power2.out',
//       }, '-=0.3')
//       .to(descRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.6,
//         ease: 'power2.out',
//       }, '-=0.4')
//       .to(ctaRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.5,
//         ease: 'back.out(0.8)',
//       }, '-=0.3')

//       // Animate background with subtle scale on load
//       const bgImage = document.querySelector('.hero-bg-image')
//       if (bgImage) {
//         gsap.fromTo(bgImage,
//           { scale: 1.1 },
//           { scale: 1, duration: 1.2, ease: 'power2.out' }
//         )
//       }

//       // ScrollTrigger for feature cards
//       if (cardsRef.current) {
//         ScrollTrigger.create({
//           trigger: cardsRef.current,
//           start: 'top 85%',
//           end: 'top 65%',
//           onEnter: () => {
//             gsap.to(cardsRef.current, {
//               opacity: 1,
//               y: 0,
//               duration: 0.8,
//               ease: 'back.out(0.6)',
//             })
//           },
//           once: true,
//         })
//       }

//       // Parallax effect on scroll for hero background
//       if (heroRef.current) {
//         ScrollTrigger.create({
//           trigger: heroRef.current,
//           start: 'top top',
//           end: 'bottom top',
//           scrub: 1,
//           onUpdate: (self) => {
//             const progress = self.progress
//             const bgElement = document.querySelector('.hero-bg-image')
//             if (bgElement) {
//               gsap.set(bgElement, {
//                 y: progress * 150,
//                 scale: 1 + progress * 0.1,
//               })
//             }
//           },
//         })
//       }

//       // Subtle fade effect on scroll for hero content
//       if (heroRef.current && contentRef.current) {
//         ScrollTrigger.create({
//           trigger: heroRef.current,
//           start: 'top top',
//           end: 'bottom 20%',
//           scrub: 1,
//           onUpdate: (self) => {
//             const progress = self.progress
//             gsap.set(contentRef.current, {
//               opacity: 1 - progress * 0.5,
//               y: progress * 50,
//             })
//           },
//         })
//       }

//     }, heroRef)

//     return () => {
//       ctx.revert()
//       ScrollTrigger.getAll().forEach(trigger => trigger.kill())
//     }
//   }, [])

//   // Animate slide transitions
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Animate content out and in for slide changes
//       gsap.to([tagRef.current, titleRef.current, descRef.current, ctaRef.current], {
//         opacity: 0,
//         y: -20,
//         duration: 0.3,
//         stagger: 0.05,
//         onComplete: () => {
//           gsap.to([tagRef.current, titleRef.current, descRef.current, ctaRef.current], {
//             opacity: 1,
//             y: 0,
//             duration: 0.5,
//             stagger: 0.1,
//             ease: 'back.out(0.6)',
//           })
//         }
//       })

//       // Animate background transition
//       const bgImage = document.querySelector('.hero-bg-image')
//       if (bgImage) {
//         gsap.fromTo(bgImage,
//           { scale: 1.1 },
//           { scale: 1, duration: 0.8, ease: 'power2.out' }
//         )
//       }

//     }, [current])

//     return () => ctx.revert()
//   }, [current])

//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600;700&display=swap"
//         rel="stylesheet"
//       />

//       <div ref={heroRef} className="relative font-['Barlow',sans-serif] mb-0 md:mb-[90px]">

//         <div className="relative w-full min-h-[700px] md:min-h-[940px] h-auto md:h-screen overflow-hidden">

//         <div
//             className="absolute inset-0 bg-center bg-cover md:bg-cover bg-no-repeat transition-all duration-700 scale-100"
//             style={{
//               backgroundImage: `url(${slide.bg})`,
//             }}
//           />


//           {/* Dark overlay with gradient animation */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[rgba(5,10,20,0.90)] via-[rgba(5,10,20,0.60)] to-[rgba(5,10,20,0.30)]" />

//           {/* Red left accent bar */}
//           <div 
//             ref={redBarRef}
//             className="absolute left-0 top-0 bottom-0 w-1 bg-[#bb1403]"
//           />

//           {/* Slide content */}
//           <div 
//             ref={contentRef}
//             className="relative z-10 h-full flex flex-col justify-center px-2 md:px-0 max-w-7xl mx-auto pt-52 pb-20 md:pt-0 md:pb-0 md:mt-14"
//           >

//             {/* Tag */}
//             <div 
//               ref={tagRef}
//               className="flex items-center gap-2 text-[12px] font-bold tracking-[0.15em] text-white/70 uppercase font-['Barlow',sans-serif]"
//             >
//               <span className="inline-block w-5 h-0.5 bg-[#bb1403] rounded-sm flex-shrink-0" />
//               <svg viewBox="0 0 18 18" fill="none" width="13" height="13">
//                 <rect x="1" y="1" width="7" height="7" rx="1" fill="#bb1403" opacity="0.7" />
//                 <rect x="10" y="1" width="7" height="7" rx="1" fill="#bb1403" />
//                 <rect x="1" y="10" width="7" height="7" rx="1" fill="#bb1403" />
//                 <rect x="10" y="10" width="7" height="7" rx="1" fill="#bb1403" opacity="0.7" />
//               </svg>
//               {slide.tag}
//             </div>

//             {/* Headline */}
//             <h1
//               ref={titleRef}
//               className="font-['Barlow_Condensed',sans-serif] font-bold uppercase text-white leading-relaxed md:leading-[62px] tracking-[0.5px] whitespace-pre-line mt-4 mb-4 max-w-[600px]"
//               style={{ fontSize: 'clamp(32px, 5.2vw, 68px)' }}
//             >
//               {slide.title}
//             </h1>

//             {/* Description */}
//             <p
//               ref={descRef}
//               className="text-white/70 leading-7 max-w-[460px] mb-6 font-['Barlow',sans-serif]"
//               style={{ fontSize: 'clamp(14px, 1.15vw, 16px)' }}
//             >
//               {slide.desc}
//             </p>

//             {/* CTA row */}
//             <div ref={ctaRef}>
//               <DiscoverBtn href={slide.ctaLink} />
//             </div>
//           </div>
//         </div>

//        {/* Feature cards */}
// <div
//   ref={cardsRef}
//   className="
//     relative z-30 mx-4 -mt-20 rounded-[20px] shadow-[0_8px_48px_rgba(0,0,0,0.14)]
//     md:absolute md:-bottom-32 md:left-[clamp(40px,7vw,120px)] md:right-[clamp(40px,7vw,120px)]
//     md:translate-y-1/2 md:mx-0 md:mt-0 md:max-w-3xl
//   "
// >
//   <div className="grid grid-cols-3 bg-white rounded-[20px] overflow-hidden border border-gray-100">
//     {FEATURES.map((f, i) => (
//       <div
//         key={i}
//         className={[
//           'flex flex-col items-start gap-4 sm:gap-2.5 py-6 sm:py-0 sm:px-0 px-6 p-6 md:p-10 hover:bg-gray-50 transition-all duration-300 cursor-default',
//           i < FEATURES.length - 1
//             ? 'border-b border-gray-100 sm:border-b-0 sm:border-r sm:border-gray-100'
//             : '',
//         ].join(' ')}
//       >
//         <div className="flex-shrink-0 sm:hidden group-hover:scale-110 transition-transform duration-300">{f.iconSmall}</div>
//         <div className="hidden sm:block group-hover:scale-110 transition-transform duration-300">{f.icon}</div>

//         <div className="font-['Barlow',sans-serif] font-bold text-md sm:text-lg text-gray-900 leading-snug group-hover:text-[#bb1403] transition-colors duration-300">
//           {f.label}
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
//       </div>
//     </>
//   )
// }

// resources/js/Components/Hero.jsx

import { Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'

export default function Hero({ items }) {
  const [current, setCurrent] = useState(0)
  
  const activeItems = items?.filter(item => item.is_active).sort((a, b) => a.order - b.order) || []
  const currentItem = activeItems[current]

  useEffect(() => {
    if (activeItems.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeItems.length])

  if (!activeItems.length) return null

  const features = [
    'Integrated Surveillance & Security',
    'Fire Detection & Suppression',
    'Smart Lighting & Automation'
  ]

  return (
    <div className="relative min-h-[700px] md:min-h-[940px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(/storage/${currentItem.image})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
      
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600" />
      
      <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 max-w-7xl mx-auto pt-52 pb-20">
        <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-white/80 uppercase mb-2">
          <span className="w-6 h-0.5 bg-red-600 rounded-full" />
          {currentItem.tag}
        </div>
        
        <h1 className="font-bold text-white text-4xl md:text-7xl leading-tight max-w-3xl mt-4 mb-5">
          {currentItem.title}
        </h1>
        
        <p className="text-white/80 text-base md:text-lg max-w-xl mb-8">
          {currentItem.description}
        </p>
        
        <Link 
          href={currentItem.button_link}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold w-fit transition-all hover:scale-105"
        >
          {currentItem.button_text}
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        
        {activeItems.length > 1 && (
          <div className="flex gap-2 mt-8">
            {activeItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`transition-all rounded-full ${
                  idx === current ? 'w-8 h-1.5 bg-red-600' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="relative z-30 mx-4 -mt-20 md:absolute md:-bottom-32 md:left-10 md:right-10 lg:left-32 lg:right-32">
        <div className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl shadow-xl overflow-hidden">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={[
                'p-6 text-center hover:bg-gray-50 transition cursor-pointer group',
                i < 2 ? 'border-b sm:border-b-0 sm:border-r border-gray-200' : ''
              ].join(' ')}
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition">
                {feature}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}