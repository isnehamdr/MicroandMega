import axios from "axios";
import { X, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

const imgurl = import.meta.env.VITE_IMAGE_PATH;
const AddUsers = ({ editingUser, setEditingUser, setShowForm, setReloadTrigger, handleUpdate }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        image: null,
    });

    // Use Effect for editing mode
    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || "",
                email: editingUser.email || "",
                password: "", // Don't populate password for security
                password_confirmation: "",
                image: null,
            });
            // Set image preview if editing user has an image
            if (editingUser.image) {
                setImagePreview(editingUser.image);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                image: null,
            });
            setImagePreview(null);
        }
    }, [editingUser]);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle Create User
    const handleCreate = async (formDataToSend) => {
        try {
            await axios.post(route("ourusers.store"), formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating users", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!formData.email.trim()) {
            alert("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Password validation for new users only
        if (!editingUser) {
            if (!formData.password) {
                alert("Password is required");
                return;
            }

            if (formData.password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }

            if (formData.password !== formData.password_confirmation) {
                alert("Passwords do not match");
                return;
            }
        }
        
        const formDataToSend = new FormData();
        
        // Append all form data
        if (formData.name) formDataToSend.append("name", formData.name);
        if (formData.email) formDataToSend.append("email", formData.email);
        
        // Only append password fields for new users or when password is provided in edit mode
        if (!editingUser) {
            if (formData.password) formDataToSend.append("password", formData.password);
            if (formData.password_confirmation) formDataToSend.append("password_confirmation", formData.password_confirmation);
        }
        
        if (formData.image) formDataToSend.append("image", formData.image);
        
        try {
            setSubmitting(true);

            if (editingUser) {
                // Editing existing user
                if (handleUpdate) {
                    await handleUpdate(formDataToSend, editingUser.id);
                }
            } else {
                // Creating new user
                await handleCreate(formDataToSend);
            }
            
            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                image: null,
            });
            setImagePreview(null);
            
            // Close modal
            setShowForm(false);
            setEditingUser(null);
        } catch (error) {
            console.log("Error saving data", error);
            let errorMessage = error.response?.data?.message || "Error saving user data";
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file") {
            const file = files[0];
            if (file) {
                // Clean up previous object URL if it exists
                if (imagePreview && imagePreview.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview);
                }
                
                setFormData((prev) => ({
                    ...prev,
                    [name]: file,
                }));
                
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingUser ? "Edit User" : "Add New User"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingUser(null);
                            // Clean up image preview
                            if (imagePreview && imagePreview.startsWith("blob:")) {
                                URL.revokeObjectURL(imagePreview);
                            }
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={`${imgurl}/${imagePreview}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <svg
                                            className="w-12 h-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="image-upload"
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                                disabled={submitting}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Click the camera icon to upload a profile picture
                        </p>
                    </div>

                    {/* Name and Email in flex row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={submitting}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={editingUser || submitting} // Disable email field when editing
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter email address"
                            />
                            {editingUser && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Email cannot be changed
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password and Confirm Password - Only show for new users */}
                    {!editingUser && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                                        disabled={submitting}
                                        autoComplete="new-password"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        disabled={submitting}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                                        disabled={submitting}
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        disabled={submitting}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingUser(null);
                                // Clean up image preview
                                if (imagePreview && imagePreview.startsWith("blob:")) {
                                    URL.revokeObjectURL(imagePreview);
                                }
                            }}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-[#dc2626] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting && (
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            )}
                            {submitting 
                                ? (editingUser ? "Updating..." : "Creating...") 
                                : (editingUser ? "Update User" : "Create User")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUsers;