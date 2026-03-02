import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items) || [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const totalItems = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  if (!items.length) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary grid place-items-center text-2xl">
            🛒
          </div>
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Browse products and add items to start your order.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              Shop products
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-border hover:bg-secondary"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {totalItems} item{totalItems !== 1 && "s"} in cart
          </p>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-destructive hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-border rounded-xl bg-card"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant}
                      </p>
                    )}
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

                <div className="flex items-center justify-between">
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

                  <p className="text-lg font-semibold">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border border-border rounded-xl bg-card h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-lg font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/payment"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
