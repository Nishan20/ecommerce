import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="mx-auto w-14 h-14 text-primary" />
          <h1 className="text-3xl font-bold mt-6">Your Wishlist</h1>
          <p className="text-gray-600 mt-3">
            You haven’t added any items to your wishlist yet.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
