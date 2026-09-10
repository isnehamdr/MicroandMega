import React from 'react'
import { Link } from '@inertiajs/react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/Context/CartContext'

export default function MiniCartDrawer({ isOpen, onClose }) {
    const { items, subtotal, incrementQty, decrementQty, removeItem } = useCart()

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[70] transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ fontFamily: 'Barlow, sans-serif' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[#bb1403]" />
                        Your Cart
                        {items.length > 0 && (
                            <span className="text-sm font-medium text-gray-400">
                                ({items.reduce((s, i) => s + i.quantity, 0)})
                            </span>
                        )}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-gray-400">
                            <ShoppingBag className="h-12 w-12" />
                            <p className="text-sm font-medium">Your cart is empty</p>
                            <Link
                                href="/shop"
                                onClick={onClose}
                                className="text-sm font-bold text-[#bb1403] hover:underline no-underline"
                            >
                                Browse Products →
                            </Link>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ShoppingBag className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Rs. {item.price} each
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => decrementQty(item.id)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => incrementQty(item.id)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-300 hover:text-[#bb1403] transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-sm font-bold text-gray-900 flex-shrink-0">
                                        Rs. {item.price * item.quantity}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                            <span>Subtotal</span>
                            <span className="text-gray-900 font-bold">Rs. {subtotal}</span>
                        </div>
                        <p className="text-xs text-gray-400 -mt-1">
                            Shipping and coupon applied at checkout
                        </p>
                        <Link
                            href="/add-to-cart"
                            onClick={onClose}
                            className="flex items-center justify-center w-full py-3 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm font-bold rounded-full transition-colors no-underline"
                        >
                            View Cart & Checkout
                        </Link>
                    </div>
                )}
            </aside>
        </>
    )
}