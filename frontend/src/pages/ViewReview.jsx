import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductReviewsApi, deleteReviewApi } from "../services/api";
import toast from "react-hot-toast";

const ViewReview = ({ productId }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await getProductReviewsApi(productId);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const confirmDelete = async (reviewId) => {
    try {
      setDeletingId(reviewId);
      const res = await deleteReviewApi(reviewId);
      if (res.data.success) {
        toast.success("Review removed");
        setReviews(reviews.filter((r) => r.review_id !== reviewId));
      }
    } catch (error) {
      toast.error("Could not delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditReview = (reviewId) => {
    navigate(`/editreview/${reviewId}`);
  };

  if (!productId) return null;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="mt-16 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-100 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Field Performance
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex text-gray-900 text-xl">
                {"★".repeat(Math.round(averageRating))}
                <span className="text-gray-200">
                  {"★".repeat(5 - Math.round(averageRating))}
                </span>
              </div>
              <span className="font-mono font-bold text-lg text-gray-800">
                {averageRating} / 5.0
              </span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {reviews.length} Experiences
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/addreview/${productId}`)}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-all shadow-lg active:scale-95"
        >
          Rate Gear
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-10">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Retrieving field reports...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            No feedback yet for this equipment.
          </p>
          <p className="text-sm text-gray-400 mt-1">Be the first to share your technical review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="p-8 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    {(review.User?.username || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {review.User?.username || `Creator #${review.user_id}`}
                    </h4>
                    <span className="text-xs font-mono uppercase text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-gray-900 text-sm flex gap-0.5">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEditReview(review.review_id)}
                      className="text-gray-400 hover:text-gray-900 font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => confirmDelete(review.review_id)}
                      disabled={deletingId === review.review_id}
                      className="text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      {deletingId === review.review_id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed font-light italic">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReview;