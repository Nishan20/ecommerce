import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCart,
  toggleAuthPopup,
  setLoginModal,
} from "../../store/slices/popupSlice";
import {
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.popup.isCartOpen);
  const items = useSelector((state) => state.cart.items) || [];
  const authUser = useSelector((state) => state.auth.authUser);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const totalItems = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleCart())}
      />

      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground">
              {totalItems} item{totalItems !== 1 && "s"}
            </p>
            <h2 className="text-xl font-semibold">Your Cart</h2>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-semibold">Your cart is empty</p>
              <Link
                to="/products"
                onClick={() => dispatch(toggleCart())}
                className="mt-3 inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Browse products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 border border-border rounded-xl"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => dispatch(decrementQty(item.id))}
                        className="p-2 rounded-lg border border-border hover:bg-secondary"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => dispatch(incrementQty(item.id))}
                        className="p-2 rounded-lg border border-border hover:bg-secondary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-semibold">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-card">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <Link
                to="/cart"
                onClick={() => dispatch(toggleCart())}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg border border-border hover:bg-secondary/60 font-semibold"
              >
                View cart
              </Link>
              <button
                onClick={() => {
                  dispatch(toggleCart());
                  if (authUser) {
                    window.location.href = "/payment";
                  } else {
                    dispatch(setLoginModal(true));
                  }
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="mt-3 text-sm text-destructive hover:underline"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
