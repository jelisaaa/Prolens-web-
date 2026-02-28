import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateReviewApi, getReviewByIdApi } from "../services/api"; 
import toast from "react-hot-toast";

const EditReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await getReviewByIdApi(reviewId); 
        if (res.data.review) {
          setRating(res.data.review.rating);
          setComment(res.data.review.comment);
        }
      } catch (err) {
        toast.error("Unable to load gear report");
      } finally {
        setFetching(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Review details cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const res = await updateReviewApi(reviewId, { rating, comment });

      if (res.data.success) {
        toast.success("Field report updated!");
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to sync changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Modify Report
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-light italic">
            "Refining your experience for the ProLens community"
          </p>
        </header>

        {fetching ? (
          <div className="flex flex-col items-center py-10">
             <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-400 text-sm font-mono">RETRIEVING DATA...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Updated Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
                      rating === num 
                      ? "bg-gray-900 border-gray-900 text-white shadow-md" 
                      : "bg-white border-gray-200 text-gray-400 hover:border-gray-900"
                    }`}
                  >
                    <span className="font-bold">{num}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Technical Feedback
              </label>
              <textarea
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 bg-gray-50/50"
                placeholder="Adjust your field notes..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Syncing..." : "Update Report"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition"
              >
                Discard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditReview;