import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";
import { useCart } from "@/Context/CartContext";
import { ShoppingCart, Plus, Minus, Shield, ChevronDown } from "lucide-react";

const imgurl = import.meta.env.VITE_IMAGE_PATH;

// Format price with fallback to Rs. 1
const formatPrice = (price) => {
    if (price === null || price === undefined || price === "" || Number(price) === 0) {
        return "Rs. 1";
    }
    return `Rs. ${Number(price).toLocaleString("en-NP", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

function AddToCartControl({ product, image }) {
    const { items, addItem, incrementQty, decrementQty } = useCart();
    const cartItem = items.find((i) => i.id === product.id);
    const isOutOfStock = product.stock_status === "out_of_stock";

    if (isOutOfStock) {
        return (
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wide w-full">
                Out of Stock
            </span>
        );
    }

    if (!cartItem) {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    addItem(
                        {
                            id: product.id,
                            slug: product.slug,
                            name: product.title || product.name,
                            image,
                            price:
                                product.price != null &&
                                product.price !== "" &&
                                Number(product.price) !== 0
                                    ? Number(product.price)
                                    : 1,
                            stock_status: product.stock_status || "in_stock",
                        },
                        1
                    );
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#bb1403] hover:bg-[#9e1102] text-white text-xs font-bold uppercase tracking-wide transition-colors w-full"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-[#bb1403]/30 bg-red-50 w-full px-2 py-1.5">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    decrementQty(product.id);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 text-[#bb1403] hover:bg-red-100 transition-colors flex-shrink-0"
            >
                <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm font-bold text-gray-800 min-w-[20px] text-center">
                {cartItem.quantity}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    incrementQty(product.id);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 text-[#bb1403] hover:bg-red-100 transition-colors flex-shrink-0"
            >
                <Plus className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

function ProductCard({ product }) {
    const stockStatus = product?.stock_status;
    const image = product.featured_image
        ? `${imgurl}/${product.featured_image}`
        : null;

    const borderClass =
        stockStatus === "out_of_stock"
            ? "border-red-300 hover:border-red-400"
            : stockStatus === "low_stock"
            ? "border-yellow-300 hover:border-yellow-400"
            : "border-gray-200 hover:border-red-300";

    return (
        <div
            className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden ${borderClass}`}
        >
            {/* Image */}
            <Link
               href={`/products/${product.slug}`}
                className="relative w-full h-48 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0"
            >
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/placeholder.jpg";
                        }}
                    />
                ) : (
                    <Shield className="h-12 w-12 text-red-300" />
                )}

                {/* Stock badge */}
                {stockStatus && stockStatus !== "in_stock" && (
                    <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${
                            stockStatus === "out_of_stock"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-500 text-white"
                        }`}
                    >
                        {stockStatus === "out_of_stock" ? "Out of Stock" : "Low Stock"}
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
                        {product.title || product.name}
                    </h3>
                </Link>

                {product.category?.name && (
                    <p className="text-xs text-blue-600 font-medium mb-1">
                        {product.category.name}
                    </p>
                )}

                {product.description && (
                    <p className="text-xs text-gray-500 flex-1 mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                    <Link
                        href={`/products/${product.slug}`}
                        className="text-xs font-bold text-red-600 uppercase tracking-wide hover:underline"
                    >
                        View Details →
                    </Link>
                </div>

                <AddToCartControl product={product} image={image} />
            </div>
        </div>
    );
}

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch products
                const productRes = await axios.get("/ourproducts");
                const productList = productRes.data?.data || productRes.data || [];
                const activeProducts = productList.filter((p) => p.status !== false);
                setProducts(activeProducts);

                // Fetch categories
                const categoryRes = await axios.get("/ourproductcategories/flat");
                const categoryList = Array.isArray(categoryRes.data)
                    ? categoryRes.data
                    : categoryRes.data?.data || [];
                setCategories(categoryList);
            } catch (err) {
                console.error("Error fetching data:", err);
                setProducts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products by search + category
    const filteredProducts = products.filter((product) => {
        // Category filter
        if (selectedCategory !== "all") {
            const productCategorySlug = product.category?.slug;
            if (productCategorySlug !== selectedCategory) {
                return false;
            }
        }

        // Search filter
        if (search.trim()) {
            const term = search.toLowerCase();
            return (
                product.name?.toLowerCase().includes(term) ||
                product.title?.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term) ||
                product.category?.name?.toLowerCase().includes(term)
            );
        }

        return true;
    });

    return (
        <>
            <Head>
                <title>Shop | Micro & Mega</title>
                <meta
                    name="description"
                    content="Browse all security products from Micro & Mega Nepal."
                />
            </Head>

            {/* Hero */}
            <div className="relative flex min-h-[220px] items-center justify-center bg-gray-900 px-6 py-12">
                <div className="relative z-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-wide">
                        Shop
                    </h1>
                    <p className="mt-2 text-gray-300 text-sm">All Products</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Filters + Count */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">All Products</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {filteredProducts.length} product
                                {filteredProducts.length !== 1 ? "s" : ""} found
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Category Filter */}
                            <div className="relative w-full sm:w-56">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm appearance-none bg-white pr-10"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.parent_name
                                                ? `└─ ${cat.name}`
                                                : cat.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Search */}
                            <div className="w-full sm:w-72">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm mt-1">
                                {search || selectedCategory !== "all"
                                    ? "Try changing the filters."
                                    : "No products available at the moment."}
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && filteredProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id || product.slug}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Shop;