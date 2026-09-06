

// import AdminWrapper from "@/AdminDashboard/AdminWrapper";
// import AddCategory from "@/AddForm/AddCategory";
// import axios from "axios";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";
// import MyTable from "@/MyTable/MyTable";

// const imgurl = import.meta.env.VITE_IMAGE_PATH;


// const Category = () => {
//     const [categories, setCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);

//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const res = await axios.get("/ourproductcategories");
//                 const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
//                 setCategories(data);
//             } catch (error) {
//                 console.error("fetching categories error", error);
//             }
//         };
//         fetchCategories();
//     }, [reloadTrigger]);
    
  
  

//     const flatCategories = useMemo(() => {
//         const flatten = (items, parentName = null, acc = []) => {
//             for (const item of items || []) {
//                 acc.push({
//                     ...item,
//                     parentName,
//                     icon_image: item.icon_image,
//                     featured_image: item.featured_image,
//                 });
//                 if (item.children && item.children.length > 0) {
//                     flatten(item.children, item.name, acc);
//                 }
//             }
//             return acc;
//         };
//         return flatten(categories);
//     }, [categories]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await axios.delete(`/ourproductcategories/${id}`);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowAddForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(`/ourproductcategories/${id}`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating Category", error);
//             throw error;
//         }
//     };

//     // Paginated slice
//     const paginatedData = useMemo(() => {
//         const start = (currentPage - 1) * perPage;
//         return flatCategories.slice(start, start + perPage);
//     }, [flatCategories, currentPage, perPage]);

//     const lastPage = useMemo(
//         () => Math.max(1, Math.ceil(flatCategories.length / perPage)),
//         [flatCategories, perPage]
//     );

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 id: "index",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <span className="text-gray-500 font-medium">
//                         {(currentPage - 1) * perPage + row.index + 1}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Icon",
//                 accessor: "icon_image",
//                 disableSortBy: true,
//                 Cell: ({ value, row }) =>
//                     value ? (
//                         <img
//                             src={`${imgurl}/${value}`}
//                             alt={row.original.name}
//                             className="w-6 h-6 object-cover rounded"
//                             onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = "/images/placeholder.jpg";
//                             }}
//                         />
//                     ) : (
//                         <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
//                             —
//                         </div>
//                     ),
//             },
//             {
//                 Header: "Category Name",
//                 accessor: "name",
//                 Cell: ({ value, row }) => (
//                     <div>
//                         <span className="font-medium text-gray-800">{value}</span>
//                         {row.original.parentName && (
//                             <span className="ml-2 text-xs text-gray-400">
//                                 ↳ {row.original.parentName}
//                             </span>
//                         )}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Page Title",
//                 accessor: "title",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value || "—"}</span>
//                 ),
//             },
//             {
//     Header: "Order",
//     accessor: "order",
//     Cell: ({ value }) => (
//         <span className="text-gray-600">{value ?? 0}</span>
//     ),
// },
//             {
//                 Header: "Actions",
//                 id: "actions",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
//                         >
//                             <Pencil size={13} />
//                             Edit
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
//                         >
//                             <Trash2 size={13} />
//                             Delete
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [currentPage, perPage]
//     );

//     return (
//         <AdminWrapper>
//             <div className="container mx-auto py-4">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                         Category
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setEditingCategory(null);
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-[#dc2626] text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium tracking-widest uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Count */}
//                 <p className="text-sm text-gray-500 mb-2">
//                     {flatCategories.length} categor{flatCategories.length !== 1 ? "ies" : "y"} total
//                 </p>

//                 {/* Table */}
//                 <MyTable
//                     columns={columns}
//                     data={paginatedData}
//                     pagination={{
//                         currentPage,
//                         lastPage,
//                         perPage,
//                         onPageChange: (page) => setCurrentPage(page),
//                         onPerPageChange: (size) => {
//                             setPerPage(size);
//                             setCurrentPage(1);
//                         },
//                     }}
//                 />

//                 {/* Empty state */}
//                 {flatCategories.length === 0 && (
//                     <div className="text-center py-16 text-gray-400">
//                         <p className="text-lg font-medium">No categories found</p>
//                         <p className="text-sm mt-1">Click Create to add your first category.</p>
//                     </div>
//                 )}

//                 {/* Add / Edit Modal */}
//                 {showAddForm && (
//                     <AddCategory
//                         editingCategory={editingCategory}
//                         setShowForm={setShowAddForm}
//                         setEditingCategory={setEditingCategory}
//                         setReloadTrigger={setReloadTrigger}
//                         existingCategories={flatCategories}
//                         handleUpdate={handleUpdate}
//                     />
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// Category.layout = (page) => page;

// export default Category;


// import { DragDropProvider } from "@dnd-kit/react";
// import { useSortable } from "@dnd-kit/react/sortable";
// import AdminWrapper from "@/AdminDashboard/AdminWrapper";
// import AddCategory from "@/AddForm/AddCategory";
// import axios from "axios";
// import { Pencil, Plus, Trash2, GripVertical } from "lucide-react";
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import MyTable from "@/MyTable/MyTable";

// const imgurl = import.meta.env.VITE_IMAGE_PATH;

// // Must live OUTSIDE Category — otherwise it's recreated every render and breaks dragging
// const DragHandle = ({ id, index, group, disabled }) => {
//     const { ref, isDragging } = useSortable({ id, index, group, disabled });
//     return (
//         <span
//             ref={ref}
//             className={`inline-flex cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 ${
//                 disabled ? "opacity-30 cursor-not-allowed" : ""
//             } ${isDragging ? "text-[#dc2626]" : ""}`}
//         >
//             <GripVertical size={16} />
//         </span>
//     );
// };

// const groupKeyOf = (row) => row.parent_id ?? "root";

// const Category = () => {
//     const [categories, setCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [savingOrder, setSavingOrder] = useState(false);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const res = await axios.get("/ourproductcategories");
//                 const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
//                 setCategories(data);
//             } catch (error) {
//                 console.error("fetching categories error", error);
//             }
//         };
//         fetchCategories();
//     }, [reloadTrigger]);

//     const flatCategories = useMemo(() => {
//         const flatten = (items, parentName = null, acc = []) => {
//             for (const item of items || []) {
//                 acc.push({
//                     ...item,
//                     parentName,
//                     icon_image: item.icon_image,
//                     featured_image: item.featured_image,
//                 });
//                 if (item.children && item.children.length > 0) {
//                     flatten(item.children, item.name, acc);
//                 }
//             }
//             return acc;
//         };
//         return flatten(categories);
//     }, [categories]);

//     // orderedList holds the FULL list (across all pages). We reorder within this
//     // using row IDs directly, never relying on paginated/local array indices.
//     const [orderedList, setOrderedList] = useState([]);
//     useEffect(() => {
//         setOrderedList(flatCategories);
//     }, [flatCategories]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await axios.delete(`/ourproductcategories/${id}`);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowAddForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(`/ourproductcategories/${id}`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating Category", error);
//             throw error;
//         }
//     };

//     const paginatedData = useMemo(() => {
//         const start = (currentPage - 1) * perPage;
//         return orderedList.slice(start, start + perPage);
//     }, [orderedList, currentPage, perPage]);

//     const lastPage = useMemo(
//         () => Math.max(1, Math.ceil(orderedList.length / perPage)),
//         [orderedList, perPage]
//     );

//     // Count how many rows share each group ON THE CURRENT PAGE (for enabling/disabling drag)
//     const groupCounts = useMemo(() => {
//         const counts = {};
//         paginatedData.forEach((row) => {
//             const key = groupKeyOf(row);
//             counts[key] = (counts[key] || 0) + 1;
//         });
//         return counts;
//     }, [paginatedData]);

//     const dragDisabledMap = useMemo(() => {
//         const map = {};
//         paginatedData.forEach((row) => {
//             map[row.id] = groupCounts[groupKeyOf(row)] <= 1;
//         });
//         return map;
//     }, [paginatedData, groupCounts]);

//     // Position of a row WITHIN ITS GROUP, counting only rows visible on the current page.
//     // Used only to tell dnd-kit the visual order — the actual reorder logic below uses IDs, not this.
//     const groupRelativeIndex = useCallback(
//         (rowId) => {
//             const row = paginatedData.find((r) => r.id === rowId);
//             if (!row) return 0;
//             const group = groupKeyOf(row);
//             return paginatedData
//                 .filter((r) => groupKeyOf(r) === group)
//                 .findIndex((r) => r.id === rowId);
//         },
//         [paginatedData]
//     );

//     const persistOrder = useCallback(async (rowsInGroupOrder) => {
//         const items = rowsInGroupOrder.map((row, idx) => ({ id: row.id, order: idx }));
//         if (items.length === 0) return;
//         console.log("Persisting order:", items); // TEMP: remove once confirmed working
//         try {
//             setSavingOrder(true);
//             const res = await axios.post("/ourproductcategories/reorder", { items });
//             console.log("Reorder response:", res.data); // TEMP: remove once confirmed working
//         } catch (error) {
//             console.error("Error saving order", error);
//             alert("Failed to save new order. Reloading list.");
//             setReloadTrigger((prev) => !prev);
//         } finally {
//             setSavingOrder(false);
//         }
//     }, []);

//     const handleDragEnd = (event) => {
//         const { source, target } = event.operation;
//         console.log("Drag end event:", event.operation); // TEMP: remove once confirmed working

//         if (!source || !target) return;
//         if (source.id === target.id) return;

//         setOrderedList((prev) => {
//             const sourceIndex = prev.findIndex((r) => r.id === source.id);
//             const targetIndex = prev.findIndex((r) => r.id === target.id);
//             if (sourceIndex === -1 || targetIndex === -1) return prev;

//             const sourceRow = prev[sourceIndex];
//             const targetRow = prev[targetIndex];

//             // Never allow dragging across different parent groups
//             if (groupKeyOf(sourceRow) !== groupKeyOf(targetRow)) {
//                 console.log("Blocked: different groups"); // TEMP
//                 return prev;
//             }

//             // Manual reorder by splicing — operates on real array positions found via IDs,
//             // so it can't desync from pagination or dnd-kit's internal index tracking.
//             const next = [...prev];
//             const [moved] = next.splice(sourceIndex, 1);
//             const newTargetIndex = next.findIndex((r) => r.id === target.id);
//             next.splice(newTargetIndex, 0, moved);

//             // Recompute order values for every row in this group (whole list, not just this page)
//             const group = groupKeyOf(sourceRow);
//             const groupRows = next.filter((r) => groupKeyOf(r) === group);
//             persistOrder(groupRows);

//             return next;
//         });
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "",
//                 id: "drag",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <DragHandle
//                         id={row.original.id}
//                         index={groupRelativeIndex(row.original.id)}
//                         group={groupKeyOf(row.original)}
//                         disabled={!!dragDisabledMap[row.original.id]}
//                     />
//                 ),
//             },
//             {
//                 Header: "#",
//                 id: "index",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <span className="text-gray-500 font-medium">
//                         {(currentPage - 1) * perPage + row.index + 1}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Icon",
//                 accessor: "icon_image",
//                 disableSortBy: true,
//                 Cell: ({ value, row }) =>
//                     value ? (
//                         <img
//                             src={`${imgurl}/${value}`}
//                             alt={row.original.name}
//                             className="w-6 h-6 object-cover rounded"
//                             onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = "/images/placeholder.jpg";
//                             }}
//                         />
//                     ) : (
//                         <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
//                             —
//                         </div>
//                     ),
//             },
//             {
//                 Header: "Category Name",
//                 accessor: "name",
//                 Cell: ({ value, row }) => (
//                     <div>
//                         <span className="font-medium text-gray-800">{value}</span>
//                         {row.original.parentName && (
//                             <span className="ml-2 text-xs text-gray-400">
//                                 ↳ {row.original.parentName}
//                             </span>
//                         )}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Page Title",
//                 accessor: "title",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value || "—"}</span>
//                 ),
//             },
//             {
//                 Header: "Order",
//                 accessor: "order",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value ?? 0}</span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 id: "actions",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
//                         >
//                             <Pencil size={13} />
//                             Edit
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
//                         >
//                             <Trash2 size={13} />
//                             Delete
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [currentPage, perPage, dragDisabledMap, groupRelativeIndex]
//     );

//     return (
//         <AdminWrapper>
//             <div className="container mx-auto py-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                         Category
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setEditingCategory(null);
//                             setShowAddForm(true);
//                         }}
//                         className="flex items-center gap-2 bg-[#dc2626] text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium tracking-widest uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 <div className="flex items-center justify-between mb-2">
//                     <p className="text-sm text-gray-500">
//                         {flatCategories.length} categor{flatCategories.length !== 1 ? "ies" : "y"} total
//                     </p>
//                     <p className="text-xs text-gray-400">
//                         Drag to reorder within the same parent group
//                         {savingOrder && <span className="ml-2 text-[#dc2626]">Saving order…</span>}
//                     </p>
//                 </div>

//                 <DragDropProvider onDragEnd={handleDragEnd}>
//                     <MyTable
//                         columns={columns}
//                         data={paginatedData}
//                         pagination={{
//                             currentPage,
//                             lastPage,
//                             perPage,
//                             onPageChange: (page) => setCurrentPage(page),
//                             onPerPageChange: (size) => {
//                                 setPerPage(size);
//                                 setCurrentPage(1);
//                             },
//                         }}
//                     />
//                 </DragDropProvider>

//                 {flatCategories.length === 0 && (
//                     <div className="text-center py-16 text-gray-400">
//                         <p className="text-lg font-medium">No categories found</p>
//                         <p className="text-sm mt-1">Click Create to add your first category.</p>
//                     </div>
//                 )}

//                 {showAddForm && (
//                     <AddCategory
//                         editingCategory={editingCategory}
//                         setShowForm={setShowAddForm}
//                         setEditingCategory={setEditingCategory}
//                         setReloadTrigger={setReloadTrigger}
//                         existingCategories={flatCategories}
//                         handleUpdate={handleUpdate}
//                     />
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// Category.layout = (page) => page;

// export default Category;


import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import AdminWrapper from "@/AdminDashboard/AdminWrapper";
import AddCategory from "@/AddForm/AddCategory";
import axios from "axios";
import { Pencil, Plus, Trash2, GripVertical } from "lucide-react";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import MyTable from "@/MyTable/MyTable";
import { isSortable } from '@dnd-kit/react/sortable';


const imgurl = import.meta.env.VITE_IMAGE_PATH;

// Drag handle icon only — visually indicates draggability. The actual
// sortable registration (the ref dnd-kit needs to measure/track this row)
// now lives on SortableRow below, via useSortable's `handleRef`.
const DragHandleIcon = ({ handleRef, isDragging, disabled }) => (
    <span
        ref={handleRef}
        className={`inline-flex cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 ${
            disabled ? "opacity-30 cursor-not-allowed" : ""
        } ${isDragging ? "text-[#dc2626]" : ""}`}
    >
        <GripVertical size={16} />
    </span>
);

// Row wrapper passed to MyTable as `renderRow`. This is what actually
// registers the <tr> with @dnd-kit as a sortable item — attaching the ref
// only to the small grip icon (as the previous version did) meant dnd-kit
// only ever tracked a 16px hit box, so drops anywhere else on the row were
// invisible to it and onDragEnd's target/source never resolved correctly.
const SortableRow = ({ row, rowProps, className, children, id, index, group, disabled }) => {
    const { ref, handleRef, isDragging } = useSortable({
        id,
        index,
        group,
        disabled,
        // Only start a drag from the grip icon, not anywhere in the row —
        // keeps normal clicks (Edit/Delete buttons, etc.) working.
        handle: true,
    });

    return (
        <tr
            ref={ref}
            {...rowProps}
            className={`${className} ${isDragging ? "opacity-50" : ""}`}
        >
            {React.Children.map(children, (cell, i) =>
                i === 0
                    ? React.cloneElement(cell, {
                          children: React.cloneElement(cell.props.children, {
                              handleRef,
                              isDragging,
                          }),
                      })
                    : cell
            )}
        </tr>
    );
};

const groupKeyOf = (row) => row.parent_id ?? "root";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/ourproductcategories");
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setCategories(data);
            } catch (error) {
                console.error("fetching categories error", error);
            }
        };
        fetchCategories();
    }, [reloadTrigger]);

    const flatCategories = useMemo(() => {
        const flatten = (items, parentName = null, acc = []) => {
            for (const item of items || []) {
                acc.push({
                    ...item,
                    parentName,
                    icon_image: item.icon_image,
                    featured_image: item.featured_image,
                });
                if (item.children && item.children.length > 0) {
                    flatten(item.children, item.name, acc);
                }
            }
            return acc;
        };
        return flatten(categories);
    }, [categories]);

    // orderedList holds the FULL list (across all pages). We reorder within this
    // using row IDs directly, never relying on paginated/local array indices.
    const [orderedList, setOrderedList] = useState([]);
    useEffect(() => {
        setOrderedList(flatCategories);
    }, [flatCategories]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(`/ourproductcategories/${id}`);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowAddForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(`/ourproductcategories/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating Category", error);
            throw error;
        }
    };

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return orderedList.slice(start, start + perPage);
    }, [orderedList, currentPage, perPage]);

    const lastPage = useMemo(
        () => Math.max(1, Math.ceil(orderedList.length / perPage)),
        [orderedList, perPage]
    );

    // Count how many rows share each group ON THE CURRENT PAGE (for enabling/disabling drag)
    const groupCounts = useMemo(() => {
        const counts = {};
        paginatedData.forEach((row) => {
            const key = groupKeyOf(row);
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }, [paginatedData]);

    const dragDisabledMap = useMemo(() => {
        const map = {};
        paginatedData.forEach((row) => {
            map[row.id] = groupCounts[groupKeyOf(row)] <= 1;
        });
        return map;
    }, [paginatedData, groupCounts]);

    // Position of a row WITHIN ITS GROUP, counting only rows visible on the current page.
    // Used only to tell dnd-kit the visual order — the actual reorder logic below uses IDs, not this.
    const groupRelativeIndex = useCallback(
        (rowId) => {
            const row = paginatedData.find((r) => r.id === rowId);
            if (!row) return 0;
            const group = groupKeyOf(row);
            return paginatedData
                .filter((r) => groupKeyOf(r) === group)
                .findIndex((r) => r.id === rowId);
        },
        [paginatedData]
    );

    // const persistOrder = useCallback(async (rowsInGroupOrder) => {
    //     console.log('abbadas')
    //     const items = rowsInGroupOrder.map((row, idx) => ({ id: row.id, order: idx }));
    //     if (items.length === 0) return;
    //     try {
    //         setSavingOrder(true);
    //         await axios.post("/ourproductcategories/reorder", { items });
    //     } catch (error) {
    //         console.error("Error saving order", error);
    //         alert("Failed to save new order. Reloading list.");
    //         setReloadTrigger((prev) => !prev);
    //     } finally {
    //         setSavingOrder(false);
    //     }
    // }, []);

    const persistOrder = useCallback(async (rowsInGroupOrder) => {
    console.log('Reorder payload:', JSON.stringify(rowsInGroupOrder));
    const items = rowsInGroupOrder.map((row, idx) => ({ id: row.id, order: idx }));
    if (items.length === 0) return;
    try {
        setSavingOrder(true);
        await axios.post("/ourproductcategories/reorder", { items });
    } catch (error) {
        console.error("Error saving order", error);
        alert("Failed to save new order. Reloading list.");
        setReloadTrigger((prev) => !prev);
    } finally {
        setSavingOrder(false);
    }
}, []);

//     const handleDragEnd = (event) => {
//         console.log("Drag end event:", event.operation); // TEMP: remove once confirmed working
//          console.log("status:", event.operation?.status);
//   console.log("canceled:", event.canceled);
//   console.log("source:", event.operation?.source?.id);
//   console.log("target:", event.operation?.target?.id);
//         const { source, target } = event.operation;

//         if (!source || !target) return;
//         if (source.id === target.id) return;

//         setOrderedList((prev) => {
//             const sourceIndex = prev.findIndex((r) => r.id === source.id);
//             const targetIndex = prev.findIndex((r) => r.id === target.id);
//             if (sourceIndex === -1 || targetIndex === -1) return prev;

//             const sourceRow = prev[sourceIndex];
//             const targetRow = prev[targetIndex];

//             // Never allow dragging across different parent groups
//             if (groupKeyOf(sourceRow) !== groupKeyOf(targetRow)) {
//                 return prev;
//             }

//             const next = [...prev];
//             const [moved] = next.splice(sourceIndex, 1);
//             const newTargetIndex = next.findIndex((r) => r.id === target.id);
//             next.splice(newTargetIndex, 0, moved);

//             const group = groupKeyOf(sourceRow);

//             // Stamp each row in this group with its new order value (0, 1, 2...)
//             // right away, so the "Order" column reflects the drop immediately
//             // instead of only after persistOrder's response / a page reload.
//             // Rows outside this group are left untouched.
//             let cursor = 0;
//             const stamped = next.map((row) => {
//                 if (groupKeyOf(row) !== group) return row;
//                 return { ...row, order: cursor++ };
//             });

//             const groupRows = stamped.filter((r) => groupKeyOf(r) === group);
//             persistOrder(groupRows);

//             return stamped;
//         });
//     };


const handleDragEnd = (event) => {
    if (event.canceled) return;

    const { source } = event.operation;
    if (!isSortable(source)) return;

    const { id, initialIndex, index, initialGroup, group } = source;

    console.log("[dragEnd] id:", id, "initialIndex:", initialIndex, "index:", index, "initialGroup:", initialGroup, "group:", group);

    // No actual position change
    if (initialIndex === index && initialGroup === group) {
        console.log("[dragEnd] EXIT: no index/group change");
        return;
    }

    // Never allow dragging across different parent groups
    if (initialGroup !== group) {
        console.log("[dragEnd] EXIT: group changed", initialGroup, "->", group);
        return;
    }

    setOrderedList((prev) => {
        const sourceIndex = prev.findIndex((r) => r.id === id);
        if (sourceIndex === -1) {
            console.log("[dragEnd] EXIT: row not found in prev list");
            return prev;
        }

        const sourceRow = prev[sourceIndex];
        const groupKey = groupKeyOf(sourceRow);

        // Get this row's group members in their current order, then move
        // the dragged row to its new relative `index` within that group.
        const groupIndices = prev
            .map((r, i) => (groupKeyOf(r) === groupKey ? i : -1))
            .filter((i) => i !== -1);

        const targetPositionInFullArray = groupIndices[index];

        const next = [...prev];
        const [moved] = next.splice(sourceIndex, 1);
        const insertAt = next.findIndex((_, i) => i === (
            sourceIndex < targetPositionInFullArray ? targetPositionInFullArray - 1 : targetPositionInFullArray
        ));
        next.splice(insertAt === -1 ? next.length : insertAt, 0, moved);

        let cursor = 0;
        const stamped = next.map((row) => {
            if (groupKeyOf(row) !== groupKey) return row;
            return { ...row, order: cursor++ };
        });

        const groupRows = stamped.filter((r) => groupKeyOf(r) === groupKey);
        console.log("[dragEnd] proceeding to persist. groupRows:", groupRows.map(r => r.id));
        persistOrder(groupRows);

        return stamped;
    });
};


    const columns = useMemo(
        () => [
            {
                Header: "",
                id: "drag",
                disableSortBy: true,
                // handleRef/isDragging are injected by SortableRow — this
                // Cell just needs to render the icon that will receive them.
                Cell: ({ row, handleRef, isDragging }) => (
                    <DragHandleIcon
                        handleRef={handleRef}
                        isDragging={isDragging}
                        disabled={!!dragDisabledMap[row.original.id]}
                    />
                ),
            },
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
                Header: "Icon",
                accessor: "icon_image",
                disableSortBy: true,
                Cell: ({ value, row }) =>
                    value ? (
                        <img
                            src={`${imgurl}/${value}`}
                            alt={row.original.name}
                            className="w-6 h-6 object-cover rounded"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder.jpg";
                            }}
                        />
                    ) : (
                        <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            —
                        </div>
                    ),
            },
            {
                Header: "Category Name",
                accessor: "name",
                Cell: ({ value, row }) => (
                    <div>
                        <span className="font-medium text-gray-800">{value}</span>
                        {row.original.parentName && (
                            <span className="ml-2 text-xs text-gray-400">
                                ↳ {row.original.parentName}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                Header: "Page Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value || "—"}</span>
                ),
            },
            {
                Header: "Order",
                accessor: "order",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value ?? 0}</span>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                        >
                            <Pencil size={13} />
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
                        >
                            <Trash2 size={13} />
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        [currentPage, perPage, dragDisabledMap]
    );

    // Renders each <tr> wrapped in @dnd-kit's sortable ref, so the WHOLE row
    // (not just the grip icon) is tracked for drag collision/target detection.
    const renderRow = useCallback(
        ({ row, rowIndex, rowProps, className, children }) => {
            const id = row.original.id;
            return (
                <SortableRow
                    row={row}
                    rowProps={rowProps}
                    className={className}
                    id={id}
                    // index={groupRelativeIndex(id)}
                    index={rowIndex}
                    group={groupKeyOf(row.original)}
                    disabled={!!dragDisabledMap[id]}
                >
                    {children}
                </SortableRow>
            );
        },
        [groupRelativeIndex, dragDisabledMap]
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                        Category
                    </h1>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 bg-[#dc2626] text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium tracking-widest uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">
                        {flatCategories.length} categor{flatCategories.length !== 1 ? "ies" : "y"} total
                    </p>
                    <p className="text-xs text-gray-400">
                        Drag to reorder within the same parent group
                        {savingOrder && <span className="ml-2 text-[#dc2626]">Saving order…</span>}
                    </p>
                </div>

                <DragDropProvider onDragEnd={handleDragEnd}>
                    <MyTable
                        columns={columns}
                        data={paginatedData}
                        renderRow={renderRow}
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
                </DragDropProvider>

                {flatCategories.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg font-medium">No categories found</p>
                        <p className="text-sm mt-1">Click Create to add your first category.</p>
                    </div>
                )}

                {showAddForm && (
                    <AddCategory
                        editingCategory={editingCategory}
                        setShowForm={setShowAddForm}
                        setEditingCategory={setEditingCategory}
                        setReloadTrigger={setReloadTrigger}
                        existingCategories={flatCategories}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

Category.layout = (page) => page;

export default Category;