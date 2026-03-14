import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className="aspect-square bg-gray-200 relative overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercent && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {product.discountPercent}% off
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col justify-between h-full">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(product.ratings || 0) ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.numOfReviews || 0})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
            className="px-3 py-1 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
