import AdminWrapper from "@/AdminDashboard/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { ChevronDown, Eye, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "completed", "cancelled"];

const STATUS_STYLES = {
    pending:    "bg-yellow-100 text-yellow-700",
    confirmed:  "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    shipped:    "bg-purple-100 text-purple-700",
    completed:  "bg-green-100 text-green-700",
    cancelled:  "bg-red-100 text-red-700",
};

const Orders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get(route("ourorders.index"));
                setAllOrders(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [reloadTrigger]);

    useEffect(() => {
        setCurrentPage(1);
        if (statusFilter === "all") {
            setFilteredOrders(allOrders);
            return;
        }
        setFilteredOrders(allOrders.filter((o) => o.status === statusFilter));
    }, [allOrders, statusFilter]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            setStatusUpdating(true);
            await axios.put(route("ourorders.update", { id }), { status: newStatus });
            setReloadTrigger((prev) => !prev);
            if (viewingOrder?.id === id) {
                setViewingOrder((prev) => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error("Error updating order status", error);
            alert(error?.response?.data?.message || "Error updating order status.");
        } finally {
            setStatusUpdating(false);
        }
    };

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredOrders.slice(start, start + perPage);
    }, [filteredOrders, currentPage, perPage]);

    const lastPage = useMemo(
        () => Math.max(1, Math.ceil(filteredOrders.length / perPage)),
        [filteredOrders, perPage]
    );

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
                Header: "Order #",
                accessor: "order_number",
                Cell: ({ value }) => (
                    <span className="font-mono text-sm font-semibold text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Customer",
                accessor: "customer_name",
                Cell: ({ row, value }) => (
                    <div>
                        <p className="font-medium text-gray-800">{value}</p>
                        <p className="text-xs text-gray-400">{row.original.customer_email}</p>
                    </div>
                ),
            },
            {
                Header: "Items",
                id: "items_count",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <span className="text-gray-600">
                        {row.original.items?.length || 0} item{(row.original.items?.length || 0) !== 1 ? "s" : ""}
                    </span>
                ),
            },
            {
                Header: "Grand Total",
                accessor: "grand_total",
                Cell: ({ value }) => (
                    <span className="font-bold text-gray-900">Rs. {value}</span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ row, value }) => (
                    <select
                        value={value}
                        disabled={statusUpdating}
                        onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${STATUS_STYLES[value] || "bg-gray-100 text-gray-700"}`}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                ),
            },
            {
                Header: "Date",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="text-gray-500 text-sm">
                        {new Date(value).toLocaleDateString()}
                    </span>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <button
                        onClick={() => setViewingOrder(row.original)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                    >
                        <Eye size={13} />
                        View
                    </button>
                ),
            },
        ],
        [currentPage, perPage, statusUpdating, viewingOrder]
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Orders
                    </h1>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-64">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none appearance-none bg-white"
                        >
                            <option value="all">All Statuses</option>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-500">
                        {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-16 text-gray-400">Loading orders...</div>
                ) : (
                    <>
                        <MyTable
                            columns={columns}
                            data={paginatedData}
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

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-lg font-medium">No orders found</p>
                                <p className="text-sm mt-1">Try changing the status filter, or wait for a customer to check out.</p>
                            </div>
                        )}
                    </>
                )}

                {/* View Order Modal */}
                {viewingOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
                            <div className="flex justify-between items-start mb-5 pb-4 border-b">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Order {viewingOrder.order_number}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Placed on {new Date(viewingOrder.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewingOrder(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Customer info */}
                            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Customer</p>
                                    <p className="font-medium text-gray-800">{viewingOrder.customer_name}</p>
                                    <p className="text-gray-500">{viewingOrder.customer_email}</p>
                                    {viewingOrder.customer_phone && (
                                        <p className="text-gray-500">{viewingOrder.customer_phone}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Shipping Address</p>
                                    <p className="text-gray-600">{viewingOrder.shipping_address || "—"}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-5">
                                <p className="text-gray-400 text-xs uppercase font-semibold mb-1.5">Status</p>
                                <select
                                    value={viewingOrder.status}
                                    disabled={statusUpdating}
                                    onChange={(e) => handleStatusChange(viewingOrder.id, e.target.value)}
                                    className={`text-sm font-semibold px-3 py-1.5 rounded-full border-none focus:outline-none focus:ring-2 cursor-pointer ${STATUS_STYLES[viewingOrder.status] || "bg-gray-100 text-gray-700"}`}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Items */}
                            <div className="mb-5">
                                <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Items</p>
                                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                                    {(viewingOrder.items || []).map((item) => (
                                        <li key={item.id} className="flex items-center gap-3 p-3">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                                    onError={(e) => { e.target.style.display = "none"; }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-md bg-gray-100 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
                                                <p className="text-xs text-gray-400">
                                                    Rs. {item.price} × {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                                                Rs. {item.line_total}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price breakdown */}
                            <div className="flex flex-col gap-2 text-sm border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-800">Rs. {viewingOrder.subtotal}</span>
                                </div>
                                {viewingOrder.coupon_code && (
                                    <div className="flex justify-between">
                                        <span className="text-green-600">Coupon ({viewingOrder.coupon_code})</span>
                                        <span className="font-medium text-green-600">− Rs. {viewingOrder.discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium text-gray-800">Rs. {viewingOrder.shipping_fee}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold pt-2 border-t mt-1">
                                    <span>Grand Total</span>
                                    <span className="text-[#bb1403]">Rs. {viewingOrder.grand_total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

Orders.layout = (page) => page;

export default Orders;