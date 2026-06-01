// AddHero.jsx
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const imgurl = import.meta.env.VITE_IMAGE_PATH;
const AddHero = ({ showForm, setShowForm, editingHero, setEditingHero, setReloadTrigger, handleUpdate, allHero = [] }) => {
    const [submitting, setSubmitting] = useState(false);
    const [heroForm, setHeroForm] = useState({
        title: "",
        tag: "",
        description: "",
        image: null,
        button_text: "Get Started",
        button_link: "/contact",
        is_active: true,
        order: 0
    });

    // Use Effect for editing
    useEffect(() => {
        if (editingHero) {
            setHeroForm({
                title: editingHero.title || "",
                tag: editingHero.tag || "",
                description: editingHero.description || "",
                image: null,
                button_text: editingHero.button_text || "Get Started",
                button_link: editingHero.button_link || "/contact",
                is_active: editingHero.is_active === 1 || editingHero.is_active === true,
                order: editingHero.order || 0
            });
        } else {
            // For new hero, find the smallest available order number
            let suggestedOrder = 1;
            const existingOrders = allHero.map(hero => parseInt(hero.order) || 0).sort((a, b) => a - b);
            
            // Find the first gap in orders
            for (let i = 1; i <= existingOrders.length + 1; i++) {
                if (!existingOrders.includes(i)) {
                    suggestedOrder = i;
                    break;
                }
            }
            
            setHeroForm({
                title: "",
                tag: "",
                description: "",
                image: null,
                button_text: "Get Started",
                button_link: "/contact",
                is_active: true,
                order: suggestedOrder
            });
        }
    }, [editingHero, allHero]);

    // Handle Create Hero
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourhero.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating hero", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate image is required for new hero
        if (!editingHero && !heroForm.image) {
            alert("Please select an image");
            return;
        }
        
        const formData = new FormData();
        
        // Append all form data
        for (const key in heroForm) {
            if (heroForm[key] !== null && heroForm[key] !== "") {
                if (key === 'is_active') {
                    formData.append(key, heroForm[key] ? '1' : '0');
                } else if (key === 'order') {
                    const orderValue = parseInt(heroForm[key]);
                    formData.append(key, isNaN(orderValue) ? 0 : orderValue);
                } else if (key !== 'image') {
                    formData.append(key, heroForm[key]);
                }
            }
        }
        
        // Append image separately if it exists
        if (heroForm.image) {
            formData.append('image', heroForm.image);
        }
        
        try {
            setSubmitting(true);
            
            if (editingHero) {
                await handleUpdate(formData, editingHero.id);
            } else {
                await handleCreate(formData);
            }
            
            // Reset form and close modal
            setHeroForm({
                title: "",
                tag: "",
                description: "",
                image: null,
                button_text: "Get Started",
                button_link: "/contact",
                is_active: true,
                order: 0
            });
            setShowForm(false);
            setEditingHero(null);
            alert(editingHero ? "Hero updated successfully!" : "Hero created successfully!");
        } catch (error) {
            console.log("Error saving data", error);
            alert("Error saving hero section. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for all inputs including image
    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        setHeroForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
        }));
    };

    if (!showForm) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingHero ? "Edit Hero Section" : "Add New Hero Section"}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                            setEditingHero(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Order Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order *
                        </label>
                        <input
                            type="number"
                            name="order"
                            value={heroForm.order}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter order number (1 = highest priority)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Items will be displayed in ascending order (smaller numbers first)
                        </p>
                        {!editingHero && (
                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-blue-600">
                                    💡 Available order positions: 
                                    {(() => {
                                        const existingOrders = allHero.map(h => parseInt(h.order) || 0).sort((a, b) => a - b);
                                        const availableOrders = [];
                                        for (let i = 1; i <= existingOrders.length + 1; i++) {
                                            if (!existingOrders.includes(i)) {
                                                availableOrders.push(i);
                                            }
                                        }
                                        return availableOrders.join(', ');
                                    })()}
                                </p>
                                <p className="text-xs text-green-600">
                                    ✓ Suggested: {heroForm.order}
                                </p>
                            </div>
                        )}
                        {/* {editingHero && (
                            <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Tip: Changing the order will automatically reorder other items
                            </p>
                        )} */}
                    </div>
                    
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={heroForm.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter hero title"
                        />
                    </div>
                    
                    {/* Tag */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tag *
                        </label>
                        <input
                            type="text"
                            name="tag"
                            value={heroForm.tag}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter tag (e.g., Welcome to our site)"
                        />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={heroForm.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter description"
                        />
                    </div>
                    
                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image {!editingHero && "*"}
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required={!editingHero}
                        />
                        {editingHero && editingHero.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500">Current image:</p>
                                <img 
                                    src={`${imgurl}/${editingHero.image}`} 
                                    alt="Current"
                                    className="mt-1 h-16 w-auto object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Button Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Text
                        </label>
                        <input
                            type="text"
                            name="button_text"
                            value={heroForm.button_text}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Get Started"
                        />
                    </div>
                    
                    {/* Button Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Link
                        </label>
                        <input
                            type="text"
                            name="button_link"
                            value={heroForm.button_link}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="/contact"
                        />
                    </div>
                    
                    {/* Active Status */}
                    <div className="flex items-center pt-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={heroForm.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Active (Show on Frontend)
                        </label>
                    </div>
                    
                    {/* Form Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingHero(null);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : editingHero ? "Update Hero" : "Create Hero"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHero;