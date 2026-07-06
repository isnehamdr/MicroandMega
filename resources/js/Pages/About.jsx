import Mission from '@/M&M/Mission'
import SecurityAbout from '@/M&M/Securityabout'
// import Team from '@/M&M/Team'
import Wwhatwedo from '@/M&M/Whatwedo'
import WhyChooseUs from '@/M&M/WhyChooseUs'
import {Link} from '@inertiajs/react'
import {Head} from '@inertiajs/react'
import React from 'react'

const About = () => {
	return (
		<>
		<Head>
				<title>About Us | Micro & Mega Security Nepal</title>
				<meta
					name="description"
					content="Learn about Micro & Mega Security, a leading CCTV and security solution provider in Nepal. Trusted for advanced surveillance and protection systems."
				/>
				<meta name="keywords" content="About CCTV Nepal, Security Company Kathmandu, Micro and Mega, Surveillance Nepal" />

				<link rel="canonical" href="https://micronmega.saitsolution.com.np/about" />

				{/* Open Graph */}
				<meta property="og:title" content="About Us | Micro & Mega Security Nepal" />
				<meta property="og:description" content="Trusted CCTV and security solution provider in Nepal." />
				<meta property="og:url" content="https://micronmega.saitsolution.com.np/about" />
				<meta property="og:type" content="website" />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<div className="relative flex min-h-[320px] items-center justify-center bg-[url('/images/about-bg.jpg')] bg-cover bg-center bg-no-repeat px-6 py-12 sm:min-h-[420px] sm:py-20 lg:min-h-[550px] lg:bg-fixed">
				<div className="absolute inset-0 bg-gray-900/70 pointer-events-none"/>
				<div className="relative z-20 flex flex-col items-center text-center">
					<h2 className="text-4xl font-extrabold uppercase text-white sm:text-5xl lg:text-6xl">About Us</h2>
					<h3 className="mt-2 text-sm font-semibold text-white sm:text-base lg:text-xl">
<Link href="/" className="hover:text-red-500 transition-colors duration-300">Home</Link>
						<span className="mx-2">/</span>
						<span>About us</span>
					</h3>

				</div>


			</div>


			<SecurityAbout/>
			<Mission/>
			<WhyChooseUs/>
			<Wwhatwedo/>
			{/* <Team/> */}


		</>
	)
}

export default About
