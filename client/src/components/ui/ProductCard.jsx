import React from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="group relative bg-ecommerce-card rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 active:translate-y-0 transition-all duration-500 overflow-hidden border border-ecommerce-border hover:border-ecommerce-primary/50 h-full">
      {/* Badge */}
      {product.discountPercent && (
        <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
          -{product.discountPercent}%
        </span>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-ecommerce['page-bg'] group-hover:bg-ecommerce-primary/5">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
            loading="lazy"
          />
          {/* Quick add overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="bg-ecommerce-primary hover:bg-ecommerce['primary-hover'] text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <FaShoppingCart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link to={`/product/${product.id}`} className="block hover:no-underline">
          <h3 className="font-bold text-ecommerce-heading line-clamp-2 mb-3 text-lg leading-tight hover:text-ecommerce-primary transition-colors group-hover:underline">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-4">
          <div className="flex -space-x-1 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  i < Math.round(product.ratings || 0) 
                    ? "text-yellow-400 fill-yellow-400 shadow-lg" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-ecommerce-text font-medium ml-1">
            ({product.numOfReviews || 0})
          </span>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-ecommerce-border/50">
          <div>
            {product.originalPrice && (
              <span className="text-sm text-ecommerce-text line-through opacity-75 mr-2">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-black text-ecommerce-primary drop-shadow-lg">
              ${product.price?.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="ml-4 px-5 py-2 bg-gradient-to-r from-ecommerce-primary to-blue-600 hover:from-ecommerce['primary-hover'] hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:shadow-md active:scale-95 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <FaShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
