import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs before submitting
  const validateForm = () => {
    const { username, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      setError("Username is required!");
      return false;
    }
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
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      toast.success("Account created successfully!", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
      toast.error(error.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Clicked!");
    // Add Google authentication logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUser className="text-emerald-500 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              aria-label="Username"
              className="w-full p-2 focus:outline-none"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="text-emerald-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              className="w-full p-2 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Loading..." : "Sign Up"}
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

        {/* Already have an account? */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-emerald-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
