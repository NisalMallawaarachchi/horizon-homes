import { useRef, useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      return toast.error("User information not loaded yet");
    }

    try {
      dispatch(userUpdateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST", // Keep as POST
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      // If not OK (like 403), throw an error early
      if (!res.ok) {
        const errorData = await res.json();
        const message =
          errorData?.message || `Request failed with status ${res.status}`;
        dispatch(userUpdateFailure(message));
        return toast.error(message);
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(userUpdateFailure(data.message));
        return toast.error(data.message);
      }

      dispatch(userUpdateSuccess(data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(userUpdateFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      // Call the signout API endpoint
      const res = await fetch("/api/auth/signout", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to sign out");
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return toast.error(data.message);
      }

      dispatch(signOutUserSuccess());
      // Clear the current user from Redux state
      toast.success("Signed out successfully!");

      // Wait a moment before navigating
      setTimeout(() => {
        navigate("/signin"); // or wherever your login page is
      }, 1500);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error("Sign Out failed. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delete account");
      }
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return toast.error(data.message);
      }
      dispatch(deleteUserSuccess());
      toast.success("Account deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("Account deletion failed. Please try again.");
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = `${currentUser?.uid}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        toast.error("File upload failed!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            avatar: downloadURL,
          }));
          setFileUploadError(false);
          toast.success("Profile picture uploaded!");
        });
      }
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <input
              className="mb-2"
              type="file"
              ref={fileRef}
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: ev.target.result,
                    }));
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
            <img
              src={
                formData.avatar ||
                currentUser?.avatar ||
                "https://i.postimg.cc/Y0JPMM7V/image.png"
              }
              alt="Profile"
              className="rounded-full h-24 w-24 object-cover border-2 border-emerald-500 mb-2"
              onClick={() => fileRef.current && fileRef.current.click()}
              style={{ cursor: "pointer" }}
            />

            {/* Upload progress */}
            {filePerc > 0 && filePerc < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${filePerc}%` }}
                ></div>
              </div>
            )}

            {fileUploadError && (
              <p className="text-red-500 text-sm mt-1">
                Upload failed. Please try again.
              </p>
            )}
          </div>

          {/* Username Input */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUser className="text-emerald-500 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-2 focus:outline-none"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

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
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border-b border-gray-300 py-2 relative">
            <FaLock className="text-emerald-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="w-full p-2 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 text-gray-500 hover:text-emerald-500 transition duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <Link
            to="/create-listing"
            className="w-full block text-center bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition duration-300 mt-2"
          >
            Create Listing
          </Link>
        </form>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleDeleteAccount}
            className="flex items-center text-red-500 hover:text-red-700 font-medium"
          >
            <FaTrash className="mr-2" />
            Delete Account
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center text-emerald-500 hover:text-emerald-700 font-medium"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>

        {error && error.trim() !== "" && (
          <p className="text-red-700 mt-4 text-sm text-center animate-pulse">
            {error}
          </p>
        )}

        {/* Back Link */}
        <p className="text-center text-gray-600 mt-6">
          <Link to="/home" className="text-emerald-500 font-semibold">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
