// HeroSection.jsx
import AddHero from '@/AddForm/AddHero';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminwrapper from '@/AdminDashboard/AdminWrapper';

const imgurl = import.meta.env.VITE_IMAGE_PATH;

const HeroSection = () => {
    const [allHero, setAllHero] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingHero, setEditingHero] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // For fetching the Hero data
    useEffect(() => {
        const fetchHero = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourhero.index"));
                
                // Handle different response structures
                let heroData = [];
                if (Array.isArray(response.data)) {
                    heroData = response.data;
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    heroData = response.data.data;
                } else if (response.data && response.data.heroItems && Array.isArray(response.data.heroItems)) {
                    heroData = response.data.heroItems;
                } else if (response.data && typeof response.data === 'object') {
                    heroData = [response.data];
                }
                
                // Sort by order field
                heroData.sort((a, b) => (a.order || 0) - (b.order || 0));
                setAllHero(heroData);
            } catch (error) {
                console.error("Fetching error: ", error);
                setAllHero([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHero();
    }, [reloadTrigger]);

    // For delete the Hero
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this hero section?")) return;
        
        try {
            await axios.delete(route("ourhero.destroy", { heroSection: id }));
            setReloadTrigger((prev) => !prev);
            alert("Hero section deleted successfully!");
        } catch (error) {
            console.log("Delete error: ", error);
            alert("Error deleting hero section");
        }
    };

    // Handle edit
    const handleEdit = (hero) => {
        setEditingHero(hero);
        setShowForm(true);
    };

    // Handle update after edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourhero.update", { heroSection: id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating Hero: ", error);
            throw error;
        }
    };
    
    // Show loading state
    if (loading) {
        return (
            <Adminwrapper>
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading heroes...</div>
                </div>
            </Adminwrapper>
        );
    }
    
    return (
        <Adminwrapper>
            <div className="p-6">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Hero Management
                        </h1>
                        <p className="text-gray-500 mt-1">Total: {allHero.length} items</p>
                        <p className="text-sm text-gray-400 mt-1">Order can be set manually in the form</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingHero(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create New Hero</span>
                    </button>
                </div>
                
                {/* Display Hero Items as Table List */}
                {allHero.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500">No hero sections found. Click "Create New Hero" to add one.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                            <div className="col-span-1">Order</div>
                            <div className="col-span-4">Hero Details</div>
                            <div className="col-span-3">Tag</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        
                        {/* Table Rows */}
                        <div className="divide-y divide-gray-200">
                            {allHero.map((hero, index) => (
                                <div key={hero.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">
                                    {/* Order Number */}
                                    <div className="col-span-1">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                            {hero.order || index + 1}
                                        </span>
                                    </div>
                                    
                                    {/* Hero Details */}
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-3">
                                            {hero.image && (
                                                <img 
                                                    src={`${imgurl}/${hero.image}`} 
                                                    alt={hero.title}
                                                    className="w-12 h-12 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-medium text-gray-900">{hero.title}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-1">{hero.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Tag */}
                                    <div className="col-span-3">
                                        <span className="text-sm text-gray-600">{hero.tag}</span>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="col-span-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            hero.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {hero.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(hero)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hero.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Pass allHero to AddHero component */}
                <AddHero
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingHero={editingHero}
                    setEditingHero={setEditingHero}
                    handleUpdate={handleUpdate}
                    allHero={allHero}
                />
            </div>
        </Adminwrapper>
    );
};

HeroSection.layout = (page) => page;
export default HeroSection;