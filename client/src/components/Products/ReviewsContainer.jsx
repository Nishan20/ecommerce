import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../store/slices/productSlice";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const ReviewsContainer = ({ product, productReviews = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select rating");
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(createReview({ productId: product.id, rating, comment })).unwrap();
      setRating(0);
      setComment("");
      toast.success("Review added successfully");
      // Note: Parent should refetch reviews/product
    } catch (error) {
      toast.error(error || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const Stars = ({ rating: r, size = "w-5 h-5" }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`${
            i < Math.floor(r) || (i === Math.floor(r) && r % 1 >= 0.5) 
              ? "text-yellow-400 fill-current" 
              : "text-gray-300"
          } ${size}`} 
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Average Rating */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold">Reviews ({productReviews.length})</h3>
        <div className="flex items-center gap-2">
          <Stars rating={avgRating} />
          <span className="text-xl font-semibold text-gray-900">{avgRating}</span>
        </div>
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-white border rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Add Your Review</h4>
        {!user ? (
          <p className="text-gray-500 mb-4">Please <a href="/login" className="text-primary hover:underline">login</a> to review.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {[5,4,3,2,1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition ${
                      rating >= star ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    <Star className="w-7 h-7" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </form>

      {/* Reviews List */}
      {productReviews.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold mb-4">Customer Reviews</h4>
          {productReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-6 bg-gray-50">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                  {review.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 truncate">{review.user?.name || "Anonymous"}</span>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsContainer;
