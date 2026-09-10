import AddProducts from "@/AddForm/AddProducts";
import AdminWrapper from "@/AdminDashboard/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const imgurl = import.meta.env.VITE_IMAGE_PATH;

const Products = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingProducts, setEditingProducts] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [restockingProduct, setRestockingProduct] = useState(null);
    const [restockValue, setRestockValue] = useState(0);
    const [restockSubmitting, setRestockSubmitting] = useState(false);

    const openRestock = (product) => {
        setRestockingProduct(product);
        setRestockValue(product.stock_quantity ?? 0);
    };

    const handleRestockSubmit = async (e) => {
        e.preventDefault();
        if (!restockingProduct) return;
        try {
            setRestockSubmitting(true);
            await axios.patch(
                route("ourproducts.restock", { id: restockingProduct.id }),
                { stock_quantity: Number(restockValue) }
            );
            setReloadTrigger((prev) => !prev);
            setRestockingProduct(null);
        } catch (error) {
            console.log("Error restocking product", error);
            alert(error?.response?.data?.message || "Error updating stock.");
        } finally {
            setRestockSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/ourproducts");
                const list = response.data.data || response.data;
                setAllProducts(list);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchProducts();
    }, [reloadTrigger]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/ourproductcategories/flat");
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setCategories(data);
            } catch (error) {
                console.error("fetching categories error", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        if (selectedCategory === "all") {
            setFilteredProducts(allProducts);
            return;
        }
        setFilteredProducts(
            allProducts.filter((p) => p.category?.slug === selectedCategory)
        );
    }, [allProducts, selectedCategory]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(route("ourproducts.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (product) => {
        setEditingProducts(product);
        setShowAddForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourproducts.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating products", error);
            throw error;
        }
    };

    // Paginated data slice
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredProducts.slice(start, start + perPage);
    }, [filteredProducts, currentPage, perPage]);

    const lastPage = useMemo(
        () => Math.max(1, Math.ceil(filteredProducts.length / perPage)),
        [filteredProducts, perPage]
    );

    // Table columns definition
    const columns = useMemo(
        () => [
            {
                Header: "#",
                id: "index",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <span className="text-gray-500 font-medium">
                        {(currentPage - 1) * perPage + row.index + 1}
                    </span>
                ),
            },
            {
                Header: "Category",
                accessor: "category.name",
                Cell: ({ value }) => (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {value || "—"}
                    </span>
                ),
            },
            {
                Header: "Product Name",
                accessor: "name",
                Cell: ({ row, value }) => (
                    <div className="flex items-center gap-3">
                        {row.original.featured_image && (
                            <img
                                src={`${imgurl}/${row.original.featured_image}`}
                                alt={value}
                                className="w-10 h-10 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/placeholder.jpg";
                                }}
                            />
                        )}
                        <span className="font-medium text-gray-800">{value}</span>
                    </div>
                ),
            },
            {
                Header: "Detail Page Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value || "—"}</span>
                ),
            },

            // ========== PRICE COLUMN ==========
            {
                Header: "Price",
                accessor: "price",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">
                        {value !== null && value !== undefined
                            ? `Rs. ${Number(value).toLocaleString("en-NP", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })}`
                            : "—"}
                    </span>
                ),
            },
            // ==================================

            {
                Header: "Stock",
                accessor: "stock_quantity",
                Cell: ({ row, value }) => {
                    const status = row.original.stock_status;
                    const badge =
                        status === "out_of_stock"
                            ? "bg-red-100 text-red-700"
                            : status === "low_stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700";
                    const label =
                        status === "out_of_stock"
                            ? "Out of Stock"
                            : status === "low_stock"
                            ? "Low Stock"
                            : "In Stock";
                    return (
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge}`}
                            >
                                {label}
                            </span>
                            <span className="text-gray-600 text-sm">({value ?? 0})</span>
                        </div>
                    );
                },
            },

            {
                Header: "Actions",
                id: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openRestock(row.original)}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                        >
                            Restock
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                        >
                            <Pencil size={13} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                ),
            },
        ],
        [currentPage, perPage]
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Products
                    </h1>
                    <button
                        onClick={() => {
                            setEditingProducts(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-[#dc2626] text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium tracking-widest uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none appearance-none bg-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-500">
                        {filteredProducts.length} product
                        {filteredProducts.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                <MyTable
                    columns={columns}
                    data={paginatedData}
                    rowClassName={(row) =>
                        row.stock_status === "out_of_stock"
                            ? "bg-red-50"
                            : row.stock_status === "low_stock"
                            ? "bg-yellow-50"
                            : ""
                    }
                    pagination={{
                        currentPage,
                        lastPage,
                        perPage,
                        onPageChange: (page) => setCurrentPage(page),
                        onPerPageChange: (size) => {
                            setPerPage(size);
                            setCurrentPage(1);
                        },
                    }}
                />

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">
                            Try changing the category filter or add a new product.
                        </p>
                    </div>
                )}

                {/* Add / Edit Modal */}
                {showAddForm && (
                    <AddProducts
                        editingProducts={editingProducts}
                        setShowForm={setShowAddForm}
                        setEditingProducts={setEditingProducts}
                        setReloadTrigger={setReloadTrigger}
                        handleUpdate={handleUpdate}
                    />
                )}

                {/* Restock Modal */}
                {restockingProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Restock Product
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {restockingProduct.name}
                            </p>
                            <form onSubmit={handleRestockSubmit}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={restockValue}
                                    onChange={(e) => setRestockValue(e.target.value)}
                                    autoFocus
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 mb-5"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRestockingProduct(null)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={restockSubmitting}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50"
                                    >
                                        {restockSubmitting ? "Saving..." : "Update Stock"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

Products.layout = (page) => page;

export default Products;