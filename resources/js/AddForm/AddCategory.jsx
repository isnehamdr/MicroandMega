import axios from "axios";
import { X, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
const imgurl = import.meta.env.VITE_IMAGE_PATH;
const resolveImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${imgurl}/${path}`;
};
const AddCategory = ({
    editingCategory,
    setEditingCategory,
    setShowForm,
    setReloadTrigger,
    handleUpdate,
    existingCategories = null,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);

    const [categoryForm, setCategoryForm] = useState({
        name: "",
        slug: "",
        description: "",
        title: "",
        content: "",
        icon_image: null,
        featured_image: null,
        parent_id: "",
        order: "",
        status: true,
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        if (existingCategories && existingCategories.length > 0) {
            setCategories(existingCategories);
        } else {
            fetchCategories();
        }
    }, [existingCategories]);

   useEffect(() => {
    if (editingCategory) {
        setCategoryForm({
            name: editingCategory.name || "",
            slug: editingCategory.slug || "",
            description: editingCategory.description || "",
            title: editingCategory.title || "",
            content: editingCategory.content || "",
            icon_image: null,
            featured_image: null,
            parent_id: editingCategory.parent_id || "",
            order: editingCategory.order ?? "",
            status: editingCategory.status ?? true,
        });
        setCategoriesError("");
        setSlugTouched(true);
    } else {
        setCategoryForm({
            name: "", slug: "", description: "", title: "", content: "",
            icon_image: null, featured_image: null, parent_id: "", order: "", status: true,
        });
        setSlugTouched(false);
    }
}, [editingCategory]);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            setCategoriesError("");
            const response = await axios.get("/ourproductcategories/flat");
            const list = Array.isArray(response.data) ? response.data : response.data?.data || [];
            setCategories(list);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
            setCategoriesError("Unable to load categories. Please refresh.");
        } finally {
            setCategoriesLoading(false);
        }
    };

    const parentOptions = useMemo(() => {
        return categories
            .filter((c) => !editingCategory || c.id !== editingCategory.id)
            .map((c) => ({
                value: c.id,
                label: c.parent_name ? `└─ ${c.name}` : c.name,
                parentName: c.parent_name || null,
            }));
    }, [categories, editingCategory]);

    const selectedParentOption =
        parentOptions.find((o) => o.value === categoryForm.parent_id) || null;

    const normalizeSlug = (value) =>
        value.toString().trim().toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const buildUniqueSlug = (base, existingSet) => {
        if (!base) return "";
        let slug = base;
        let counter = 2;
        while (existingSet.has(slug)) { slug = `${base}-${counter}`; counter++; }
        return slug;
    };

    useEffect(() => {
        if (slugTouched || !categoryForm.name) return;
        const existing = new Set(
            categories
                .filter((c) => !editingCategory || c.id !== editingCategory.id)
                .map((c) => c.slug)
        );
        setCategoryForm((prev) => ({ ...prev, slug: buildUniqueSlug(normalizeSlug(categoryForm.name), existing) }));
    }, [categories, categoryForm.name, editingCategory, slugTouched]);

    const handleNameChange = (e) => {
        const nextName = e.target.value;
        setCategoryForm((prev) => ({ ...prev, name: nextName }));
        if (slugTouched) return;
        const existing = new Set(
            categories
                .filter((c) => !editingCategory || c.id !== editingCategory.id)
                .map((c) => c.slug)
        );
        setCategoryForm((prev) => ({ ...prev, name: nextName, slug: buildUniqueSlug(normalizeSlug(nextName), existing) }));
    };

    const handleCreate = async (formData) => {
        try {
            const response = await axios.post("/ourproductcategories", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
            return response;
        } catch (error) {
            console.log("Error creating category", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) { alert("Category name is required"); return; }
        if (!categoryForm.slug.trim()) { alert("Slug is required"); return; }

       const formData = new FormData();
for (const key in categoryForm) {
    if (key === "icon_image" || key === "featured_image") {
        if (categoryForm[key]) formData.append(key, categoryForm[key]);
    } else if (key === "parent_id") {
        if (categoryForm.parent_id !== "" && categoryForm.parent_id !== null)
            formData.append("parent_id", categoryForm.parent_id);
    } else if (key === "status") {
        formData.append("status", categoryForm.status ? "1" : "0");
    } else if (key === "order") {
        formData.append("order", categoryForm.order === "" ? 0 : categoryForm.order);
    } else if (categoryForm[key] !== null && categoryForm[key] !== "") {
        formData.append(key, categoryForm[key]);
    }
}

        try {
            setSubmitting(true);
            if (editingCategory) {
                await handleUpdate(formData, editingCategory.id);
            } else {
                await handleCreate(formData);
            }
            setCategoryForm({
                name: "", slug: "", description: "", title: "", content: "",
                icon_image: null, featured_image: null, parent_id: "", status: true,
            });
            setSlugTouched(false);
            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            const validationErrors = error?.response?.data?.errors || null;
            const serverMessage = error?.response?.data?.message || error?.response?.data?.error || null;
            if (validationErrors) {
                const firstField = Object.keys(validationErrors)[0];
                alert(validationErrors[firstField]?.[0] || "Please check the form fields.");
            } else {
                alert(serverMessage || "Error saving category. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setCategoryForm((prev) => ({ ...prev, [name]: files[0] }));
        } else if (type === "checkbox") {
            setCategoryForm((prev) => ({ ...prev, [name]: e.target.checked }));
        } else {
            setCategoryForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#dc2626" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 1px #dc2626" : "none",
            "&:hover": { borderColor: "#dc2626" },
            borderRadius: "0.375rem",
            minHeight: "38px",
        }),
        option: (base, { data, isSelected, isFocused }) => ({
            ...base,
            paddingLeft: data.parentName ? "28px" : "12px",
            backgroundColor: isSelected ? "#dc2626" : isFocused ? "#fee2e2" : "white",
            color: isSelected ? "white" : "#111827",
            fontSize: "0.875rem",
        }),
        placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
        singleValue: (base) => ({ ...base, fontSize: "0.875rem" }),
    };

    // Shared style tokens
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
    const hintClass  = "text-xs text-gray-400 mb-1.5";
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#dc2626] focus:border-[#dc2626] transition";

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            // Removed the onClick handler that was closing the form when clicking the backdrop
        >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl flex flex-col">

                {/* ── Sticky Header ── */}
                <div className="z-10 flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wide">
                        {editingCategory ? "Edit Category" : "Add New Category"}
                    </h2>
                    <button type="button" onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={22} />
                    </button>
                </div>

                {/* ── Form Body ── */}
                <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-8">

                    {/* ── Section 1: Basic Information ── */}
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                            Basic Information
                        </p>

                        {/* Parent Category + Category Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Parent Category</label>
                                <p className={hintClass}>Leave empty to create a top-level category.</p>
                                <Select
                                    options={parentOptions}
                                    value={selectedParentOption}
                                    onChange={(selected) =>
                                        setCategoryForm((prev) => ({
                                            ...prev,
                                            parent_id: selected ? selected.value : "",
                                        }))
                                    }
                                    isLoading={categoriesLoading}
                                    placeholder="-- None (top level) --"
                                    isClearable
                                    styles={selectStyles}
                                    noOptionsMessage={() => categoriesError || "No categories found"}
                                />
                                {categoriesError && (
                                    <p className="text-xs text-red-500">{categoriesError}</p>
                                )}
                            </div> */}

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <p className={hintClass}>The display name shown in menus and listings.</p>
                                <input
                                    type="text"
                                    name="name"
                                    value={categoryForm.name}
                                    onChange={handleNameChange}
                                    required
                                    placeholder="e.g., Fire & Safety"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Slug + Page Title */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <p className={hintClass}>Auto-generated from name. Edit if needed.</p>
                                <input
                                    type="text"
                                    name="slug"
                                    value={categoryForm.slug}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        handleChange(e);
                                    }}
                                    required
                                    placeholder="e.g., fire-and-safety"
                                    className={`${inputClass} font-mono text-xs`}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Page Title</label>
                                <p className={hintClass}>Shown as the heading on the category detail page.</p>
                                <input
                                    type="text"
                                    name="title"
                                    value={categoryForm.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Fire & Safety Solutions"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
    <label className={labelClass}>Order</label>
    <p className={hintClass}>Lower numbers appear first.</p>
    <input
        type="number"
        name="order"
        min="0"
        value={categoryForm.order}
        onChange={handleChange}
        placeholder="0"
        className={inputClass}
    />
</div>


                    {/* ── Section 2: Content ── */}
                    <div className="flex flex-col gap-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                            Content
                        </p>

                        {/* Short Description */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Short Description</label>
                            <p className={hintClass}>
                                A brief summary shown on listing and category pages.
                            </p>
                            {/* Fixed-height Quill wrapper — toolbar ~42px + editor 180px = 222px → give 240px */}
                            <div style={{
                                height: "240px",
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                overflow: "hidden",
                            }}>
                                <ReactQuill
                                    theme="snow"
                                    value={categoryForm.description}
                                    onChange={(value) =>
                                        setCategoryForm((prev) => ({ ...prev, description: value }))
                                    }
                                    placeholder="Brief description of this category..."
                                    style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
                                />
                            </div>
                        </div>

                        {/* Detailed Content */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Detailed Content</label>
                            <p className={hintClass}>
                                Full content shown on the category detail page. Supports rich text formatting.
                            </p>
                            {/* Fixed-height Quill wrapper — toolbar ~42px + editor 280px = 322px → give 340px */}
                            <div style={{
                                height: "340px",
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                overflow: "hidden",
                            }}>
                                <ReactQuill
                                    theme="snow"
                                    value={categoryForm.content}
                                    onChange={(value) =>
                                        setCategoryForm((prev) => ({ ...prev, content: value }))
                                    }
                                    placeholder="Full content for the category detail page..."
                                    style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Supports headings, lists, bold, italic, links and more.
                            </p>
                        </div>
                    </div>

                    {/* ── Section 3: Images ── */}
                    <div className="flex flex-col gap-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                            Images
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Icon Image */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Icon Image
                                    <span className="text-gray-400 font-normal ml-1 text-xs">(sidebar / menu)</span>
                                </label>
                                <p className={hintClass}>Small icon displayed in navigation menus.</p>

                                {editingCategory?.icon_image && !categoryForm.icon_image && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <img
                                            src={resolveImageUrl(editingCategory.icon_image)}
                                            alt="Current icon"
                                            className="h-12 w-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Current icon.{" "}
                                            <span className="text-gray-400">Upload to replace.</span>
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    name="icon_image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className={inputClass}
                                />

                                {categoryForm.icon_image && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <img
                                            src={URL.createObjectURL(categoryForm.icon_image)}
                                            alt="New icon preview"
                                            className="h-12 w-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-medium text-gray-600">New icon selected</p>
                                            <button
                                                type="button"
                                                onClick={() => setCategoryForm((prev) => ({ ...prev, icon_image: null }))}
                                                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 w-fit"
                                            >
                                                <Trash2 size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Featured Image */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Featured Image
                                    <span className="text-gray-400 font-normal ml-1 text-xs">(category page banner)</span>
                                </label>
                                <p className={hintClass}>Large hero/banner image for the category detail page.</p>

                                {editingCategory?.featured_image && !categoryForm.featured_image && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <img
                                            src={resolveImageUrl(editingCategory.featured_image)}
                                            alt="Current featured"
                                            className="h-12 w-20 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Current banner.{" "}
                                            <span className="text-gray-400">Upload to replace.</span>
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    name="featured_image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className={inputClass}
                                />

                                {categoryForm.featured_image && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <img
                                            src={URL.createObjectURL(categoryForm.featured_image)}
                                            alt="New featured preview"
                                            className="h-12 w-20 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-medium text-gray-600">New banner selected</p>
                                            <button
                                                type="button"
                                                onClick={() => setCategoryForm((prev) => ({ ...prev, featured_image: null }))}
                                                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 w-fit"
                                            >
                                                <Trash2 size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Sticky Footer Actions ── */}
                    <div className="flex justify-end gap-3 pt-4 pb-2 border-t border-gray-200 bg-white z-10 mt-2">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="px-5 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-sm bg-[#dc2626] text-white rounded-md transition font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                        >
                            {submitting
                                ? "Saving..."
                                : editingCategory
                                ? "Update Category"
                                : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;