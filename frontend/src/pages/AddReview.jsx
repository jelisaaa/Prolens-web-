import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { createReviewApi } from '../services/api';

const AddReview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please share your feedback");
      return;
    }

    try {
      setLoading(true);
      const res = await createReviewApi({
        product_id: productId,
        rating,
        comment,
      });
      if (res.data.success) {
        toast.success("Review published!");
        setIsSubmitted(true);
        setTimeout(() => navigate(`/product/${productId}`), 2000);
      }
    } catch (error) {
      console.error("Review error:", error);
      if (error.response?.status === 409) {
        toast.error("You have already reviewed this gear");
      } else {
        toast.error(error.response?.data?.message || "Connection error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mt-12 bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-lg animate-fade-in">
        <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Feedback Received</h2>
        <p className="text-gray-500 mt-2">Your review helps the Prolens community choose the right gear.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2 bg-gray-900 p-10 flex flex-col justify-center text-white">
          <span className="uppercase tracking-[0.3em] text-gray-400 text-xs font-bold mb-4">
            Gear Feedback
          </span>
          <h2 className="text-4xl font-bold leading-tight">
            Rate Your <br /> Performance
          </h2>
          <p className="mt-4 text-gray-400 leading-relaxed font-light">
            "How did this equipment perform on your last shoot? Share your technical insights with fellow creators."
          </p>
          <div className="mt-8 w-12 h-1 bg-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 p-10 space-y-6 bg-white">
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Equipment Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-10 h-10 ${star <= (hover || rating) ? 'fill-gray-900' : 'fill-transparent stroke-gray-300'}`}
                    strokeWidth={1.5}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Review Details</label>
            <textarea
              required
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="Talk about build quality, lens sharpness, or battery life..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-5 rounded-xl hover:bg-black shadow-lg transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-xs disabled:opacity-50"
          >
            {loading ? "Processing..." : "Publish Review"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddReview;