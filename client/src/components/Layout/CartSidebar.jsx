import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => {
          // close logic if needed
        }}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-ecommerce-card shadow-2xl border-l border-ecommerce-border/50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-ecommerce-border bg-gradient-to-r from-ecommerce-primary/5 to-blue-500/5">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-ecommerce-primary/10 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-ecommerce-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-ecommerce-heading">Your Cart</h2>
                <p className="text-lg text-ecommerce-text font-semibold">{cartItemCount} items</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white/20 rounded-xl transition-all group">
              <X className="w-6 h-6 text-ecommerce-text/70 group-hover:text-white" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-ecommerce-border/50 hover:border-ecommerce-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.images?.[0] || item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-2xl shadow-xl ring-2 ring-white/50"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-ecommerce-heading text-xl mb-3 line-clamp-2 group-hover:text-ecommerce-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-2xl font-black text-ecommerce-primary mb-6">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-ecommerce['page-bg'] border border-ecommerce-border rounded-2xl px-4 py-2 shadow-md">
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: Math.max(1, item.quantity - 1) }))}
                          className="p-2 hover:bg-ecommerce-primary/20 rounded-xl transition-all hover:scale-110"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-5 h-5 text-ecommerce-text" />
                        </button>
                        <span className="w-16 text-center text-2xl font-black text-ecommerce-heading mx-4">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                          className="p-2 hover:bg-ecommerce-primary/20 rounded-xl transition-all hover:scale-110"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-5 h-5 text-ecommerce-text" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.product))}
                        className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 group"
                      >
                        <Trash2 className="w-6 h-6 group-hover:fill-red-100" />
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-ecommerce-border/50">
                      <p className="text-sm text-ecommerce-text/80">
                        Stock: <span className="font-bold text-ecommerce-text">{item.stock - item.quantity} left</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length > 1 && (
              <button
                onClick={() => dispatch(clearCart())}
                className="w-full py-4 px-8 text-red-500 hover:text-red-600 border-2 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-all hover:shadow-lg text-lg flex items-center gap-3 justify-center"
              >
                <Trash2 className="w-6 h-6" />
                Clear All ({cartItems.length} items)
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-ecommerce-border p-8 bg-gradient-to-b from-white/90 to-transparent shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline text-3xl font-black">
                <span className="text-ecommerce-heading">Total</span>
                <span className="text-ecommerce-primary">${cartTotal.toFixed(2)}</span>
              </div>
              <Link
                to="/cart"
                className="block w-full py-4 bg-gradient-to-r from-ecommerce-primary to-blue-600 hover:from-ecommerce['primary-hover'] hover:to-blue-700 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl active:scale-[0.98] transition-all duration-300 text-center flex items-center gap-3 justify-center uppercase tracking-wider"
              >
                <ShoppingBag className="w-6 h-6" />
                View Cart
              </Link>
              <Link
                to="/payment"
                className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl active:scale-[0.98] transition-all duration-300 text-center flex items-center gap-3 justify-center uppercase tracking-wider"
              >
                <CreditCard className="w-6 h-6" />
                Checkout Securely - ${cartTotal.toFixed(2)}
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-ecommerce-border/50 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Lock className="w-4 h-4" />
                <span>SSL Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
