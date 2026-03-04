import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({ token, password });

      if (!res.data.success) {
        toast.error(res.data.message || "Error resetting password");
        return;
      }

      toast.success("Password reset successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-gray-100 p-8 rounded-2xl shadow-xl border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
