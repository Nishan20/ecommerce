import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart, setShippingInfo } from "../store/slices/cartSlice";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, CreditCard } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const shippingInfo = useSelector((state) => state.cart.shippingInfo);
  
  const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = itemsPrice * 0.1; // 10% tax
  const shippingPrice = itemsPrice > 50 ? 0 : 10; // Free shipping over $50
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const [formData, setFormData] = React.useState({
    fullName: shippingInfo?.fullName || "",
    address: shippingInfo?.address || "",
    city: shippingInfo?.city || "",
    state: shippingInfo?.state || "",
    country: shippingInfo?.country || "US",
    pincode: shippingInfo?.pincode || "",
    phone: shippingInfo?.phone || "",
  });

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    dispatch(setShippingInfo(formData));
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-ecommerce['page-bg']">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-ecommerce-card rounded-3xl p-8 shadow-xl flex items-center justify-center border-4 border-dashed border-ecommerce-border/50">
            <ShoppingBag className="w-20 h-20 text-ecommerce-text/50" />
          </div>
          <h2 className="text-4xl font-bold text-ecommerce-heading mb-6">
            Your Cart is Empty
          </h2>
          <p className="text-xl text-ecommerce-text mb-12 max-w-lg mx-auto leading-relaxed">
            You haven't added any items to your cart yet. Start shopping now!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-ecommerce-primary to-blue-600 hover:from-ecommerce['primary-hover'] hover:to-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            <ArrowRight className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-ecommerce['page-bg']">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-12">
          <ShoppingBag className="w-8 h-8 text-ecommerce-primary" />
          <h1 className="text-4xl font-bold text-ecommerce-heading">
            Shopping Cart ({cartItems.length} items)
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-ecommerce-card rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-ecommerce-border hover:border-ecommerce-primary/50">
                <div className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.images?.[0] || item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl shadow-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="block hover:no-underline">
                      <h3 className="font-bold text-ecommerce-heading text-xl mb-2 line-clamp-2 hover:text-ecommerce-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-ecommerce-primary font-black text-2xl mb-6">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-ecommerce['page-bg'] border border-ecommerce-border rounded-xl px-3 py-1 shadow-sm">
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                          className="p-2 hover:bg-ecommerce-primary/10 rounded-lg transition-all"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4 text-ecommerce-text" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-ecommerce-heading px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                          className="p-2 hover:bg-ecommerce-primary/10 rounded-lg transition-all"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-4 h-4 text-ecommerce-text" />
                        </button>
                      </div>
                      <div className="text-xs text-ecommerce-text/70">
                        Stock: {item.stock} available
                      </div>
                      <button
                        onClick={() => handleRemove(item.product)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-105"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length > 0 && (
              <div className="bg-ecommerce-card rounded-2xl shadow-md p-6 border border-ecommerce-border hover:shadow-xl transition-all">
                <button
                  onClick={handleClearCart}
                  className="w-full py-3 px-6 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-xl font-semibold transition-all hover:bg-red-50 flex items-center gap-2 justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-ecommerce-card rounded-2xl shadow-md p-8 sticky top-24 border border-ecommerce-border hover:shadow-xl transition-all">
              <h2 className="text-2xl font-bold text-ecommerce-heading mb-8 flex items-center gap-3">
                <svg className="w-8 h-8 text-ecommerce-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v2H3V3zM12 7v4m0 0H8m4 0h4m-7 8H5a2 2 0 01-2-2V12a2 2 0 012-2h3.5a1 1 0 0 1 .737.321L11 12.851V17a1 1 0 01-1 1h-1M16.866 20H8.134a1 1 0 01-.866-.5A4.998 4.998 0 0 0 3 16c0-2.305.948-4.385 2.468-5.866a1 1 0 0 1 .866-.5h9.732a1 1 0 0 1 .866.5C19.052 11.615 20 13.695 20 16c0 2.305-.948 4.385-2.468 5.866a1 1 0 01-.866.5z" />
                </svg>
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-ecommerce-border/50">
                  <span className="text-lg text-ecommerce-text font-semibold">Subtotal ({cartItems.length} items)</span>
                  <span className="text-xl font-bold text-ecommerce-heading">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-ecommerce-border/50">
                  <span className="flex items-center gap-2 text-lg text-ecommerce-text">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tax (10%)
                  </span>
                  <span className="font-bold text-lg">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-ecommerce-border/50">
                  <span className="flex items-center gap-2 text-lg text-ecommerce-text">
                    <Truck className="w-5 h-5" />
                    Shipping
                  </span>
                  <span className="font-bold text-lg {shippingPrice === 0 ? 'text-emerald-600' : ''}">
                    {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {shippingPrice > 0 && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm font-medium text-emerald-800">
                    🚚 Free shipping on orders over $50
                  </p>
                </div>
              )}

              <div className="p-4 bg-gradient-to-r from-ecommerce-primary/5 to-blue-500/5 border-2 border-ecommerce-primary/20 rounded-2xl shadow-lg mb-8">
                <div className="flex justify-between items-baseline text-3xl font-black text-ecommerce-heading">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/payment"
                className="block w-full py-4 px-6 bg-gradient-to-r from-ecommerce-primary to-blue-600 hover:from-ecommerce['primary-hover'] hover:to-blue-700 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl active:scale-95 transition-all duration-300 flex items-center gap-3 justify-center uppercase tracking-wide"
              >
                <CreditCard className="w-6 h-6" />
                Proceed to Checkout
              </Link>

              <div className="text-xs text-ecommerce-text/70 text-center mt-4">
                <p>Secure checkout | SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
