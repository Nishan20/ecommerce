import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.product);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                <img
                  src={product.images?.[selectedImage] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-blue-600" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(product.ratings || 0)
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 ml-2">
                      ({product.numOfReviews || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-primary" />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600 hover:text-primary" />
                  </button>
                </div>
              </div>

              <p className="text-3xl font-bold text-blue-600 mb-6">
                ${product.price?.toFixed(2)}
              </p>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-6"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="mt-10 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row border-b bg-gray-50">
              <button
                onClick={() => setActiveTab("description")}
                className={`w-full md:w-auto text-left px-6 py-4 font-semibold transition ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full md:w-auto text-left px-6 py-4 font-semibold transition ${
                  activeTab === "reviews"
                    ? "text-primary border-b-2 border-primary bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Reviews ({product.reviews?.length || 0})
              </button>
            </div>
            <div className="p-6">
              {activeTab === "description" ? (
                <div className="space-y-6 text-gray-600">
                  <p className="leading-relaxed">{product.description || "No description available."}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Category</h3>
                      <p className="text-sm text-gray-600">{product.category || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Brand</h3>
                      <p className="text-sm text-gray-600">{product.brand || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Stock</h3>
                      <p className="text-sm text-gray-600">{product.stock ?? "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">SKU</h3>
                      <p className="text-sm text-gray-600">{product.sku || "-"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              {review.user?.avatar ? (
                                <img
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">
                                    {review.user?.name?.[0]?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{review.user?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 mt-3">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

