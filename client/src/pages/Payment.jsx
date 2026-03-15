import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice";
import { clearCart as clearCartAction, setShippingInfo } from "../store/slices/cartSlice";
import { CreditCard, Lock, CheckCircle, Truck, Shield, ArrowLeft, ShoppingBag } from "lucide-react";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, shippingInfo } = useSelector((state) => state.cart);
  const { isAuthenticated, authUser } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    fullName: shippingInfo?.fullName || authUser?.name || "",
    address: shippingInfo?.address || authUser?.address || "",
    city: shippingInfo?.city || authUser?.city || "",
    state: shippingInfo?.state || authUser?.state || "",
    country: shippingInfo?.country || "US",
    pincode: shippingInfo?.pincode || "",
    phone: shippingInfo?.phone || "",
  });

  const itemsPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = itemsPrice * 0.1;
  const shippingPrice = itemsPrice > 50 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    dispatch(setShippingInfo(shippingData));
    setCheckoutStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.image,
        })),
        shippingInfo: shippingData,
        paymentInfo: {
          id: "PAYMENT_" + Date.now(),
          status: "Paid",
          method: paymentMethod,
        },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCartAction());
      navigate("/orders");
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-ecommerce['page-bg'] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 shadow-xl flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-ecommerce-heading mb-4">
            No Items in Cart
          </h2>
          <p className="text-ecommerce-text text-lg mb-8">
            Your cart is currently empty
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-ecommerce-primary hover:bg-ecommerce['primary-hover'] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <ArrowRight className="rotate-180 w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-ecommerce['page-bg']">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-ecommerce-primary bg-clip-text text-transparent mb-6">
            Checkout
          </h1>
          <p className="text-xl text-ecommerce-text max-w-2xl mx-auto leading-relaxed">
            Review your order and complete your purchase securely
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center gap-1 mb-12">
              <div className="flex-1 relative">
                <div className="w-full h-2 bg-ecommerce-border rounded-full">
                  <div className={`h-full rounded-full transition-all duration-500 ${checkoutStep >= 1 ? 'bg-ecommerce-primary shadow-lg' : 'bg-gray-200'}`} style={{width: '50%'}} />
                </div>
                <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-all ${checkoutStep >= 1 ? 'bg-ecommerce-primary scale-110 shadow-xl' : 'bg-gray-200 text-gray-500 scale-100'}`}>
                  1
                </div>
                <div className="absolute inset-x-0 top-full text-center mt-12">
                  <div className="text-sm font-bold text-ecommerce-text uppercase tracking-wide">Shipping</div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="w-full h-2 bg-ecommerce-border rounded-full">
                  <div className={`h-full rounded-full transition-all duration-500 ${checkoutStep >= 2 ? 'bg-ecommerce-primary shadow-lg' : 'bg-gray-200'}`} style={{width: '50%'}} />
                </div>
                <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-all ${checkoutStep >= 2 ? 'bg-ecommerce-primary scale-110 shadow-xl' : 'bg-gray-200 text-gray-500 scale-100'}`}>
                  2
                </div>
                <div className="absolute inset-x-0 top-full text-center mt-12">
                  <div className="text-sm font-bold text-ecommerce-text uppercase tracking-wide">Payment</div>
                </div>
              </div>
            </div>

            <div className="bg-ecommerce-card rounded-3xl shadow-2xl p-10 border border-ecommerce-border">
              {checkoutStep === 1 ? (
                <form onSubmit={handleShippingSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold text-ecommerce-heading mb-8 flex items-center gap-3">
                      <Truck className="w-10 h-10 text-ecommerce-primary" />
                      Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Form fields ... */}
                      <div>
                        <label className="block text-lg font-bold text-ecommerce-heading mb-4">Full Name *</label>
                        <input className="w-full px-6 py-4 rounded-2xl border border-ecommerce-border bg-white text-ecommerce-heading placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-xl transition-all shadow-md" />
                      </div>
                      {/* more fields */}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-12">
                      <button type="button" className="flex-1 py-4 px-8 text-lg font-bold text-ecommerce-text border border-ecommerce-border hover:border-ecommerce-primary hover:text-ecommerce-primary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">← Back</button>
                      <button type="submit" className="flex-1 py-4 px-8 bg-gradient-to-r from-ecommerce-primary to-blue-600 hover:from-ecommerce['primary-hover'] hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide">Continue to Payment</button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePayment} className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold text-ecommerce-heading mb-8 flex items-center gap-3">
                      <CreditCard className="w-10 h-10 text-ecommerce-primary" />
                      Payment Information
                    </h3>
                    {/* payment form fields */}
                    <div className="flex items-center gap-4">
                      <button type="button" className="flex-1 py-5 px-8 font-bold text-lg text-ecommerce-text border-2 border-ecommerce-border hover:border-ecommerce-primary hover:text-ecommerce-primary hover:shadow-xl rounded-3xl shadow-lg transition-all duration-300 bg-white active:scale-95">← Back to Shipping</button>
                      <button type="submit" disabled={isProcessing} className="flex-1 py-5 px-8 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl active:scale-95 transition-all duration-300 uppercase tracking-wide flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        Complete Order - ${totalPrice.toFixed(2)}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-ecommerce-card rounded-3xl shadow-2xl p-8 border border-ecommerce-border sticky top-28">
              <h2 className="text-2xl font-bold text-ecommerce-heading mb-8 flex items-center gap-3">
                Order Summary
              </h2>
              {/* summary content */}
              <div className="space-y-4 p-6 bg-gradient-to-b from-white to-ecommerce['page-bg'] rounded-3xl border-2 border-ecommerce-border shadow-inner mb-8">
                {/* totals */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
