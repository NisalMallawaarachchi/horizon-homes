import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs before submitting
  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email)) {
      setError("Enter a valid email address!");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid email or password.");
      }

      toast.success("Sign-in successful!", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.message);

      // Improve error messages
      let userFriendlyMessage = error.message;
      if (error.message.includes("Failed to fetch")) {
        userFriendlyMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("Invalid email or password")) {
        userFriendlyMessage = "The email or password you entered is incorrect.";
      }

      setError(userFriendlyMessage);
      toast.error(userFriendlyMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In (Placeholder function)
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Clicked!");
    // Add Google authentication logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEnvelope className="text-emerald-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="flex items-center border-b border-gray-300 py-2 relative">
            <FaLock className="text-emerald-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-2 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 text-gray-500 hover:text-emerald-500 transition duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Display Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Continue with Google */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
        >
          <FcGoogle className="text-2xl mr-3" />
          Continue with Google
        </button>

        {/* Don't have an account? */}
        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="text-emerald-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
