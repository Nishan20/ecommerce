import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice";
import { clearCart as clearCartAction, setShippingInfo } from "../store/slices/cartSlice";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

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
          image: item.image,
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
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to your cart first!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white rounded-lg shadow-sm p-6">
              <div>
                <h2 className="text-xl font-bold">Checkout</h2>
                <p className="text-sm text-gray-500">Complete your order in a few simple steps.</p>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className={`px-3 py-2 rounded-full ${checkoutStep === 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
                  1. Shipping
                </span>
                <span className={`px-3 py-2 rounded-full ${checkoutStep === 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
                  2. Payment
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {checkoutStep === 1 ? (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        value={shippingData.fullName}
                        onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        value={shippingData.address}
                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                      <input
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zip / Postal Code</label>
                      <input
                        value={shippingData.pincode}
                        onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        value={shippingData.country}
                        onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePayment} className="space-y-6">
                  <h3 className="text-lg font-semibold">Payment Details</h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === "paypal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <span>PayPal</span>
                      </label>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      ← Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (`Place Order - $${totalPrice.toFixed(2)}`)}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product} className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

