import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart, setShippingInfo } from "../store/slices/cartSlice";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

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
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-xs text-green-600">Free shipping on orders over $50</p>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Link
                to="/payment"
                className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

