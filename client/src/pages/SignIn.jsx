import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  // State to store form data (email and password)
  const [formData, setFormData] = useState({ email: "", password: "" });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Redux dispatch function
  const dispatch = useDispatch();

  // React Router navigation hook
  const navigate = useNavigate();

  // Extract loading and error state from Redux store
  const { loading, error } = useSelector((state) => state.user);

  // Handle input changes and update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to validate email and password before submitting
  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for validating email format

    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("Enter a valid email address!");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!validateForm()) return; // Validate form before proceeding

    dispatch(signInStart()); // Dispatch Redux action to indicate sign-in process started
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid email or password.");
      }

      const data = await res.json();
      dispatch(signInSuccess(data)); // Dispatch success action with user data
      toast.success("Sign-in successful!");
      setTimeout(() => navigate("/home"), 2000); // Redirect to home page after success
    } catch (err) {
      dispatch(signInFailure(err.message)); // Dispatch failure action with error message
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
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

          {/* Password input field with toggle visibility */}
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

          {/* Submit button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Error message display */}
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
        </form>

        {/* Divider with OR text */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* OAuth sign-in component */}
        <OAuth />

        {/* Navigation to Sign-up page */}
        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-emerald-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
