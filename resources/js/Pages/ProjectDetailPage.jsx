// import { useEffect, useState } from "react";
// import { usePage, Link, router } from "@inertiajs/react";
// import axios from "axios";
// import {
//     MapPin, Star, Calendar, Building2, ArrowLeft,
//     ShieldCheck, Zap, AlertTriangle, Lightbulb, Package,
//     Phone, Mail, ChevronRight, CheckCircle2,
//     Wifi, Tag, ArrowUp,
// } from "lucide-react";

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const imgurl = import.meta.env.VITE_IMAGE_PATH;
// function StarRating({ rating, size = 16 }) {
//     return (
//         <div className="flex items-center gap-0.5">
//             {Array.from({ length: 5 }).map((_, i) => (
//                 <Star
//                     key={i}
//                     size={size}
//                     className={i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
//                 />
//             ))}
//         </div>
//     );
// }

// function CheckItem({ text, dark = false }) {
//     return (
//         <li className={`flex items-start gap-2.5 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
//             <CheckCircle2 size={14} className={`flex-shrink-0 mt-0.5 ${dark ? "text-red-400" : "text-red-500"}`} />
//             <span className="leading-relaxed">{text}</span>
//         </li>
//     );
// }

// // ── Scroll to Top Button Component ──
// function ScrollToTopButton() {
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         const toggleVisibility = () => {
//             if (window.pageYOffset > 300) {
//                 setIsVisible(true);
//             } else {
//                 setIsVisible(false);
//             }
//         };

//         window.addEventListener('scroll', toggleVisibility);

//         return () => window.removeEventListener('scroll', toggleVisibility);
//     }, []);

//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     };

//     return (
//         <>
//             {isVisible && (
//                 <button
//                     onClick={scrollToTop}
//                     className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                     aria-label="Scroll to top"
//                 >
//                     <ArrowUp size={20} />
//                 </button>
//             )}
//         </>
//     );
// }

// function orderByOldestFirst(list) {
//     if (!Array.isArray(list)) return list;
//     return [...list].sort((a, b) => {
//         const aKey = a?.created_at ?? a?.createdAt ?? a?.id;
//         const bKey = b?.created_at ?? b?.createdAt ?? b?.id;

//         const aTime = aKey ? new Date(aKey).getTime() : NaN;
//         const bTime = bKey ? new Date(bKey).getTime() : NaN;

//         if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) return aTime - bTime;
//         if (typeof aKey === "number" && typeof bKey === "number") return aKey - bKey;
//         return 0;
//     });
// }
// // Sidebar

// function Sidebar({ project }) {
//     const details = [
//         { icon: Building2, label: "Project Name", value: project?.name },
//         { icon: MapPin,    label: "Location",     value: project?.location },
//         { icon: Calendar,  label: "Year",          value: project?.year },
//         { icon: ShieldCheck, label: "Category",    value: project?.category },
//         { icon: ShieldCheck, label: "Contract Type", value: project?.contractType },
//     ];

//     return (
//         <aside className="flex flex-col gap-5">

//             {/* Project Details */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 px-5 py-3.5 flex items-center gap-2">
//                     <ShieldCheck size={14} className="text-red-400" />
//                     <h3 className="text-xs font-black text-white uppercase tracking-widest">Project Details</h3>
//                 </div>
//                 <div className="p-5 flex flex-col divide-y divide-gray-50">
//                     {details.filter(d => d.value).map(({ icon: Icon, label, value }) => (
//                         <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
//                             <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//                                 <Icon size={14} className="text-red-600" />
//                             </div>
//                             <div>
//                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
//                                 <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">{value}</p>
//                             </div>
//                         </div>
//                     ))}
//                     {/* Rating row */}
//                     {project?.rating && (
//                         <div className="flex items-start gap-3 py-3 last:pb-0">
//                             <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//                                 <Star size={14} className="text-amber-500" />
//                             </div>
//                             <div>
//                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Rating</p>
//                                 <div className="mt-1.5">
//                                     <StarRating rating={project.rating} size={13} />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* EPC Scope */}
//             {project?.epc?.items?.length > 0 && (
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 px-5 py-3.5 flex items-center gap-2">
//                     <Zap size={14} className="text-red-400" />
//                     <h3 className="text-xs font-black text-white uppercase tracking-widest">EPC Scope</h3>
//                 </div>
//                     <ul className="p-5 flex flex-col gap-2">
//                         {project.epc.items.map((item) => (
//                             <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
//                                 <ChevronRight size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
//                                 {item}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Contact CTA */}
//             <div className="rounded-2xl overflow-hidden relative"
//                 style={{
//                     backgroundImage: `url('${project?.image || "/images/about-bg.jpg"}')`,
//                     backgroundSize: "cover", backgroundPosition: "center",
//                 }}>
//                 <div className="absolute inset-0 bg-gray-950/85" />
//                 <div className="relative z-10 p-5 flex flex-col gap-4">
//                     <img src="/images/logo.png" alt="MNM" className="w-10 h-10"
//                         onError={(e) => { e.target.style.display = "none"; }} />
//                     <p className="text-white font-black text-base leading-snug">Need help? We're here for you</p>
//                     <div className="flex flex-col gap-2">
//                         <a href="mailto:info@mnm.com.np"
//                             className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5">
//                             <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
//                                 <Mail size={13} className="text-white" />
//                             </div>
//                             <span className="text-white text-xs font-medium">info@mnm.com.np</span>
//                         </a>
//                         <a href="tel:+97701-4535104"
//                             className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5">
//                             <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
//                                 <Phone size={13} className="text-white" />
//                             </div>
//                             <span className="text-white text-xs font-medium">+977 01-4535104</span>
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </aside>
//     );
// }

// // ── Loading / Error States ─────────────────────────────────────────────────────

// function LoadingState() {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//                 <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto" />
//                 <p className="mt-4 text-sm text-gray-500 font-medium">Loading project details…</p>
//             </div>
//         </div>
//     );
// }

// function ErrorState({ message }) {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="text-center max-w-sm px-6">
//                 <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <AlertTriangle size={24} className="text-red-600" />
//                 </div>
//                 <h2 className="text-xl font-black text-gray-900 mb-2">Project Not Found</h2>
//                 <p className="text-sm text-gray-500 mb-6">{message || "This project does not exist or may have been removed."}</p>
//                 <Link href="/projects-page"
//                     className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
//                     <ArrowLeft size={14} />
//                     Back to Projects
//                 </Link>
//             </div>
//         </div>
//     );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────

// export default function ProjectDetailPage() {
//     const { project: initialProject, error: pageError, slug } = usePage().props;
//     const [project, setProject] = useState(initialProject || null);
//     const [loading, setLoading] = useState(!initialProject && !pageError);
//     const [error, setError] = useState(pageError || null);

//     useEffect(() => {
//         if (!initialProject && !pageError && slug) {
//             setLoading(true);
//             axios.get(`/ourprojects/${slug}`)
//                 .then(res => setProject(res.data))
//                 .catch(() => setError("Project not found"))
//                 .finally(() => setLoading(false));
//         }
//     }, [slug, initialProject, pageError]);

//     // FIXED: Scroll to top when project data is fully loaded
//     useEffect(() => {
//         // Only scroll when we have project data and not loading
//         if (project && !loading) {
//             // Use requestAnimationFrame to ensure DOM is ready
//             requestAnimationFrame(() => {
//                 window.scrollTo({
//                     top: 0,
//                     behavior: 'smooth'
//                 });
//             });
//         }
//     }, [project, loading]); // Dependencies ensure scroll after data loads

//     if (loading) return <LoadingState />;
//     if (error || !project) return <ErrorState message={error} />;

//     const orderedProducts = orderByOldestFirst(project.products);

//     return (
//         <>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap');
//                 body, * { font-family: 'Barlow', sans-serif; }
//             `}</style>

//             {/* Scroll to Top Button */}
//             <ScrollToTopButton />

//             {/* ── Hero Banner ─────────────────────────────────────────────── */}
//             <div className="relative flex min-h-[220px] sm:min-h-[380px] lg:min-h-[500px] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-12 lg:bg-fixed"
//                 style={{ backgroundImage: "url('/images/about-bg.jpg')" }}>
//                 <div className="absolute inset-0 bg-gray-900/75 pointer-events-none" />
//           {/* Decorative accent */}
//                 <div className="relative z-20 flex flex-col items-center text-center gap-3 max-w-3xl mt-24">

//                     <h1 className="text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight leading-none">
//                         {project.name}
//                     </h1>

//                     {/* Breadcrumb */}
//                     <nav className="flex items-center gap-2 text-md text-white/50 mt-1">
// <Link href="/" className="hover:text-red-500 transition-colors duration-300">Home</Link>
//                         <ChevronRight size={11} />
//                         <Link href="/projects-page" className="hover:text-red-400 transition-colors">Projects</Link>
//                         <ChevronRight size={11} />
//                         <span className="text-red-400 font-semibold truncate max-w-[160px]">{project.name}</span>
//                     </nav>
//                 </div>
//             </div>

//             {/* ── Body ─────────────────────────────────────────────────────── */}
//             <div className="bg-gray-50 min-h-screen">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

//                     {/* Back Link */}
//                     <Link href="/projects-page"
//                         className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors mb-8 group">
//                         <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
//                         Back to Projects
//                     </Link>

//                     {/* ── 2-column grid: main + sidebar ── */}
//                     <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 items-start">

//                         {/* ── LEFT: Main Content ─────────────────────────── */}
//                         <div className="flex flex-col gap-8 min-w-0">

//                             {/* Quick Stats Row */}
//                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                                 {[
//                                     { icon: MapPin,    label: "Location",  value: project.location },
//                                     { icon: Calendar,  label: "Year",      value: project.year },
//                                     { icon: Building2, label: "Category",  value: project.category },
//                                     { icon: Star,      label: "Rating",    value: null, rating: project.rating },
//                                 ].filter(s => s.value || s.rating).map(({ icon: Icon, label, value, rating }) => (
//                                     <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
//                                         <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
//                                             <Icon size={14} className="text-red-600" />
//                                         </div>
//                                         <div className="min-w-0">
//                                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
//                                             {rating
//                                                 ? <StarRating rating={rating} size={13} />
//                                                 : <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">{value}</p>
//                                             }
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Hero Image */}
//                             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                                 <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
//                                     <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Project Gallery</h2>
//                                     <span className="text-xs text-gray-400 font-medium">Main Image</span>
//                                 </div>
//                                 <div className="p-4">
//                                     <div className="rounded-xl overflow-hidden bg-gray-100">
//                                         <img
// src={project.image ? `${imgurl}/${project.image}` : "/placeholder-image.jpg"}
//                                             alt={project.name}
//                                             className="w-full h-64 sm:h-80 object-cover"
//                                         />
//                                     </div>
//                                     {/* Extra gallery images if available */}
//                                     {project.overviewImage && project.overviewImage !== project.image && (
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
//                                          {[project.overviewImage, project.solutionImage].filter(Boolean).map((img, i) => (
//     <div key={i} className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
//         <img src={`${imgurl}/${img}`} alt="" className="w-full h-full object-cover" />
//     </div>
// ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Project Overview */}
//                             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                                 <div className="px-6 py-4 border-b border-gray-100">
//                                     <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Project Overview</h2>
//                                 </div>
//                                 <div className="p-6">
//                                     <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
//                                     {project.fiber && (
//                                         <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 mt-4">
//                                             <Wifi size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
//                                             <p className="text-sm text-red-700 font-semibold">{project.fiber}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Overview Details (dark card) */}
//                             {(project.overviewDescription || project.highlights?.length > 0) && (
//                                 <div className="rounded-2xl overflow-hidden shadow-sm"
//                                     style={{ background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)" }}>
//                                     <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
//                                         <ShieldCheck size={14} className="text-red-400" />
//                                         <h2 className="text-sm font-black text-white uppercase tracking-wide">Technical Overview</h2>
//                                     </div>
//                                     <div className="p-6 flex flex-col gap-5">
//                                         {project.overviewDescription && (
//                                             <p className="text-sm text-gray-300 leading-relaxed">{project.overviewDescription}</p>
//                                         )}
//                                         {project.highlights?.length > 0 && (
//                                             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
//                                                 {project.highlights.map((h) => (
//                                                     <CheckItem key={h} text={h} dark />
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Products Used */}
//                             {orderedProducts?.length > 0 && (
//                                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                                     <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
//                                         <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Products Used</h2>
//                                         <span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full">
//                                             {orderedProducts.length} items
//                                         </span>
//                                     </div>
//                                     <div className="p-5">
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                             {orderedProducts.map((prod, i) => (
//                                                 <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-red-200 transition-colors">
//                                                     <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
//                                                         <Package size={16} className="text-red-600" />
//                                                     </div>
//                                                     <div className="min-w-0">
//                                                         <p className="text-sm font-bold text-gray-900 truncate">{prod.name}</p>
//                                                         <p className="text-xs text-gray-500 mt-0.5">
//                                                             <span className="font-semibold text-red-600">{prod.brand}</span>
//                                                             {prod.qty && <span className="text-gray-400"> · {prod.qty}</span>}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Challenge & Solution */}
//                             {(project.challenge || project.solution) && (
//                                 <div className="grid sm:grid-cols-2 gap-4">
//                                     {project.challenge && (
//                                         <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//                                             <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
//                                                 <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                                                     <AlertTriangle size={14} className="text-white" />
//                                                 </div>
//                                                 <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Challenge</h3>
//                                             </div>
//                                             <p className="p-5 text-sm text-gray-500 leading-relaxed">{project.challenge}</p>
//                                         </div>
//                                     )}
//                                     {project.solution && (
//                                         <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//                                             <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
//                                                 <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                                                     <Lightbulb size={14} className="text-white" />
//                                                 </div>
//                                                 <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Solution</h3>
//                                             </div>
//                                             <p className="p-5 text-sm text-gray-500 leading-relaxed">{project.solution}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {/* Tags */}
//                             {project.tags?.length > 0 && (
//                                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <Tag size={13} className="text-gray-400" />
//                                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Tags</p>
//                                     </div>
//                                     <div className="flex flex-wrap gap-2">
//                                         {project.tags.map((tag) => (
//                                             <span key={tag}
//                                                 className="text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors cursor-default">
//                                                 {tag}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                         </div>

//                         {/* ── RIGHT: Sticky Sidebar ──────────────────────── */}
//                         <div className="lg:sticky lg:top-8 lg:self-start">
//                             <Sidebar project={project} />
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }


import {useEffect, useState} from "react";
import {usePage, Link, Head} from "@inertiajs/react";
import {
	MapPin,
	Calendar,
	Building2,
	ArrowLeft,
	ShieldCheck,
	Zap,
	AlertTriangle,
	Lightbulb,
	Package,
	Phone,
	Mail,
	ChevronRight,
	CheckCircle2,
	Wifi,
	Tag,
	ArrowUp,
	DotIcon
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const imgurl = import.meta.env.VITE_IMAGE_PATH;

function formatOrderPosition(order) {
	const value = Number(order);

	if (!Number.isInteger(value) || value < 1) {
		return null;
	}

	const remainder100 = value % 100;
	if (remainder100 >= 11 && remainder100 <= 13) {
		return `${value}th`;
	}

	switch (value % 10) {
		case 1:
			return `${value}st`;
		case 2:
			return `${value}nd`;
		case 3:
			return `${value}rd`;
		default:
			return `${value}th`;
	}
}

function CheckItem({
	text,
	dark = false
}) {
	return (<li className={
		`flex items-start gap-2.5 text-sm ${
			dark ? "text-gray-300" : "text-gray-600"
		}`
	}>
		<CheckCircle2 size={14}
			className={
				`flex-shrink-0 mt-0.5 ${
					dark ? "text-red-400" : "text-red-500"
				}`
			}/>
		<span className="leading-relaxed"> {text}</span>
	</li>);
}

// ── Scroll to Top Button ──────────────────────────────────────────────────────
function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setIsVisible(window.pageYOffset > 300);
		};
		window.addEventListener("scroll", toggleVisibility);
		return() => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({top: 0, behavior: "smooth"});
	};

	if (!isVisible) 
		return null;
	

	return (<button onClick={scrollToTop}
		className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
		aria-label="Scroll to top">
		<ArrowUp size={20}/>
	</button>);
}

function orderByOldestFirst(list) {
	if (!Array.isArray(list)) 
		return [];
	
	return [... list].sort((a, b) => {
		const aKey = a ?. created_at ?? a ?. createdAt ?? a ?. id;
		const bKey = b ?. created_at ?? b ?. createdAt ?? b ?. id;
		const aTime = aKey ? new Date(aKey).getTime() : NaN;
		const bTime = bKey ? new Date(bKey).getTime() : NaN;
		if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) 
			return aTime - bTime;
		
		if (typeof aKey === "number" && typeof bKey === "number") 
			return aKey - bKey;
		
		return 0;
	});
}

function asArray(value) {
	return Array.isArray(value) ? value : [];
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({project}) {
	const epcItems = asArray(project ?. epc ?. items);
	const details = [
		{
			icon: Building2,
			label: "Project Name",
			value: project ?. name
		},
		{
			icon: MapPin,
			label: "Location",
			value: project ?. location
		},
		{
			icon: Calendar,
			label: "Year",
			value: project ?. year
		},
		{
			icon: ShieldCheck,
			label: "Category",
			value: project ?. category
		}, {
			icon: ShieldCheck,
			label: "Contract Type",
			value: project ?. contractType
		},
	];

	return (<aside className="flex flex-col gap-5"> {/* Project Details */}
		<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
			<div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 px-5 py-3.5 flex items-center gap-2">
				<ShieldCheck size={14}
					className="text-red-400"/>
				<h3 className="text-xs font-black text-white uppercase tracking-widest">Project Details</h3>
			</div>
			<div className="p-5 flex flex-col divide-y divide-gray-50"> {
				details.filter(d => d.value).map(({icon: Icon, label, value}) => (<div key={label}
					className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
					<div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
						<Icon size={14}
							className="text-red-600"/>
					</div>
					<div>
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"> {label}</p>
						<p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug"> {value}</p>
					</div>
				</div>))
			}
				{
				formatOrderPosition(project ?. order) && (<div className="flex items-start gap-3 py-3 last:pb-0">
					<div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5"> {/* <Trophy size={14} className="text-amber-500" /> */}
						<ShieldCheck size={14}
							className="text-amber-500"/>
					</div>
					<div>
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project No.</p>
						<p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug"> {
							formatOrderPosition(project.order)
						} </p>
					</div>
				</div>)
			} </div>
		</div>

		{/* EPC Scope */}
		{
		epcItems.length > 0 && (<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
			<div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 px-5 py-3.5 flex items-center gap-2">
				<Zap size={14}
					className="text-red-400"/>
				<h3 className="text-xs font-black text-white uppercase tracking-widest">EPC Scope</h3>
			</div>
			<ul className="p-5 flex flex-col gap-2"> {
				epcItems.map((item) => (<li key={item}
					className="flex items-start gap-2 text-sm text-gray-700">
					<ChevronRight size={13}
						className="text-red-400 flex-shrink-0 mt-0.5"/> {item} </li>))
			} </ul>
		</div>)
	}

		{/* Contact CTA */}
		<div className="rounded-2xl overflow-hidden relative"
			style={
				{
						backgroundImage: `url('${
						project ?. image || "/images/about-bg.jpg"
					}')`,
					backgroundSize: "cover",
					backgroundPosition: "center"
				}
		}>
			<div className="absolute inset-0 bg-gray-950/85"/>
			<div className="relative z-10 p-5 flex flex-col gap-4">
				<img src="/images/logo.png" alt="MNM" className="w-10 h-10"
					onError={
						(e) => {
							e.target.style.display = "none";
						}
					}/>
				<p className="text-white font-black text-base leading-snug">Need help? We're here for you</p>
				<div className="flex flex-col gap-2">
					<a href="mailto:info@mnm.com.np" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5">
						<div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
							<Mail size={13}
								className="text-white"/>
						</div>
						<span className="text-white text-xs font-medium">info@mnm.com.np</span>
					</a>
					<a href="tel:+97701-4535104" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5">
						<div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
							<Phone size={13}
								className="text-white"/>
						</div>
						<span className="text-white text-xs font-medium">+977 01-4535104</span>
					</a>
				</div>
			</div>
		</div>
	</aside>);
}

// ── Loading / Error States ─────────────────────────────────────────────────────
function LoadingState() {
	return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
		<div className="text-center">
			<div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto"/>
			<p className="mt-4 text-sm text-gray-500 font-medium">Loading project details…</p>
		</div>
	</div>);
}

function ErrorState({message}) {
	return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
		<div className="text-center max-w-sm px-6">
			<div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
				<AlertTriangle size={24}
					className="text-red-600"/>
			</div>
			<h2 className="text-xl font-black text-gray-900 mb-2">Project Not Found</h2>
			<p className="text-sm text-gray-500 mb-6"> {
				message || "This project does not exist or may have been removed."
			}</p>
			<Link href="/projects-page" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
				<ArrowLeft size={14}/>
				Back to Projects
			</Link>
		</div>
	</div>);
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
	const pageProps = usePage().props || {};
	const project = pageProps.project && typeof pageProps.project === "object" ? pageProps.project : null;
	const error = pageProps.error || null;
	const seo = pageProps.seo && typeof pageProps.seo === "object" ? pageProps.seo : {};

	// Scroll to top once project data is ready
	useEffect(() => {
		if (project) {
			requestAnimationFrame(() => {
				window.scrollTo({top: 0, behavior: "smooth"});
			});
		}
	}, [project]);
	
	if (error || !project) 
		return <ErrorState message={error}/>;
	

	const orderedProducts = orderByOldestFirst(project.products);
	const highlights = asArray(project.highlights);
	const tags = asArray(project.tags);

	// ── SEO values (all derived from project data, no undefined `seo` reference) ──
	const seoTitle = seo.title || (project.title ? `${
		project.title
	} | Micro & Mega` : project.name ? `${
		project.name
	} | Micro & Mega` : "Project | Micro & Mega");

	const seoDescription = seo.description || (project.description ? project.description.slice(0, 155) : "View project details by Micro & Mega Nepal.");

	const seoImage = seo.image || (project.image ? `${imgurl}/${
		project.image
	}` : "/images/og-image.jpg");

	const seoUrl = seo.url || (typeof window !== "undefined" ? window.location.href : "");

	return (<>
		<Head>
			{/* <title> {seoTitle}</title> */}
			<meta name="description"
				content={seoDescription}/>
			{/* <meta name="robots" content="index, follow"/> {
			seoUrl && <link rel="canonical"
				href={seoUrl}/>
		} */}

			
			<meta property="og:type" content="website"/>
			<meta property="og:url"
				content={seoUrl}/>
			<meta property="og:title"
				content={seoTitle}/>
			<meta property="og:description"
				content={seoDescription}/>
			<meta property="og:image"
				content={seoImage}/> 
			<meta name="twitter:card" content="summary_large_image"/>
			<meta name="twitter:url"
				content={seoUrl}/>
			<meta name="twitter:title"
				content={seoTitle}/>
			<meta name="twitter:description"
				content={seoDescription}/>
			<meta name="twitter:image"
				content={seoImage}/>
		</Head>

		<style> {`
                @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap');
                body, * { font-family: 'Barlow', sans-serif; }
            `}</style>

		<ScrollToTopButton/> {/* ── Hero Banner ──────────────────────────────────────────────── */}
		<div className="relative flex min-h-[220px] sm:min-h-[380px] lg:min-h-[500px] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-12 lg:bg-fixed"
			style={
				{backgroundImage: "url('/images/about-bg.jpg')"}
		}>
			<div className="absolute inset-0 bg-gray-900/75 pointer-events-none"/>
			<div className="relative z-20 flex flex-col items-center text-center gap-3 max-w-3xl mt-24">
				<h1 className="text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight leading-none"> {
					project.name
				} </h1>
				{/* Breadcrumb */}
				<nav className="flex items-center gap-2 text-md text-white/50 mt-1" aria-label="Breadcrumb">
					<Link href="/" className="hover:text-red-500 transition-colors duration-300">Home</Link>
					<ChevronRight size={11}/>
					<Link href="/projects-page" className="hover:text-red-400 transition-colors">Projects</Link>
					<ChevronRight size={11}/>
					<span className="text-red-400 font-semibold truncate max-w-[160px]"> {
						project.name
					}</span>
				</nav>
			</div>
		</div>

		{/* ── Body ─────────────────────────────────────────────────────── */}
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14"> {/* Back Link */}
				<Link href="/projects-page" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors mb-8 group">
					<ArrowLeft size={15}
						className="group-hover:-translate-x-1 transition-transform"/>
					Back to Projects
				</Link>

				{/* ── 2-column grid: main + sidebar ── */}
				<div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 items-start"> {/* ── LEFT: Main Content ──────────────────────────── */}
					<div className="flex flex-col gap-8 min-w-0"> {/* Quick Stats Row */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3"> {
							[
								{
									icon: MapPin,
									label: "Location",
									value: project.location
								}, {
									icon: Calendar,
									label: "Year",
									value: project.year
								}, {
									icon: Building2,
									label: "Category",
									value: project.category
								}, {
									icon: DotIcon,
									label: "Position",
									value: formatOrderPosition(project.order)
								},
							].filter(s => s.value).map(({icon: Icon, label, value}) => (<div key={label}
								className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
								<div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
									<Icon size={14}
										className="text-red-600"/>
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"> {label}</p>
									<p className="text-sm font-bold text-gray-800 mt-0.5 truncate"> {value}</p>
								</div>
							</div>))
						} </div>

						{/* Hero Image */}
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
								<h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Project Gallery</h2>
								<span className="text-xs text-gray-400 font-medium">Main Image</span>
							</div>
							<div className="p-4">
								<div className="rounded-xl overflow-hidden bg-gray-100">
									<img src={
											project.image ? `${imgurl}/${
												project.image
											}` : "/placeholder-image.jpg"
										}
										alt={
											project.name
										}
										className="w-full h-64 sm:h-80 object-cover"/>
								</div>
								{/* Extra gallery images */}
								{
								project.overviewImage && project.overviewImage !== project.image && (<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3"> {
									[project.overviewImage, project.solutionImage].filter(Boolean).map((img, i) => (<div key={i}
										className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
										<img src={
												`${imgurl}/${img}`
											}
											alt=""
											className="w-full h-full object-cover"/>
									</div>))
								} </div>)
							} </div>
						</div>

						{/* Project Overview */}
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-100">
								<h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Project Overview</h2>
							</div>
							<div className="p-6">
								<p className="text-sm text-gray-600 leading-relaxed"> {
									project.description
								}</p>
								{
								project.fiber && (<div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 mt-4">
									<Wifi size={16}
										className="text-red-600 flex-shrink-0 mt-0.5"/>
									<p className="text-sm text-red-700 font-semibold"> {
										project.fiber
									}</p>
								</div>)
							} </div>
						</div>

						{/* Technical Overview (dark card) */}
						{
						(project.overviewDescription || highlights.length > 0) && (<div className="rounded-2xl overflow-hidden shadow-sm"
							style={
								{background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)"}
						}>
							<div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
								<ShieldCheck size={14}
									className="text-red-400"/>
								<h2 className="text-sm font-black text-white uppercase tracking-wide">Technical Overview</h2>
							</div>
							<div className="p-6 flex flex-col gap-5"> {
								project.overviewDescription && (<p className="text-sm text-gray-300 leading-relaxed"> {
									project.overviewDescription
								}</p>)
							}
								{
								highlights.length > 0 && (<ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5"> {
									highlights.map((h) => (<CheckItem key={h}
										text={h}
										dark/>))
								} </ul>)
							} </div>
						</div>)
					}

						{/* Products Used */}
						{
						orderedProducts ?. length > 0 && (<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
								<h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Products Used</h2>
								<span className="text-xs bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full"> {
									orderedProducts.length
								}
									items
								</span>
							</div>
							<div className="p-5">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {
									orderedProducts.map((prod, i) => (<div key={i}
										className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-red-200 transition-colors">
										<div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
											<Package size={16}
												className="text-red-600"/>
										</div>
										<div className="min-w-0">
											<p className="text-sm font-bold text-gray-900 truncate"> {
												prod.name
											}</p>
											<p className="text-xs text-gray-500 mt-0.5">
												<span className="font-semibold text-red-600"> {
													prod.brand
												}</span>
												{
												prod.qty && <span className="text-gray-400">
													· {
													prod.qty
												}</span>
											} </p>
										</div>
									</div>))
								} </div>
							</div>
						</div>)
					}

						{/* Challenge & Solution */}
						{
						(project.challenge || project.solution) && (<div className="grid sm:grid-cols-2 gap-4"> {
							project.challenge && (<div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
								<div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
									<div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
										<AlertTriangle size={14}
											className="text-white"/>
									</div>
									<h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Challenge</h3>
								</div>
								<p className="p-5 text-sm text-gray-500 leading-relaxed"> {
									project.challenge
								}</p>
							</div>)
						}
							{
							project.solution && (<div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
								<div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
									<div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
										<Lightbulb size={14}
											className="text-white"/>
									</div>
									<h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Solution</h3>
								</div>
								<p className="p-5 text-sm text-gray-500 leading-relaxed"> {
									project.solution
								}</p>
							</div>)
						} </div>)
					}

						{/* Tags */}
						{
						tags.length > 0 && (<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
							<div className="flex items-center gap-2 mb-3">
								<Tag size={13}
									className="text-gray-400"/>
								<p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Tags</p>
							</div>
							<div className="flex flex-wrap gap-2"> {
								tags.map((tag) => (<span key={tag}
									className="text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors cursor-default"> {tag} </span>))
							} </div>
						</div>)
					} </div>

					{/* ── RIGHT: Sticky Sidebar ─────────────────────────── */}
					<div className="lg:sticky lg:top-8 lg:self-start">
						<Sidebar project={project}/>
					</div>

				</div>
			</div>
		</div>
	</>);
}
