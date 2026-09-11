import AdminWrapper from "@/AdminDashboard/AdminWrapper";
import axios from "axios";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const emptyForm = {
    code: "",
    type: "percent",
    value: "",
    min_order_amount: "",
    usage_limit: "",
    expires_at: "",
    status: true,
};

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const res = await axios.get(route("ourcoupons.index"));
                setCoupons(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching coupons", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, [reloadTrigger]);

    const openCreate = () => {
        setEditingCoupon(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (coupon) => {
        setEditingCoupon(coupon);
        setForm({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order_amount: coupon.min_order_amount ?? "",
            usage_limit: coupon.usage_limit ?? "",
            expires_at: coupon.expires_at ? coupon.expires_at.substring(0, 10) : "",
            status: !!coupon.status,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this coupon?")) return;
        try {
            await axios.delete(route("ourcoupons.destroy", { id }));
            setReloadTrigger((p) => !p);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.code.trim() || !form.value) {
            alert("Code and value are required.");
            return;
        }

        const payload = {
            code: form.code.trim(),
            type: form.type,
            value: Number(form.value),
            min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : null,
            usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
            expires_at: form.expires_at || null,
            status: form.status,
        };

        try {
            setSubmitting(true);
            if (editingCoupon) {
                await axios.put(route("ourcoupons.update", { id: editingCoupon.id }), payload);
            } else {
                await axios.post(route("ourcoupons.store"), payload);
            }
            setReloadTrigger((p) => !p);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Error saving coupon.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Coupons
                    </h1>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-[#dc2626] text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium tracking-widest uppercase shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-400">Loading coupons...</div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg font-medium">No coupons yet</p>
                        <p className="text-sm mt-1">Click Create to add your first coupon.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Discount</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Min Order</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Usage</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Expires</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono font-bold text-gray-800">{c.code}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {c.type === "percent" ? `${c.value}%` : `Rs. ${c.value}`}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {c.min_order_amount ? `Rs. ${c.min_order_amount}` : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {c.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(c)}
                                                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-5 pb-4 border-b">
                                <h2 className="text-xl font-bold">
                                    {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                                </h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Code *</label>
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                                        placeholder="e.g. SAVE10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#dc2626] focus:border-[#dc2626]"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
                                        <select
                                            value={form.type}
                                            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#dc2626] focus:border-[#dc2626] bg-white"
                                        >
                                            <option value="percent">Percent (%)</option>
                                            <option value="flat">Flat (Rs.)</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Value *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={form.value}
                                            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#dc2626] focus:border-[#dc2626]"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Order (optional)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.min_order_amount}
                                            onChange={(e) => setForm((f) => ({ ...f, min_order_amount: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#dc2626] focus:border-[#dc2626]"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Usage Limit (optional)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={form.usage_limit}
                                            onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#dc2626] focus:border-[#dc2626]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date *</label>
                                    <input
                                        type="date"
                                        value={form.expires_at}
                                        onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#dc2626] focus:border-[#dc2626]"
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={form.status}
                                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))}
                                        className="rounded border-gray-300"
                                    />
                                    Active
                                </label>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 py-2 bg-[#dc2626] text-white rounded-md hover:bg-[#b91c1c] disabled:opacity-50"
                                    >
                                        {submitting ? "Saving..." : editingCoupon ? "Update" : "Create"}
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

Coupons.layout = (page) => page;

export default Coupons;