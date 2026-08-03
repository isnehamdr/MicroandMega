// import { useState, useEffect, useMemo, useRef } from "react";
// import {
//     AlertTriangle,
//     Bell,
//     Camera,
//     ChevronDown,
//     Flame,
//     Menu,
//     Radio,
//     Shield,
//     ShieldCheck,
//     Wifi,
//     X,
//     Fingerprint,
// } from "lucide-react";
// import { Link, usePage, Head } from "@inertiajs/react";
// import axios from "axios";
// import parse from "html-react-parser";

// const iconMap = {
//     "Access Control":           Fingerprint,
//     "Fire Alarm":               Flame,
//     "Public Address":           Radio,
//     "CCTV":                     Camera,
//     "Data Network":             Wifi,
//     "Control and Monitor System": Shield,
//     "Grounding ERT":            AlertTriangle,
//     "Digital Lighting":         Bell,
// };

// const imgurl = import.meta.env.VITE_IMAGE_PATH;

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

// function ItemCard({ image, title, description, label, onClick }) {
//     return (
//         <div
//             onClick={onClick}
//             className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-red-300 transition-all flex flex-col cursor-pointer group overflow-hidden"
//         >
//             <div className="w-full h-44 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
//                 {image ? (
//                     <img
//                         src={image}
//                         alt={title}
//                         className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
//                         onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
//                     />
//                 ) : (
//                     <Shield className="h-12 w-12 text-red-300" />
//                 )}
//             </div>
//             <div className="p-4 flex flex-col flex-1">
//                 <h4 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-red-700 transition-colors leading-snug">
//                     {title}
//                 </h4>
//                 {description && (
//                     <p className="text-xs text-gray-500 flex-1 mb-3 line-clamp-3 leading-relaxed">
//                         {description}
//                     </p>
//                 )}
//                 <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-red-600 uppercase tracking-wide">
//                     {label} →
//                 </span>
//             </div>
//         </div>
//     );
// }

// function DetailView({ item, type, onImageClick, onProductSelect }) {
//     const [activeImage,      setActiveImage]      = useState(null);
//     const [additionalImages, setAdditionalImages] = useState([]);

//     useEffect(() => {
//         let images = [];

//         if (type === "category") {
//             if (item.featured_image) {
//                 images.push({ src: `${imgurl}/${item.featured_image}`, type: "featured" });
//             }
//             if (item.additional_images && Array.isArray(item.additional_images)) {
//                 item.additional_images.forEach(img => {
//                     if (img?.image_path) images.push({ src: `${imgurl}/${img.image_path}`, type: "additional" });
//                 });
//             }
//         } else if (type === "product") {
//             if (item.featured_image) images.push({ src: `${imgurl}/${item.featured_image}`, type: "featured" });
//             if (item.images && Array.isArray(item.images)) {
//                 item.images.forEach(img => {
//                     if (img?.image_path) images.push({ src: `${imgurl}/${img.image_path}`, type: "additional" });
//                 });
//             }
//         }

//         const featured = images.find(img => img.type === "featured");
//         const others   = images.filter(img => img.type !== "featured");

//         setActiveImage(featured?.src || (images[0]?.src || null));
//         setAdditionalImages(others.slice(0, 6));
//     }, [item, type]);

//     const handleThumbnailClick = (image) => {
//         setActiveImage(image);
//         if (onImageClick) onImageClick(image);
//     };

//     return (
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//             <div className="px-5 pt-5 pb-3 border-b border-gray-100">
//                 {type === "product" && item.category?.name && (
//                     <h2 className="sm:text-3xl text-2xl text-red-600 font-bold mt-0.5 uppercase tracking-wide">
//                         {item.category.name}
//                     </h2>
//                 )}
//                 <h3 className="text-xl md:text-xl font-bold text-gray-900">
//                     {item.title || item.name}
//                 </h3>
//             </div>

//             {activeImage && (
//                 <div className="relative w-full">
//                     <div className="relative h-[150px] sm:h-[400px] md:h-[250px] w-full overflow-hidden">
//                         <img
//                             src={activeImage}
//                             alt={item.name || "Featured"}
//                             className="w-full h-full object-contain object-center"
//                             onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = "/images/firealram.jpg";
//                             }}
//                         />
//                     </div>
//                 </div>
//             )}

//             {additionalImages.length > 0 && (
//                 <div className="p-4 border-b border-gray-100 bg-gray-50">
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                         {additionalImages.map((img, idx) => (
//                             <button
//                                 key={idx}
//                                 onClick={() => handleThumbnailClick(img.src)}
//                                 className={`relative group rounded-lg overflow-hidden transition-all aspect-square ${
//                                     activeImage === img.src
//                                         ? "border-red-500 ring-2 ring-red-200 ring-offset-1"
//                                         : "border-gray-200 hover:border-red-300 hover:shadow-md"
//                                 }`}
//                             >
//                                 <img
//                                     src={img.src}
//                                     alt={`Gallery ${idx + 1}`}
//                                     className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = "/images/firealram.jpg";
//                                     }}
//                                 />
//                                 {activeImage === img.src && (
//                                     <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
//                                 )}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <div className="px-5 py-6">
//                 {item.content ? (
//                     <div className="prose prose-sm md:prose max-w-none">
//                         {parse(item.content)}
//                     </div>
//                 ) : item.description ? (
//                     <div className="text-gray-600 text-sm leading-relaxed space-y-2">
//                         <p>{item.description}</p>
//                     </div>
//                 ) : null}
//             </div>
//         </div>
//     );
// }

// function SidebarItem({ item, isOpen, onToggle, onCategorySelect, onProductSelect }) {
//     const Icon        = iconMap[item.name] || Shield;
//     const hasChildren = item.children?.length > 0;
//     const hasProducts = item.products?.length > 0;
//     const hasDropdown = hasChildren || hasProducts;

//     return (
//         <li className="border-b border-gray-100 last:border-0">
//             <div className="flex items-center w-full hover:bg-gray-50 transition-colors">
//                 <button
//                     onClick={() => onCategorySelect(item)}
//                     className="flex-1 flex items-center gap-2 px-3 py-2.5 text-left text-sm"
//                 >
//                     {item.icon_image ? (
//                         <img
//                             src={`${imgurl}/${item.icon_image}`}
//                             alt={item.name}
//                             className="h-5 w-5 rounded object-cover flex-shrink-0"
//                             onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
//                         />
//                     ) : (
//                         <Icon className="h-4 w-4 text-red-600 flex-shrink-0" />
//                     )}
//                     <span className="font-medium text-lg text-gray-800">{item.name}</span>
//                 </button>

//                 {hasDropdown && (
//                     <button
//                         onClick={(e) => { e.stopPropagation(); onToggle(); }}
//                         className="px-3 py-2.5 text-gray-400 hover:text-gray-600"
//                         aria-label="Toggle submenu"
//                     >
//                         <ChevronDown
//                             className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//                         />
//                     </button>
//                 )}
//             </div>

//             {isOpen && (
//                 <ul className="bg-gray-50 border-t border-gray-100">
//                     {item.children?.map((child) => (
//                         <li key={child.id || child.slug || child.name}>
//                             <button
//                                 onClick={() => onCategorySelect(child)}
//                                 className="w-full text-left px-6 py-2 text-sm text-gray-600 hover:text-red-700 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0"
//                             >
//                                 {child.name}
//                             </button>
//                         </li>
//                     ))}
//                     {item.products?.map((product) => (
//                         <li
//                             key={product.id || product.slug || product.name}
//                             onClick={() => onProductSelect(product)}
//                             className="px-6 py-2 text-lg text-gray-500 hover:text-red-700 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-1.5"
//                         >
//                             <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
//                             {product.name}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </li>
//     );
// }

// function Sidebar({ isMobileOpen, onClose, categories, onCategorySelect, onProductSelect }) {
//     const [openItems, setOpenItems] = useState({});
//     const toggle = (name) => setOpenItems((prev) => ({ ...prev, [name]: !prev[name] }));

//     return (
//         <>
//             {/* Mobile backdrop */}
//             {isMobileOpen && (
//                 <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
//             )}

//             <aside
//                 className={`
//                     fixed inset-y-0 left-0 z-50 w-72
//                     bg-white shadow-xl overflow-y-auto
//                     transition-transform duration-300
//                     ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//                     lg:static lg:z-auto lg:w-full
//                     lg:translate-x-0 lg:shadow-none
//                     lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto
//                 `}
//             >
//                 <div className="bg-gray-800 text-white py-3 px-4 flex items-center justify-between sticky top-0 z-10">
//                     <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
//                         <ShieldCheck className="h-8 w-8" /> Security Products
//                     </h3>
//                     <button
//                         onClick={onClose}
//                         className="lg:hidden text-white hover:text-gray-300 transition-colors"
//                         aria-label="Close sidebar"
//                     >
//                         <X className="h-6 w-6" />
//                     </button>
//                 </div>
//                 <nav className="border border-gray-200 border-t-0" aria-label="Product categories">
//                     <ul>
//                         {categories.map((item) => (
//                             <SidebarItem
//                                 key={item.name}
//                                 item={item}
//                                 isOpen={!!openItems[item.name]}
//                                 onToggle={() => toggle(item.name)}
//                                 onCategorySelect={onCategorySelect}
//                                 onProductSelect={onProductSelect}
//                             />
//                         ))}
//                     </ul>
//                 </nav>
//             </aside>
//         </>
//     );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function ProductDetailPage() {
//     const { props }    = usePage();
//     const initKey      = useRef(null);

//     const categorySlug = props?.categorySlug || null;
//     const productSlug  = props?.productSlug  || null;

//     const [sidebarOpen,             setSidebarOpen]             = useState(false);
//     const [categories,              setCategories]              = useState([]);
//     const [allProducts,             setAllProducts]             = useState([]);
//     const [selectedProduct,         setSelectedProduct]         = useState(null);
//     const [selectedCategory,        setSelectedCategory]        = useState(null);
//     const [loading,                 setLoading]                 = useState(true);
//     const [activeImage,             setActiveImage]             = useState(null);
//     const [categoryProducts,        setCategoryProducts]        = useState([]);
//     const [categoryProductsLoading, setCategoryProductsLoading] = useState(false);

//     // Lock body scroll when mobile sidebar is open
//     useEffect(() => {
//         document.body.style.overflow = sidebarOpen ? "hidden" : "";
//         return () => { document.body.style.overflow = ""; };
//     }, [sidebarOpen]);

//     const updateUrl = (slug) => {
//         if (slug) window.history?.replaceState(null, "", `/category/${slug}`);
//     };

//     const fetchCategories = async () => {
//         try {
//             const res         = await axios.get("/ourproductcategories");
//             const transformed = res.data.data.map((cat) => ({
//                 id:                cat.id,
//                 name:              cat.name,
//                 slug:              cat.slug,
//                 icon_image:        cat.icon_image        || null,
//                 featured_image:    cat.featured_image    || null,
//                 description:       cat.description       || "",
//                 title:             cat.title             || "",
//                 content:           cat.content           || "",
//                 created_at:        cat.created_at        || null,
//                 additional_images: cat.additional_images || [],
//                 children: orderByOldestFirst((cat.children ?? []).map((child) => ({
//                     id:                child.id,
//                     name:              child.name,
//                     slug:              child.slug,
//                     icon_image:        child.icon_image        || null,
//                     featured_image:    child.featured_image    || null,
//                     description:       child.description       || "",
//                     title:             child.title             || "",
//                     content:           child.content           || "",
//                     created_at:        child.created_at        || null,
//                     additional_images: child.additional_images || [],
//                 }))),
//             }));
//             const ordered = orderByOldestFirst(transformed);
//             setCategories(ordered);
//             return ordered;
//         } catch (err) {
//             console.error("Error fetching categories:", err);
//             return [];
//         }
//     };

//     const fetchAllProducts = async () => {
//         try {
//             const res     = await axios.get("/ourproducts");
//             const list    = res.data?.data || res.data || [];
//             const ordered = orderByOldestFirst(list);
//             setAllProducts(ordered);
//             return ordered;
//         } catch (err) {
//             console.error("Error fetching products:", err);
//             return [];
//         }
//     };

//     const resolveCategoryBySlug = (slug, cats) => {
//         const source = cats ?? categories;
//         return (
//             source.find((c) => c.slug === slug) ??
//             source.flatMap((c) => c.children ?? []).find((c) => c.slug === slug) ??
//             null
//         );
//     };

//     const fetchProductBySlug = async (slug) => {
//         try {
//             setLoading(true);
//             const res     = await axios.get(`/ourproducts/${slug}`);
//             const product = res.data?.data || null;
//             setSelectedProduct(product);
//             setSelectedCategory(product?.category || null);
//         } catch (err) {
//             console.error("Error fetching product:", err);
//             setSelectedProduct(null);
//             setSelectedCategory(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCategorySelect = (category) => {
//         if (!category?.slug) return;
//         setSelectedProduct(null);
//         setCategoryProducts([]);
//         setSelectedCategory(category);
//         updateUrl(category.slug);
//         setSidebarOpen(false);
//     };

//     const handleProductSelect = async (product) => {
//         if (!product?.slug) return;
//         await fetchProductBySlug(product.slug);
//         updateUrl(product.slug);
//         setSidebarOpen(false);
//     };

//     useEffect(() => {
//         const key = `${categorySlug ?? ""}|${productSlug ?? ""}`;
//         if (initKey.current === key) return;
//         initKey.current = key;

//         const init = async () => {
//             setLoading(true);
//             const [cats] = await Promise.all([fetchCategories(), fetchAllProducts()]);

//             if (productSlug) {
//                 await fetchProductBySlug(productSlug);
//             } else if (categorySlug) {
//                 const cat = resolveCategoryBySlug(categorySlug, cats);
//                 setSelectedProduct(null);
//                 setSelectedCategory(cat);
//                 setLoading(false);
//             } else {
//                 setLoading(false);
//             }
//         };

//         init();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [categorySlug, productSlug]);

//     useEffect(() => {
//         if (!selectedCategory?.slug || selectedProduct) {
//             setCategoryProducts([]);
//             return;
//         }

//         let cancelled = false;
//         const load = async () => {
//             setCategoryProductsLoading(true);
//             try {
//                 const res = await axios.get(`/ourproducts/category/${selectedCategory.slug}`);
//                 if (!cancelled) {
//                     const list = res.data?.data || [];
//                     setCategoryProducts(orderByOldestFirst(list));
//                 }
//             } catch {
//                 if (!cancelled) setCategoryProducts([]);
//             } finally {
//                 if (!cancelled) setCategoryProductsLoading(false);
//             }
//         };

//         load();
//         return () => { cancelled = true; };
//     }, [selectedCategory?.slug, selectedProduct]);

//     const categoriesWithProducts = useMemo(() => {
//         if (!categories.length) return [];

//         const byCategorySlug = allProducts.reduce((acc, p) => {
//             const slug = p?.category?.slug;
//             if (!slug) return acc;
//             if (!acc[slug]) acc[slug] = [];
//             acc[slug].push({ id: p.id, name: p.name, slug: p.slug });
//             return acc;
//         }, {});

//         return categories.map((cat) => ({
//             ...cat,
//             products: orderByOldestFirst(byCategorySlug[cat.slug] || []),
//         }));
//     }, [categories, allProducts]);

//     const productImages = useMemo(() => {
//         const imgs = [];
//         if (selectedProduct?.featured_image) imgs.push(`${imgurl}/${selectedProduct.featured_image}`);
//         (selectedProduct?.images ?? []).forEach((img) => {
//             if (img?.image_path) imgs.push(`${imgurl}/${img.image_path}`);
//         });
//         return [...new Set(imgs)];
//     }, [selectedProduct]);

//     useEffect(() => {
//         setActiveImage(productImages[0] || null);
//     }, [productImages]);

//     const pageTitle =
//         selectedProduct?.category?.name ||
//         selectedCategory?.name          ||
//         "Products";

//     // ── SEO values ────────────────────────────────────────────────────────────
//     const seoTitle = selectedProduct
//         ? `${selectedProduct.title || selectedProduct.name} | Micro & Mega`
//         : selectedCategory
//         ? `${selectedCategory.title || selectedCategory.name} | Micro & Mega`
//         : "Products | Micro & Mega";

//     const seoDescription = selectedProduct
//         ? (selectedProduct.description || `View details for ${selectedProduct.name} by Micro & Mega Nepal.`).slice(0, 155)
//         : selectedCategory
//         ? (selectedCategory.description || `Explore ${selectedCategory.name} security products by Micro & Mega Nepal.`).slice(0, 155)
//         : "Browse security systems and industrial products by Micro & Mega Nepal.";

//     const seoImage = selectedProduct?.featured_image
//         ? `${imgurl}/${selectedProduct.featured_image}`
//         : selectedCategory?.featured_image
//         ? `${imgurl}/${selectedCategory.featured_image}`
//         : "/images/og-image.jpg";

//     // SSR-safe canonical URL
//     const seoUrl = typeof window !== "undefined" ? window.location.href : "";

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
//                     <p className="mt-4 text-gray-600">Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Head>
//                 <title>{seoTitle}</title>
//                 <meta name="description"          content={seoDescription} />
//                 <meta name="robots"               content="index, follow" />
//                 {seoUrl && <link rel="canonical"  href={seoUrl} />}

//                 {/* Open Graph */}
//                 <meta property="og:type"          content="website" />
//                 <meta property="og:url"           content={seoUrl} />
//                 <meta property="og:title"         content={seoTitle} />
//                 <meta property="og:description"   content={seoDescription} />
//                 <meta property="og:image"         content={seoImage} />

//                 {/* Twitter Card */}
//                 <meta name="twitter:card"         content="summary_large_image" />
//                 <meta name="twitter:url"          content={seoUrl} />
//                 <meta name="twitter:title"        content={seoTitle} />
//                 <meta name="twitter:description"  content={seoDescription} />
//                 <meta name="twitter:image"        content={seoImage} />
//             </Head>

//             {/* Hero Banner */}
//             <div
//                 className="relative flex min-h-[300px] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-12 sm:min-h-[380px] lg:min-h-[460px] lg:bg-fixed"
//                 style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
//             >
//                 <div className="absolute inset-0 bg-gray-900/70 pointer-events-none" />
//                 <div className="relative z-20 flex flex-col items-center text-center gap-3">
//                     <h2 className="text-3xl font-extrabold uppercase text-white sm:text-5xl">
//                         {pageTitle}
//                     </h2>
//                     <nav className="flex items-center gap-2 text-sm font-medium text-gray-300" aria-label="Breadcrumb">
//                         <Link href="/" className="hover:text-red-400 transition-colors">Home</Link>
//                         <span className="text-gray-500">/</span>
//                         <span className="text-white">{pageTitle}</span>
//                     </nav>
//                 </div>
//             </div>

//             {/* Main layout */}
//             <div className="min-h-screen bg-gray-50 py-16 sm:py-24">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-0">
//                     <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

//                         {/* Sidebar */}
//                         <div className="flex-shrink-0 w-80 lg:sticky lg:top-6 self-start">
//                             <Sidebar
//                                 isMobileOpen={sidebarOpen}
//                                 onClose={() => setSidebarOpen(false)}
//                                 categories={categoriesWithProducts}
//                                 onCategorySelect={handleCategorySelect}
//                                 onProductSelect={handleProductSelect}
//                             />
//                         </div>

//                         {/* Main content */}
//                         <main className="flex-1 min-w-0">

//                             {/* Heading + mobile menu button */}
//                             <div className="flex items-start justify-between gap-4 mb-5">
//                                 <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                                     {selectedProduct?.title  ||
//                                      selectedProduct?.name   ||
//                                      selectedCategory?.title ||
//                                      selectedCategory?.name  ||
//                                      "Products"}
//                                 </h1>
//                                 <button
//                                     onClick={() => setSidebarOpen(true)}
//                                     className="lg:hidden flex items-center gap-1.5 text-gray-700 text-md border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
//                                     aria-label="Open menu"
//                                 >
//                                     <Menu className="h-6 w-6" /> Menu
//                                 </button>
//                             </div>

//                             {/* PRODUCT VIEW */}
//                             {selectedProduct ? (
//                                 <DetailView
//                                     item={selectedProduct}
//                                     type="product"
//                                     onImageClick={setActiveImage}
//                                 />

//                             ) : selectedCategory ? (
//                                 /* CATEGORY VIEW */
//                                 <>
//                                     <DetailView
//                                         item={selectedCategory}
//                                         type="category"
//                                         onImageClick={setActiveImage}
//                                         onProductSelect={handleProductSelect}
//                                     />

//                                     {selectedCategory.children?.length > 0 && (
//                                         <div className="mt-8">
//                                             <h2 className="text-3xl font-bold text-gray-800 mb-5 pb-2 border-b-2 border-red-600 inline-block">
//                                                 Sub-categories
//                                             </h2>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                                                 {selectedCategory.children.map((child) => (
//                                                     <ItemCard
//                                                         key={child.id || child.slug || child.name}
//                                                         image={
//                                                             (child.featured_image || child.icon_image)
//                                                                 ? `${imgurl}/${child.featured_image || child.icon_image}`
//                                                                 : null
//                                                         }
//                                                         title={child.title || child.name}
//                                                         description={child.description}
//                                                         label="View Products"
//                                                         onClick={() => handleCategorySelect(child)}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {categoryProductsLoading && (
//                                         <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
//                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
//                                             Loading products…
//                                         </div>
//                                     )}

//                                     {!categoryProductsLoading && categoryProducts.length > 0 && (
//                                         <div className="mt-8">
//                                             <h2 className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b-2 border-red-600 inline-block">
//                                                 {selectedCategory.name} Products
//                                             </h2>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                                                 {categoryProducts.map((product) => (
//                                                     <ItemCard
//                                                         key={product.id || product.slug}
//                                                         image={
//                                                             product.featured_image
//                                                                 ? `${imgurl}/${product.featured_image}`
//                                                                 : null
//                                                         }
//                                                         title={product.title || product.name}
//                                                         description={product.description}
//                                                         label="View Details"
//                                                         onClick={() => handleProductSelect(product)}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </>

//                             ) : (
//                                 <div className="text-center text-gray-400 py-20">
//                                     Select a category or product from the sidebar.
//                                 </div>
//                             )}
//                         </main>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import { useState, useEffect, useMemo, useRef } from "react";
import {
    AlertTriangle,
    Bell,
    Camera,
    ChevronDown,
    Flame,
    Menu,
    Radio,
    Shield,
    ShieldCheck,
    Wifi,
    X,
    Fingerprint,
} from "lucide-react";
import { Link, usePage, Head } from "@inertiajs/react";
import axios from "axios";
import parse from "html-react-parser";

const iconMap = {
    "Access Control":           Fingerprint,
    "Fire Alarm":               Flame,
    "Public Address":           Radio,
    "CCTV":                     Camera,
    "Data Network":             Wifi,
    "Control and Monitor System": Shield,
    "Grounding ERT":            AlertTriangle,
    "Digital Lighting":         Bell,
};

const imgurl = import.meta.env.VITE_IMAGE_PATH;

// Category slug -> hero banner image map
const categoryBgMap = {
    "public-audio-system": "/images/publicaudiobg.jpeg",
    // "fire-alarm": "/images/firealarmbg.jpeg",
    // "cctv": "/images/cctvbg.jpeg",
};
const DEFAULT_HERO_BG = "/images/about-bg.jpg";

function orderByOldestFirst(list) {
    if (!Array.isArray(list)) return list;
    return [...list].sort((a, b) => {
        const aKey = a?.created_at ?? a?.createdAt ?? a?.id;
        const bKey = b?.created_at ?? b?.createdAt ?? b?.id;
        const aTime = aKey ? new Date(aKey).getTime() : NaN;
        const bTime = bKey ? new Date(bKey).getTime() : NaN;
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) return aTime - bTime;
        if (typeof aKey === "number" && typeof bKey === "number") return aKey - bKey;
        return 0;
    });
}

function ItemCard({ image, title, description, label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-red-300 transition-all flex flex-col cursor-pointer group overflow-hidden"
        >
            <div className="w-full h-44 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
                    />
                ) : (
                    <Shield className="h-12 w-12 text-red-300" />
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-red-700 transition-colors leading-snug">
                    {title}
                </h4>
                {description && (
                    <p className="text-xs text-gray-500 flex-1 mb-3 line-clamp-3 leading-relaxed">
                        {description}
                    </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-red-600 uppercase tracking-wide">
                    {label} →
                </span>
            </div>
        </div>
    );
}

function DetailView({ item, type, onImageClick, onProductSelect }) {
    const [activeImage,      setActiveImage]      = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);

    useEffect(() => {
        let images = [];

        if (type === "category") {
            if (item.featured_image) {
                images.push({ src: `${imgurl}/${item.featured_image}`, type: "featured" });
            }
            if (item.additional_images && Array.isArray(item.additional_images)) {
                item.additional_images.forEach(img => {
                    if (img?.image_path) images.push({ src: `${imgurl}/${img.image_path}`, type: "additional" });
                });
            }
        } else if (type === "product") {
            if (item.featured_image) images.push({ src: `${imgurl}/${item.featured_image}`, type: "featured" });
            if (item.images && Array.isArray(item.images)) {
                item.images.forEach(img => {
                    if (img?.image_path) images.push({ src: `${imgurl}/${img.image_path}`, type: "additional" });
                });
            }
        }

        const featured = images.find(img => img.type === "featured");
        const others   = images.filter(img => img.type !== "featured");

        setActiveImage(featured?.src || (images[0]?.src || null));
        setAdditionalImages(others.slice(0, 6));
    }, [item, type]);

    const handleThumbnailClick = (image) => {
        setActiveImage(image);
        if (onImageClick) onImageClick(image);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                {type === "product" && item.category?.name && (
                    <h2 className="sm:text-3xl text-2xl text-red-600 font-bold mt-0.5 uppercase tracking-wide">
                        {item.category.name}
                    </h2>
                )}
                <h3 className="text-xl md:text-xl font-bold text-gray-900">
                    {item.title || item.name}
                </h3>
            </div>

            {activeImage && (
                <div className="relative w-full">
                    <div className="relative h-[150px] sm:h-[400px] md:h-[250px] w-full overflow-hidden">
                        <img
                            src={activeImage}
                            alt={item.name || "Featured"}
                            className="w-full h-full object-contain object-center"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/firealram.jpg";
                            }}
                        />
                    </div>
                </div>
            )}

            {additionalImages.length > 0 && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {additionalImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleThumbnailClick(img.src)}
                                className={`relative group rounded-lg overflow-hidden transition-all aspect-square ${
                                    activeImage === img.src
                                        ? "border-red-500 ring-2 ring-red-200 ring-offset-1"
                                        : "border-gray-200 hover:border-red-300 hover:shadow-md"
                                }`}
                            >
                                <img
                                    src={img.src}
                                    alt={`Gallery ${idx + 1}`}
                                    className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/firealram.jpg";
                                    }}
                                />
                                {activeImage === img.src && (
                                    <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-5 py-6">
                {item.content ? (
                    <div className="prose prose-sm md:prose max-w-none">
                        {parse(item.content)}
                    </div>
                ) : item.description ? (
                    <div className="text-gray-600 text-sm leading-relaxed space-y-2">
                        <p>{item.description}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function SidebarItem({ item, isOpen, onToggle, onCategorySelect, onProductSelect }) {
    const Icon        = iconMap[item.name] || Shield;
    const hasChildren = item.children?.length > 0;
    const hasProducts = item.products?.length > 0;
    const hasDropdown = hasChildren || hasProducts;

    return (
        <li className="border-b border-gray-100 last:border-0">
            <div className="flex items-center w-full hover:bg-gray-50 transition-colors">
                <button
                    onClick={() => onCategorySelect(item)}
                    className="flex-1 flex items-center gap-2 px-3 py-2.5 text-left text-sm"
                >
                    {item.icon_image ? (
                        <img
                            src={`${imgurl}/${item.icon_image}`}
                            alt={item.name}
                            className="h-5 w-5 rounded object-cover flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
                        />
                    ) : (
                        <Icon className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="font-medium text-lg text-gray-800">{item.name}</span>
                </button>

                {hasDropdown && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(); }}
                        className="px-3 py-2.5 text-gray-400 hover:text-gray-600"
                        aria-label="Toggle submenu"
                    >
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                )}
            </div>

            {isOpen && (
                <ul className="bg-gray-50 border-t border-gray-100">
                    {item.children?.map((child) => (
                        <li key={child.id || child.slug || child.name}>
                            <button
                                onClick={() => onCategorySelect(child)}
                                className="w-full text-left px-6 py-2 text-sm text-gray-600 hover:text-red-700 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                                {child.name}
                            </button>
                        </li>
                    ))}
                    {item.products?.map((product) => (
                        <li
                            key={product.id || product.slug || product.name}
                            onClick={() => onProductSelect(product)}
                            className="px-6 py-2 text-lg text-gray-500 hover:text-red-700 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-1.5"
                        >
                            <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

function Sidebar({ isMobileOpen, onClose, categories, onCategorySelect, onProductSelect }) {
    const [openItems, setOpenItems] = useState({});
    const toggle = (name) => setOpenItems((prev) => ({ ...prev, [name]: !prev[name] }));

    return (
        <>
            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-72
                    bg-white shadow-xl overflow-y-auto
                    transition-transform duration-300
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:z-auto lg:w-full
                    lg:translate-x-0 lg:shadow-none
                    lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto
                `}
            >
                <div className="bg-gray-800 text-white py-3 px-4 flex items-center justify-between sticky top-0 z-10">
                    <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-8 w-8" /> Security Products
                    </h3>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white hover:text-gray-300 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="border border-gray-200 border-t-0" aria-label="Product categories">
                    <ul>
                        {categories.map((item) => (
                            <SidebarItem
                                key={item.name}
                                item={item}
                                isOpen={!!openItems[item.name]}
                                onToggle={() => toggle(item.name)}
                                onCategorySelect={onCategorySelect}
                                onProductSelect={onProductSelect}
                            />
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
    const { props }    = usePage();
    const initKey      = useRef(null);

    const categorySlug = props?.categorySlug || null;
    const productSlug  = props?.productSlug  || null;

    const [sidebarOpen,             setSidebarOpen]             = useState(false);
    const [categories,              setCategories]              = useState([]);
    const [allProducts,             setAllProducts]             = useState([]);
    const [selectedProduct,         setSelectedProduct]         = useState(null);
    const [selectedCategory,        setSelectedCategory]        = useState(null);
    const [loading,                 setLoading]                 = useState(true);
    const [activeImage,             setActiveImage]             = useState(null);
    const [categoryProducts,        setCategoryProducts]        = useState([]);
    const [categoryProductsLoading, setCategoryProductsLoading] = useState(false);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    const updateUrl = (slug) => {
        if (slug) window.history?.replaceState(null, "", `/category/${slug}`);
    };

    const fetchCategories = async () => {
        try {
            const res         = await axios.get("/ourproductcategories");
            const transformed = res.data.data.map((cat) => ({
                id:                cat.id,
                name:              cat.name,
                slug:              cat.slug,
                icon_image:        cat.icon_image        || null,
                featured_image:    cat.featured_image    || null,
                description:       cat.description       || "",
                title:             cat.title             || "",
                content:           cat.content           || "",
                created_at:        cat.created_at        || null,
                additional_images: cat.additional_images || [],
                children: orderByOldestFirst((cat.children ?? []).map((child) => ({
                    id:                child.id,
                    name:              child.name,
                    slug:              child.slug,
                    icon_image:        child.icon_image        || null,
                    featured_image:    child.featured_image    || null,
                    description:       child.description       || "",
                    title:             child.title             || "",
                    content:           child.content           || "",
                    created_at:        child.created_at        || null,
                    additional_images: child.additional_images || [],
                }))),
            }));
            const ordered = orderByOldestFirst(transformed);
            setCategories(ordered);
            return ordered;
        } catch (err) {
            console.error("Error fetching categories:", err);
            return [];
        }
    };

    const fetchAllProducts = async () => {
        try {
            const res     = await axios.get("/ourproducts");
            const list    = res.data?.data || res.data || [];
            const ordered = orderByOldestFirst(list);
            setAllProducts(ordered);
            return ordered;
        } catch (err) {
            console.error("Error fetching products:", err);
            return [];
        }
    };

    const resolveCategoryBySlug = (slug, cats) => {
        const source = cats ?? categories;
        return (
            source.find((c) => c.slug === slug) ??
            source.flatMap((c) => c.children ?? []).find((c) => c.slug === slug) ??
            null
        );
    };

    const fetchProductBySlug = async (slug) => {
        try {
            setLoading(true);
            const res     = await axios.get(`/ourproducts/${slug}`);
            const product = res.data?.data || null;
            setSelectedProduct(product);
            setSelectedCategory(product?.category || null);
        } catch (err) {
            console.error("Error fetching product:", err);
            setSelectedProduct(null);
            setSelectedCategory(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        if (!category?.slug) return;
        setSelectedProduct(null);
        setCategoryProducts([]);
        setSelectedCategory(category);
        updateUrl(category.slug);
        setSidebarOpen(false);
    };

    const handleProductSelect = async (product) => {
        if (!product?.slug) return;
        await fetchProductBySlug(product.slug);
        updateUrl(product.slug);
        setSidebarOpen(false);
    };

    useEffect(() => {
        const key = `${categorySlug ?? ""}|${productSlug ?? ""}`;
        if (initKey.current === key) return;
        initKey.current = key;

        const init = async () => {
            setLoading(true);
            const [cats] = await Promise.all([fetchCategories(), fetchAllProducts()]);

            if (productSlug) {
                await fetchProductBySlug(productSlug);
            } else if (categorySlug) {
                const cat = resolveCategoryBySlug(categorySlug, cats);
                setSelectedProduct(null);
                setSelectedCategory(cat);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categorySlug, productSlug]);

    useEffect(() => {
        if (!selectedCategory?.slug || selectedProduct) {
            setCategoryProducts([]);
            return;
        }

        let cancelled = false;
        const load = async () => {
            setCategoryProductsLoading(true);
            try {
                const res = await axios.get(`/ourproducts/category/${selectedCategory.slug}`);
                if (!cancelled) {
                    const list = res.data?.data || [];
                    setCategoryProducts(orderByOldestFirst(list));
                }
            } catch {
                if (!cancelled) setCategoryProducts([]);
            } finally {
                if (!cancelled) setCategoryProductsLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [selectedCategory?.slug, selectedProduct]);

    const categoriesWithProducts = useMemo(() => {
        if (!categories.length) return [];

        const byCategorySlug = allProducts.reduce((acc, p) => {
            const slug = p?.category?.slug;
            if (!slug) return acc;
            if (!acc[slug]) acc[slug] = [];
            acc[slug].push({ id: p.id, name: p.name, slug: p.slug });
            return acc;
        }, {});

        return categories.map((cat) => ({
            ...cat,
            products: orderByOldestFirst(byCategorySlug[cat.slug] || []),
        }));
    }, [categories, allProducts]);

    const productImages = useMemo(() => {
        const imgs = [];
        if (selectedProduct?.featured_image) imgs.push(`${imgurl}/${selectedProduct.featured_image}`);
        (selectedProduct?.images ?? []).forEach((img) => {
            if (img?.image_path) imgs.push(`${imgurl}/${img.image_path}`);
        });
        return [...new Set(imgs)];
    }, [selectedProduct]);

    useEffect(() => {
        setActiveImage(productImages[0] || null);
    }, [productImages]);

    // Hero background image based on active category/product's category slug.
    // IMPORTANT: this hook must stay ABOVE the `if (loading) return ...` below,
    // so it always runs on every render (Rules of Hooks).
    const heroBgImage = useMemo(() => {
        const activeCategorySlug =
            selectedProduct?.category?.slug ||
            selectedCategory?.slug ||
            null;

        return categoryBgMap[activeCategorySlug] || DEFAULT_HERO_BG;
    }, [selectedProduct, selectedCategory]);

    const pageTitle =
        selectedProduct?.category?.name ||
        selectedCategory?.name          ||
        "Products";

    // ── SEO values ────────────────────────────────────────────────────────────
    const seoTitle = selectedProduct
        ? `${selectedProduct.title || selectedProduct.name} | Micro & Mega`
        : selectedCategory
        ? `${selectedCategory.title || selectedCategory.name} | Micro & Mega`
        : "Products | Micro & Mega";

    const seoDescription = selectedProduct
        ? (selectedProduct.description || `View details for ${selectedProduct.name} by Micro & Mega Nepal.`).slice(0, 155)
        : selectedCategory
        ? (selectedCategory.description || `Explore ${selectedCategory.name} security products by Micro & Mega Nepal.`).slice(0, 155)
        : "Browse security systems and industrial products by Micro & Mega Nepal.";

    const seoImage = selectedProduct?.featured_image
        ? `${imgurl}/${selectedProduct.featured_image}`
        : selectedCategory?.featured_image
        ? `${imgurl}/${selectedCategory.featured_image}`
        : "/images/og-image.jpg";

    // SSR-safe canonical URL
    const seoUrl = typeof window !== "undefined" ? window.location.href : "";

    // ── Early return AFTER all hooks are declared ─────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description"          content={seoDescription} />
                <meta name="robots"               content="index, follow" />
                {seoUrl && <link rel="canonical"  href={seoUrl} />}

                {/* Open Graph */}
                <meta property="og:type"          content="website" />
                <meta property="og:url"           content={seoUrl} />
                <meta property="og:title"         content={seoTitle} />
                <meta property="og:description"   content={seoDescription} />
                <meta property="og:image"         content={seoImage} />

                {/* Twitter Card */}
                <meta name="twitter:card"         content="summary_large_image" />
                <meta name="twitter:url"          content={seoUrl} />
                <meta name="twitter:title"        content={seoTitle} />
                <meta name="twitter:description"  content={seoDescription} />
                <meta name="twitter:image"        content={seoImage} />
            </Head>

            {/* Hero Banner */}
            <div
                className="relative flex min-h-[300px] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-12 sm:min-h-[380px] lg:min-h-[460px] lg:bg-fixed"
                style={{ backgroundImage: `url('${heroBgImage}')` }}
            >
                <div className="absolute inset-0 bg-gray-900/70 pointer-events-none" />
                <div className="relative z-20 flex flex-col items-center text-center gap-3">
                    <h2 className="text-3xl font-extrabold uppercase text-white sm:text-5xl">
                        {pageTitle}
                    </h2>
                    <nav className="flex items-center gap-2 text-sm font-medium text-gray-300" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-red-400 transition-colors">Home</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-white">{pageTitle}</span>
                    </nav>
                </div>
            </div>

            {/* Main layout */}
            <div className="min-h-screen bg-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-0">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                        {/* Sidebar */}
                        <div className="flex-shrink-0 w-80 lg:sticky lg:top-6 self-start">
                            <Sidebar
                                isMobileOpen={sidebarOpen}
                                onClose={() => setSidebarOpen(false)}
                                categories={categoriesWithProducts}
                                onCategorySelect={handleCategorySelect}
                                onProductSelect={handleProductSelect}
                            />
                        </div>

                        {/* Main content */}
                        <main className="flex-1 min-w-0">

                            {/* Heading + mobile menu button */}
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {selectedProduct?.title  ||
                                     selectedProduct?.name   ||
                                     selectedCategory?.title ||
                                     selectedCategory?.name  ||
                                     "Products"}
                                </h1>
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden flex items-center gap-1.5 text-gray-700 text-md border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                                    aria-label="Open menu"
                                >
                                    <Menu className="h-6 w-6" /> Menu
                                </button>
                            </div>

                            {/* PRODUCT VIEW */}
                            {selectedProduct ? (
                                <DetailView
                                    item={selectedProduct}
                                    type="product"
                                    onImageClick={setActiveImage}
                                />

                            ) : selectedCategory ? (
                                /* CATEGORY VIEW */
                                <>
                                    <DetailView
                                        item={selectedCategory}
                                        type="category"
                                        onImageClick={setActiveImage}
                                        onProductSelect={handleProductSelect}
                                    />

                                    {selectedCategory.children?.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="text-3xl font-bold text-gray-800 mb-5 pb-2 border-b-2 border-red-600 inline-block">
                                                Sub-categories
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {selectedCategory.children.map((child) => (
                                                    <ItemCard
                                                        key={child.id || child.slug || child.name}
                                                        image={
                                                            (child.featured_image || child.icon_image)
                                                                ? `${imgurl}/${child.featured_image || child.icon_image}`
                                                                : null
                                                        }
                                                        title={child.title || child.name}
                                                        description={child.description}
                                                        label="View Products"
                                                        onClick={() => handleCategorySelect(child)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {categoryProductsLoading && (
                                        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                                            Loading products…
                                        </div>
                                    )}

                                    {!categoryProductsLoading && categoryProducts.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b-2 border-red-600 inline-block">
                                                {selectedCategory.name} Products
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {categoryProducts.map((product) => (
                                                    <ItemCard
                                                        key={product.id || product.slug}
                                                        image={
                                                            product.featured_image
                                                                ? `${imgurl}/${product.featured_image}`
                                                                : null
                                                        }
                                                        title={product.title || product.name}
                                                        description={product.description}
                                                        label="View Details"
                                                        onClick={() => handleProductSelect(product)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>

                            ) : (
                                <div className="text-center text-gray-400 py-20">
                                    Select a category or product from the sidebar.
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}