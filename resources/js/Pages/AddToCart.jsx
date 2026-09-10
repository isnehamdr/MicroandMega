// import React, { useState, useMemo } from 'react'
// import { Link, Head } from '@inertiajs/react'
// import { Plus, Minus, Trash2, ShoppingBag, Tag, Truck, ArrowRight, X } from 'lucide-react'
// import { useCart } from '@/Context/CartContext'

// // Dummy coupon codes for now — backend will provide real validation later.
// // Structure: { code: { type: 'percent' | 'flat', value: number, label } }
// const DUMMY_COUPONS = {
//     TEST10: { type: 'percent', value: 10, label: '10% off' },
//     SAVE50: { type: 'flat', value: 50, label: 'Rs. 50 off' },
// }

// // Dummy flat shipping fee — backend will supply real shipping logic later.
// const DUMMY_SHIPPING_FEE = 100

// export default function AddToCart() {
//     const { items, subtotal, incrementQty, decrementQty, removeItem, setQuantity, clearCart } = useCart()

//     const [couponInput, setCouponInput] = useState('')
//     const [appliedCoupon, setAppliedCoupon] = useState(null) // { code, type, value, label }
//     const [couponError, setCouponError] = useState('')

//     const handleApplyCoupon = (e) => {
//         e.preventDefault()
//         const code = couponInput.trim().toUpperCase()
//         if (!code) return

//         const match = DUMMY_COUPONS[code]
//         if (!match) {
//             setCouponError('Invalid or expired coupon code.')
//             setAppliedCoupon(null)
//             return
//         }

//         setAppliedCoupon({ code, ...match })
//         setCouponError('')
//     }

//     const handleRemoveCoupon = () => {
//         setAppliedCoupon(null)
//         setCouponInput('')
//         setCouponError('')
//     }

//     const discount = useMemo(() => {
//         if (!appliedCoupon) return 0
//         if (appliedCoupon.type === 'percent') {
//             return Math.round((subtotal * appliedCoupon.value) / 100)
//         }
//         return Math.min(appliedCoupon.value, subtotal)
//     }, [appliedCoupon, subtotal])

//     const shippingFee = items.length > 0 ? DUMMY_SHIPPING_FEE : 0

//     const grandTotal = Math.max(0, subtotal - discount) + shippingFee

//     return (
//         <>
//             <Head title="Your Cart" />

//             <div
//                 className="min-h-screen bg-gray-50 pt-32 pb-20 sm:pt-40"
//                 style={{ fontFamily: 'Barlow, sans-serif' }}
//             >
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-6 sm:mb-8">
//                         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2.5">
//                             <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-[#bb1403]" />
//                             Your Cart
//                         </h1>
//                         {items.length > 0 && (
//                             <button
//                                 onClick={clearCart}
//                                 className="text-sm font-semibold text-gray-400 hover:text-[#bb1403] transition-colors"
//                             >
//                                 Clear Cart
//                             </button>
//                         )}
//                     </div>

//                     {items.length === 0 ? (
//                         /* Empty state */
//                         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 px-6 flex flex-col items-center text-center gap-4">
//                             <ShoppingBag className="h-16 w-16 text-gray-200" />
//                             <div>
//                                 <p className="text-lg font-bold text-gray-800">Your cart is empty</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                     Browse our products and add items to get started.
//                                 </p>
//                             </div>
//                             <Link
//                                 href="/shop"
//                                 className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm font-bold rounded-full transition-colors no-underline"
//                             >
//                                 Browse Products
//                                 <ArrowRight className="h-4 w-4" />
//                             </Link>
//                         </div>
//                     ) : (
//                         <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

//                             {/* ── Left: line items ─────────────────────────── */}
//                             <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                                 <ul className="divide-y divide-gray-100">
//                                     {items.map((item) => (
//                                         <li key={item.id} className="p-4 sm:p-5 flex gap-3 sm:gap-4">
//                                             {/* Image */}
//                                             <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
//                                                 {item.image ? (
//                                                     <img
//                                                         src={item.image}
//                                                         alt={item.name}
//                                                         className="w-full h-full object-contain"
//                                                         onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }}
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full flex items-center justify-center text-gray-300">
//                                                         <ShoppingBag className="h-8 w-8" />
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Details */}
//                                             <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2">
//                                                         {item.name}
//                                                     </p>
//                                                     <p className="text-xs sm:text-sm text-gray-400 mt-1">
//                                                         Rs. {item.price} each
//                                                     </p>
//                                                     <span
//                                                         className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
//                                                             ${item.stock_status === 'out_of_stock'
//                                                                 ? 'bg-gray-100 text-gray-400'
//                                                                 : item.stock_status === 'low_stock'
//                                                                 ? 'bg-yellow-100 text-yellow-700'
//                                                                 : 'bg-green-100 text-green-700'}`}
//                                                     >
//                                                         {item.stock_status === 'out_of_stock'
//                                                             ? 'Out of Stock'
//                                                             : item.stock_status === 'low_stock'
//                                                             ? 'Low Stock'
//                                                             : 'In Stock'}
//                                                     </span>
//                                                 </div>

//                                                 {/* Qty + remove + line total */}
//                                                 <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-shrink-0">
//                                                     <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-1.5 py-1">
//                                                         <button
//                                                             onClick={() => decrementQty(item.id)}
//                                                             className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
//                                                             aria-label="Decrease quantity"
//                                                         >
//                                                             <Minus className="h-3.5 w-3.5" />
//                                                         </button>
//                                                         <input
//                                                             type="number"
//                                                             min="1"
//                                                             value={item.quantity}
//                                                             onChange={(e) => setQuantity(item.id, parseInt(e.target.value, 10) || 0)}
//                                                             className="w-9 text-center text-sm font-bold border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                                         />
//                                                         <button
//                                                             onClick={() => incrementQty(item.id)}
//                                                             className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
//                                                             aria-label="Increase quantity"
//                                                         >
//                                                             <Plus className="h-3.5 w-3.5" />
//                                                         </button>
//                                                     </div>

//                                                     <span className="text-sm sm:text-base font-bold text-gray-900 w-16 text-right flex-shrink-0">
//                                                         Rs. {item.price * item.quantity}
//                                                     </span>

//                                                     <button
//                                                         onClick={() => removeItem(item.id)}
//                                                         className="text-gray-300 hover:text-[#bb1403] transition-colors flex-shrink-0"
//                                                         aria-label="Remove item"
//                                                     >
//                                                         <Trash2 className="h-5 w-5" />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* ── Right: price breakdown ───────────────────── */}
//                             <div className="w-full lg:w-[380px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-28">
//                                 <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

//                                 {/* Coupon */}
//                                 <div className="mb-5">
//                                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
//                                         <Tag className="h-3.5 w-3.5" />
//                                         Coupon Code
//                                     </label>

//                                     {appliedCoupon ? (
//                                         <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-200">
//                                             <span className="text-sm font-semibold text-green-700">
//                                                 {appliedCoupon.code} applied — {appliedCoupon.label}
//                                             </span>
//                                             <button
//                                                 onClick={handleRemoveCoupon}
//                                                 className="text-green-600 hover:text-green-800 flex-shrink-0"
//                                                 aria-label="Remove coupon"
//                                             >
//                                                 <X className="h-4 w-4" />
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <form onSubmit={handleApplyCoupon} className="flex gap-2">
//                                             <input
//                                                 type="text"
//                                                 value={couponInput}
//                                                 onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }}
//                                                 placeholder="Enter code"
//                                                 className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb1403] focus:border-[#bb1403]"
//                                             />
//                                             <button
//                                                 type="submit"
//                                                 className="px-4 py-2.5 text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors flex-shrink-0"
//                                             >
//                                                 Apply
//                                             </button>
//                                         </form>
//                                     )}
//                                     {couponError && (
//                                         <p className="text-xs text-[#bb1403] mt-1.5">{couponError}</p>
//                                     )}
//                                     <p className="text-[11px] text-gray-400 mt-1.5">
//                                         Try <span className="font-semibold">TEST10</span> or <span className="font-semibold">SAVE50</span> (demo codes)
//                                     </p>
//                                 </div>

//                                 {/* Breakdown */}
//                                 <div className="flex flex-col gap-3 py-4 border-t border-b border-gray-100">
//                                     <div className="flex items-center justify-between text-sm">
//                                         <span className="text-gray-500">Subtotal</span>
//                                         <span className="font-semibold text-gray-800">Rs. {subtotal}</span>
//                                     </div>

//                                     {appliedCoupon && (
//                                         <div className="flex items-center justify-between text-sm">
//                                             <span className="text-green-600">Coupon ({appliedCoupon.code})</span>
//                                             <span className="font-semibold text-green-600">− Rs. {discount}</span>
//                                         </div>
//                                     )}

//                                     <div className="flex items-center justify-between text-sm">
//                                         <span className="text-gray-500 flex items-center gap-1.5">
//                                             <Truck className="h-3.5 w-3.5" />
//                                             Shipping
//                                         </span>
//                                         <span className="font-semibold text-gray-800">Rs. {shippingFee}</span>
//                                     </div>
//                                 </div>

//                                 {/* Grand total */}
//                                 <div className="flex items-center justify-between py-4">
//                                     <span className="text-base font-bold text-gray-900">Grand Total</span>
//                                     <span className="text-xl font-extrabold text-[#bb1403]">Rs. {grandTotal}</span>
//                                 </div>

//                                 <button
//                                     className="w-full py-3.5 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2"
//                                     onClick={() => alert('Checkout is not wired up yet — backend integration pending.')}
//                                 >
//                                     Proceed to Checkout
//                                     <ArrowRight className="h-4 w-4" />
//                                 </button>

//                                 <p className="text-[11px] text-gray-400 text-center mt-3">
//                                     Prices shown are placeholders. Final pricing will be confirmed at checkout.
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }




import React, { useState, useMemo } from 'react'
import { Link, Head } from '@inertiajs/react'
import axios from 'axios'
import { Plus, Minus, Trash2, ShoppingBag, Tag, Truck, ArrowRight, X } from 'lucide-react'
import { useCart } from '@/Context/CartContext'

// Dummy coupon codes for now — backend will provide real validation later.
// Structure: { code: { type: 'percent' | 'flat', value: number, label } }
const DUMMY_COUPONS = {
    TEST10: { type: 'percent', value: 10, label: '10% off' },
    SAVE50: { type: 'flat', value: 50, label: 'Rs. 50 off' },
}

// Dummy flat shipping fee — backend will supply real shipping logic later.
const DUMMY_SHIPPING_FEE = 100

export default function AddToCart() {
    const { items, subtotal, incrementQty, decrementQty, removeItem, setQuantity, clearCart } = useCart()

    const [couponInput, setCouponInput] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null) // { code, type, value, label }
    const [couponError, setCouponError] = useState('')

    const [checkoutForm, setCheckoutForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
    })
    const [checkoutSubmitting, setCheckoutSubmitting] = useState(false)
    const [checkoutError, setCheckoutError] = useState('')
    const [orderPlaced, setOrderPlaced] = useState(null) // holds { order_number } after success

    const handleApplyCoupon = (e) => {
        e.preventDefault()
        const code = couponInput.trim().toUpperCase()
        if (!code) return

        const match = DUMMY_COUPONS[code]
        if (!match) {
            setCouponError('Invalid or expired coupon code.')
            setAppliedCoupon(null)
            return
        }

        setAppliedCoupon({ code, ...match })
        setCouponError('')
    }

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null)
        setCouponInput('')
        setCouponError('')
    }

    const discount = useMemo(() => {
        if (!appliedCoupon) return 0
        if (appliedCoupon.type === 'percent') {
            return Math.round((subtotal * appliedCoupon.value) / 100)
        }
        return Math.min(appliedCoupon.value, subtotal)
    }, [appliedCoupon, subtotal])

    const shippingFee = items.length > 0 ? DUMMY_SHIPPING_FEE : 0

    const grandTotal = Math.max(0, subtotal - discount) + shippingFee

    const handleCheckout = async () => {
        if (!checkoutForm.customer_name.trim() || !checkoutForm.customer_email.trim()) {
            setCheckoutError('Name and email are required.')
            return
        }

        try {
            setCheckoutSubmitting(true)
            setCheckoutError('')

            const payload = {
                ...checkoutForm,
                coupon_code: appliedCoupon?.code || null,
                discount,
                shipping_fee: shippingFee,
                items: items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    image: i.image,
                    price: i.price,
                    quantity: i.quantity,
                })),
            }

            const res = await axios.post('/checkout', payload)

            setOrderPlaced({ order_number: res.data?.data?.order_number })
            clearCart()
            setAppliedCoupon(null)
            setCouponInput('')
            setCheckoutForm({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                shipping_address: '',
            })
        } catch (error) {
            console.error('Checkout error', error)
            setCheckoutError(
                error?.response?.data?.message || 'Something went wrong placing your order. Please try again.'
            )
        } finally {
            setCheckoutSubmitting(false)
        }
    }

    return (
        <>
            <Head title="Your Cart" />

            <div
                className="min-h-screen bg-gray-50 pt-32 pb-20 sm:pt-40"
                style={{ fontFamily: 'Barlow, sans-serif' }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2.5">
                            <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-[#bb1403]" />
                            Your Cart
                        </h1>
                        {items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm font-semibold text-gray-400 hover:text-[#bb1403] transition-colors"
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {/* Order success banner */}
                    {orderPlaced && (
                        <div className="mb-6 px-5 py-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-green-700">
                                Order placed successfully! Your order number is{' '}
                                <span className="font-extrabold">{orderPlaced.order_number}</span>.
                                We'll email you with updates.
                            </p>
                            <button
                                onClick={() => setOrderPlaced(null)}
                                className="text-green-600 hover:text-green-800 flex-shrink-0"
                                aria-label="Dismiss"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {items.length === 0 ? (
                        /* Empty state */
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 px-6 flex flex-col items-center text-center gap-4">
                            <ShoppingBag className="h-16 w-16 text-gray-200" />
                            <div>
                                <p className="text-lg font-bold text-gray-800">Your cart is empty</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Browse our products and add items to get started.
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm font-bold rounded-full transition-colors no-underline"
                            >
                                Browse Products
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                            {/* ── Left: line items ─────────────────────────── */}
                            <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item.id} className="p-4 sm:p-5 flex gap-3 sm:gap-4">
                                            {/* Image */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ShoppingBag className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                        Rs. {item.price} each
                                                    </p>
                                                    <span
                                                        className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                            ${item.stock_status === 'out_of_stock'
                                                                ? 'bg-gray-100 text-gray-400'
                                                                : item.stock_status === 'low_stock'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-green-100 text-green-700'}`}
                                                    >
                                                        {item.stock_status === 'out_of_stock'
                                                            ? 'Out of Stock'
                                                            : item.stock_status === 'low_stock'
                                                            ? 'Low Stock'
                                                            : 'In Stock'}
                                                    </span>
                                                </div>

                                                {/* Qty + remove + line total */}
                                                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-shrink-0">
                                                    <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-1.5 py-1">
                                                        <button
                                                            onClick={() => decrementQty(item.id)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="h-3.5 w-3.5" />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => setQuantity(item.id, parseInt(e.target.value, 10) || 0)}
                                                            className="w-9 text-center text-sm font-bold border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                        <button
                                                            onClick={() => incrementQty(item.id)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>

                                                    <span className="text-sm sm:text-base font-bold text-gray-900 w-16 text-right flex-shrink-0">
                                                        Rs. {item.price * item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-300 hover:text-[#bb1403] transition-colors flex-shrink-0"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ── Right: price breakdown + checkout ────────── */}
                            <div className="w-full lg:w-[380px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-28">
                                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

                                {/* Contact / shipping info */}
                                <div className="mb-5 flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        value={checkoutForm.customer_name}
                                        onChange={(e) => setCheckoutForm((f) => ({ ...f, customer_name: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb1403] focus:border-[#bb1403]"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email *"
                                        value={checkoutForm.customer_email}
                                        onChange={(e) => setCheckoutForm((f) => ({ ...f, customer_email: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb1403] focus:border-[#bb1403]"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone (optional)"
                                        value={checkoutForm.customer_phone}
                                        onChange={(e) => setCheckoutForm((f) => ({ ...f, customer_phone: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb1403] focus:border-[#bb1403]"
                                    />
                                    <textarea
                                        placeholder="Shipping Address (optional)"
                                        rows={2}
                                        value={checkoutForm.shipping_address}
                                        onChange={(e) => setCheckoutForm((f) => ({ ...f, shipping_address: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb1403] focus:border-[#bb1403] resize-none"
                                    />
                                </div>

                                {/* Coupon */}
                                <div className="mb-5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                        <Tag className="h-3.5 w-3.5" />
                                        Coupon Code
                                    </label>

                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-200">
                                            <span className="text-sm font-semibold text-green-700">
                                                {appliedCoupon.code} applied — {appliedCoupon.label}
                                            </span>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-green-600 hover:text-green-800 flex-shrink-0"
                                                aria-label="Remove coupon"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponInput}
                                                onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }}
                                                placeholder="Enter code"
                                                className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb1403] focus:border-[#bb1403]"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2.5 text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors flex-shrink-0"
                                            >
                                                Apply
                                            </button>
                                        </form>
                                    )}
                                    {couponError && (
                                        <p className="text-xs text-[#bb1403] mt-1.5">{couponError}</p>
                                    )}
                                    <p className="text-[11px] text-gray-400 mt-1.5">
                                        Try <span className="font-semibold">TEST10</span> or <span className="font-semibold">SAVE50</span> (demo codes)
                                    </p>
                                </div>

                                {/* Breakdown */}
                                <div className="flex flex-col gap-3 py-4 border-t border-b border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-semibold text-gray-800">Rs. {subtotal}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-green-600">Coupon ({appliedCoupon.code})</span>
                                            <span className="font-semibold text-green-600">− Rs. {discount}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-1.5">
                                            <Truck className="h-3.5 w-3.5" />
                                            Shipping
                                        </span>
                                        <span className="font-semibold text-gray-800">Rs. {shippingFee}</span>
                                    </div>
                                </div>

                                {/* Grand total */}
                                <div className="flex items-center justify-between py-4">
                                    <span className="text-base font-bold text-gray-900">Grand Total</span>
                                    <span className="text-xl font-extrabold text-[#bb1403]">Rs. {grandTotal}</span>
                                </div>

                                {checkoutError && (
                                    <p className="text-xs text-[#bb1403] mb-3 text-center">{checkoutError}</p>
                                )}

                                <button
                                    className="w-full py-3.5 bg-[#bb1403] hover:bg-[#9e1102] text-white text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleCheckout}
                                    disabled={checkoutSubmitting}
                                >
                                    {checkoutSubmitting ? 'Placing Order...' : 'Proceed to Checkout'}
                                    {!checkoutSubmitting && <ArrowRight className="h-4 w-4" />}
                                </button>

                                <p className="text-[11px] text-gray-400 text-center mt-3">
                                    Prices shown are placeholders. Final pricing will be confirmed at checkout.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}