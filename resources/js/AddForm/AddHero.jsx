import { Link } from '@inertiajs/react'
import { useState, useEffect, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SLIDES = [
  {
    id: 1,
    bg: '/images/hero2.jpg',
    tag: 'Premium Security Solutions',
    title: 'Advanced Protection for Your Assets',
    desc: 'State-of-the-art security systems designed to protect what matters most. From surveillance to access control, we deliver comprehensive solutions for businesses and homes across Nepal.',
    ctaLink: '/products',
    video: false,
  },
  {
    id: 2,
    bg: '/images/hero3.jpg',
    tag: 'Smart Automation',
    title: 'Intelligent Systems That Work For You',
    desc: 'Experience the future of living and working with our IoT and automation solutions. Smart lighting, climate control, and energy monitoring at your fingertips.',
    ctaLink: '/iot-automation',
    video: false,
  },
  {
    id: 3,
    bg: '/images/hero4.jpg',
    tag: 'Fire Safety First',
    title: 'Early Detection, Rapid Response',
    desc: 'Protect lives and property with our advanced fire detection and suppression systems. Compliant with international safety standards and tailored for Nepali infrastructure.',
    ctaLink: '/fire-safety',
    video: false,
  },
]

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
        <rect x="3" y="10" width="32" height="22" rx="3" stroke="#dc2626" strokeWidth="2" />
        <circle cx="19" cy="21" r="6" stroke="#dc2626" strokeWidth="2" />
        <circle cx="19" cy="21" r="2.5" fill="#dc2626" />
        <path d="M35 13 L45 9 L45 33 L35 29" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    iconSmall: (
      <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
        <rect x="3" y="10" width="32" height="22" rx="3" stroke="#dc2626" strokeWidth="2" />
        <circle cx="19" cy="21" r="6" stroke="#dc2626" strokeWidth="2" />
        <circle cx="19" cy="21" r="2.5" fill="#dc2626" />
        <path d="M35 13 L45 9 L45 33 L35 29" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Integrated Surveillance & Security',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
        <path d="M8 42 C8 30 14 26 16 16 C18 26 13 34 20 28 C22 34 20 42 8 42 Z" stroke="#dc2626" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="30" y1="4" x2="30" y2="12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="12" x2="37" y2="12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 16 L22 23" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M30 16 L30 24" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 16 L38 23" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M27 36 C27 29 30 25 34 25 C38 25 41 29 41 36 L41 39 L27 39 Z" stroke="#dc2626" strokeWidth="1.8" />
        <line x1="25" y1="39" x2="43" y2="39" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="42" r="2" fill="#dc2626" />
        <path d="M43 28 Q46 32 43 36" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M45 25 Q50 32 45 39" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    iconSmall: (
      <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
        <path d="M8 42 C8 30 14 26 16 16 C18 26 13 34 20 28 C22 34 20 42 8 42 Z" stroke="#dc2626" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="30" y1="4" x2="30" y2="12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="12" x2="37" y2="12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 16 L22 23" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M30 16 L30 24" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 16 L38 23" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M27 36 C27 29 30 25 34 25 C38 25 41 29 41 36 L41 39 L27 39 Z" stroke="#dc2626" strokeWidth="1.8" />
        <line x1="25" y1="39" x2="43" y2="39" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="42" r="2" fill="#dc2626" />
        <path d="M43 28 Q46 32 43 36" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M45 25 Q50 32 45 39" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: 'Fire Detection & Suppression',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
        <path d="M24 8C18 8 14 12.5 14 18C14 22 16 25 18 27V31C18 32.1 18.9 33 20 33H28C29.1 33 30 32.1 30 31V27C32 25 34 22 34 18C34 12.5 30 8 24 8Z" stroke="#dc2626" strokeWidth="2" fill="none"/>
        <path d="M19 37H29" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 41H27" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="21" r="2" fill="#dc2626"/>
        <path d="M38 14L42 18M42 14L38 18" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 14L10 18M10 14L6 18" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 30C8 30 12 36 24 36C36 36 40 30 40 30" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    iconSmall: (
      <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
        <path d="M24 10C18.5 10 15 14 15 19C15 22.5 17 25 18.5 27V31C18.5 32.1 19.4 33 20.5 33H27.5C28.6 33 29.5 32.1 29.5 31V27C31 25 33 22.5 33 19C33 14 29.5 10 24 10Z" stroke="#dc2626" strokeWidth="2" fill="none"/>
        <path d="M20 37H28" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="2" fill="#dc2626"/>
        <path d="M36 16L39 19M39 16L36 19" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 16L9 19M9 16L12 19" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Smart Lighting & Automation',
  },
]

const DiscoverBtn = ({ href = '/contact' }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-8 py-3 rounded-md text-md font-semibold no-underline transition-all duration-200 hover:scale-105 hover:shadow-lg"
  >
    Get Started
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
);

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const tagRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const ctaRef = useRef(null)
  const cardsRef = useRef(null)
  const redBarRef = useRef(null)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = SLIDES[current]

  // GSAP Animations
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([tagRef.current, titleRef.current, descRef.current, ctaRef.current], {
        opacity: 0,
        y: 30,
      })
      
      gsap.set(redBarRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
      })
      
      gsap.set(cardsRef.current, {
        opacity: 0,
        y: 50,
      })

      // Animate red accent bar
      gsap.to(redBarRef.current, {
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2,
      })

      // Animate content with stagger
      const tl = gsap.timeline()
      tl.to(tagRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .to(descRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(0.8)',
      }, '-=0.3')

      // Animate background with subtle scale on load
      const bgImage = document.querySelector('.hero-bg-image')
      if (bgImage) {
        gsap.fromTo(bgImage,
          { scale: 1.1 },
          { scale: 1, duration: 1.2, ease: 'power2.out' }
        )
      }

      // ScrollTrigger for feature cards
      if (cardsRef.current) {
        ScrollTrigger.create({
          trigger: cardsRef.current,
          start: 'top 85%',
          end: 'top 65%',
          onEnter: () => {
            gsap.to(cardsRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'back.out(0.6)',
            })
          },
          once: true,
        })
      }

      // Parallax effect on scroll for hero background
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const bgElement = document.querySelector('.hero-bg-image')
            if (bgElement) {
              gsap.set(bgElement, {
                y: progress * 150,
                scale: 1 + progress * 0.1,
              })
            }
          },
        })
      }

      // Subtle fade effect on scroll for hero content
      if (heroRef.current && contentRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(contentRef.current, {
              opacity: 1 - progress * 0.5,
              y: progress * 50,
            })
          },
        })
      }

    }, heroRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Animate slide transitions
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content out and in for slide changes
      gsap.to([tagRef.current, titleRef.current, descRef.current, ctaRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          gsap.to([tagRef.current, titleRef.current, descRef.current, ctaRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(0.6)',
          })
        }
      })

      // Animate background transition
      const bgImage = document.querySelector('.hero-bg-image')
      if (bgImage) {
        gsap.fromTo(bgImage,
          { scale: 1.1 },
          { scale: 1, duration: 0.8, ease: 'power2.out' }
        )
      }

    }, [current])

    return () => ctx.revert()
  }, [current])

  // Manual navigation handlers
  const handlePrev = () => prev()
  const handleNext = () => next()

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div ref={heroRef} className="relative font-['Inter',sans-serif] mb-0 md:mb-[90px]">

        <div className="relative w-full min-h-[700px] md:min-h-[940px] h-auto md:h-screen overflow-hidden">

          {/* Background Image */}
          <div
            className="hero-bg-image absolute inset-0 bg-center bg-cover md:bg-cover bg-no-repeat transition-all duration-700"
            style={{
              backgroundImage: `url(${slide.bg})`,
            }}
          />

          {/* Dark overlay - matching product form modal styling */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />

          {/* Red left accent bar - using dc2626 color from product form */}
          <div 
            ref={redBarRef}
            className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#dc2626]"
          />

          {/* Slide content */}
          <div 
            ref={contentRef}
            className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 max-w-7xl mx-auto pt-52 pb-20 md:pt-0 md:pb-0"
          >

            {/* Tag */}
            <div 
              ref={tagRef}
              className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-white/80 uppercase mb-2"
            >
              <span className="inline-block w-6 h-0.5 bg-[#dc2626] rounded-full" />
              <svg viewBox="0 0 18 18" fill="none" width="14" height="14">
                <rect x="1" y="1" width="7" height="7" rx="1" fill="#dc2626" opacity="0.7" />
                <rect x="10" y="1" width="7" height="7" rx="1" fill="#dc2626" />
                <rect x="1" y="10" width="7" height="7" rx="1" fill="#dc2626" />
                <rect x="10" y="10" width="7" height="7" rx="1" fill="#dc2626" opacity="0.7" />
              </svg>
              {slide.tag}
            </div>

            {/* Headline */}
            <h1
              ref={titleRef}
              className="font-bold text-white leading-[1.2] md:leading-[1.2] tracking-tight whitespace-pre-line mt-4 mb-5 max-w-[700px]"
              style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
            >
              {slide.title}
            </h1>

            {/* Description */}
            <p
              ref={descRef}
              className="text-white/80 leading-relaxed max-w-[500px] mb-8 font-medium"
              style={{ fontSize: 'clamp(15px, 1.2vw, 18px)' }}
            >
              {slide.desc}
            </p>

            {/* CTA row */}
            <div ref={ctaRef}>
              <DiscoverBtn href={slide.ctaLink} />
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2 mt-8">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === current 
                      ? 'w-8 h-1.5 bg-[#dc2626]' 
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Feature cards - styled to match product form aesthetics */}
        <div
          ref={cardsRef}
          className="
            relative z-30 mx-4 -mt-20 rounded-xl shadow-xl
            md:absolute md:-bottom-32 md:left-[clamp(40px,7vw,120px)] md:right-[clamp(40px,7vw,120px)]
            md:translate-y-1/2 md:mx-0 md:mt-0 md:max-w-4xl
          "
        >
          <div className="grid grid-cols-3 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={[
                  'flex flex-col items-start gap-3 sm:gap-4 py-6 sm:py-6 px-5 sm:px-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer group',
                  i < FEATURES.length - 1
                    ? 'border-b border-gray-100 sm:border-b-0 sm:border-r sm:border-gray-200'
                    : '',
                ].join(' ')}
              >
                <div className="flex-shrink-0 sm:hidden group-hover:scale-110 transition-transform duration-300">
                  {f.iconSmall}
                </div>
                <div className="hidden sm:block group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>

                <div className="font-semibold text-sm sm:text-base text-gray-900 leading-snug group-hover:text-[#dc2626] transition-colors duration-300">
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}