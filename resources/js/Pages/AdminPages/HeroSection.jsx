// resources/js/AdminDashboard/HeroSection.jsx

import AdminWrapper from '@/AdminDashboard/AdminWrapper'
import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Plus, Edit, Trash2, X } from 'lucide-react'

export default function HeroSection() {
  const { heroItems, flash } = usePage().props
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    description: '',
    button_text: 'Get Started',
    button_link: '/contact',
    is_active: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key])
    })
    
    if (imageFile) {
      data.append('image', imageFile)
    }
    
    if (editingItem) {
      data.append('_method', 'PUT')
      router.post(`/admin/hero/${editingItem.id}`, data, {
        onSuccess: () => {
          setShowModal(false)
          resetForm()
        }
      })
    } else {
      router.post('/admin/hero', data, {
        onSuccess: () => {
          setShowModal(false)
          resetForm()
        }
      })
    }
  }

  const deleteItem = (item) => {
    if (confirm('Delete this hero item?')) {
      router.delete(`/admin/hero/${item.id}`)
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      tag: '',
      description: '',
      button_text: 'Get Started',
      button_link: '/contact',
      is_active: true
    })
    setImageFile(null)
    setImagePreview('')
  }

  const editItem = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      tag: item.tag,
      description: item.description,
      button_text: item.button_text,
      button_link: item.button_link,
      is_active: item.is_active
    })
    setImagePreview(`/storage/${item.image}`)
    setShowModal(true)
  }

  return (
    <AdminWrapper>
      <div className="p-6">
        {flash?.success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {flash.success}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hero Section Manager</h1>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus size={20} /> Add New Hero Item
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {heroItems?.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              <img 
                src={`/storage/${item.image}`} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => editItem(item)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteItem(item)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.tag}</p>
                <p className="text-gray-700 text-sm line-clamp-2">{item.description}</p>
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Order: {item.order}</span>
                  <span className={item.is_active ? 'text-green-600' : 'text-gray-400'}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {heroItems?.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hero items yet. Click "Add New Hero Item" to create one.</p>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingItem ? 'Edit Hero Item' : 'Add Hero Item'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter main heading"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tag/Badge *</label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Premium Security Solutions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter detailed description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Background Image *</label>
                  {imagePreview && (
                    <div className="mb-2">
                      <img src={imagePreview} alt="Preview" className="h-32 rounded object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setImageFile(file)
                        setImagePreview(URL.createObjectURL(file))
                      }
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x1080px</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Get Started"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({...formData, button_link: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="/contact"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded text-red-600"
                  />
                  <span>Active (show on website)</span>
                </label>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminWrapper>
  )
}