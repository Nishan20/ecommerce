import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
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
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">Your Cart ({cartItemCount})</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                  <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }))}
                        className="p-1 hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                        className="p-1 hover:bg-gray-200"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.product))}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              className="block w-full py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;

