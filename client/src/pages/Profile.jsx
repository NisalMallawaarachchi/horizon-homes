import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiLogOut,
  FiEdit,
  FiLock,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { BsHouseDoor, BsBookmark, BsShieldCheck } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { toast } from "react-toastify";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice"; // Adjust the path as needed

export default function Profile() {
  const imageInputRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    propertiesListed: 0,
    savedProperties: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Simulate fetching stats from API
      setTimeout(() => {
        setStats({
          propertiesListed: 12,
          savedProperties: 8,
          propertiesSold: 5,
          activeListings: 7,
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    setImageFile(file);
  };

  const handleImageUpload = async () => {
    if (!imageFile || !currentUser) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const storage = getStorage(app);
      // Ensure currentUser.uid exists and filename is properly constructed
      const fileName = `profile_pictures/profile_${
        currentUser.uid
      }_${Date.now()}.png`;
      console.log("File path:", fileName);

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          setIsUploading(false);
          toast.error("Image upload failed");
          console.error("Upload error:", error.code, error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File uploaded successfully:", downloadURL);

          // Dispatch action to update user avatar in Redux store
          dispatch({
            type: "UPDATE_USER_AVATAR",
            payload: downloadURL,
          });

          // Here you would typically also make an API call to update the avatar in your database
          // await updateUserAvatar(currentUser._id, downloadURL);

          setIsUploading(false);
          setUploadProgress(0);
          toast.success("Profile image updated successfully");
        }
      );
    } catch (error) {
      setIsUploading(false);
      toast.error("Error uploading image");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (imageFile) {
      handleImageUpload();
    }
  }, [imageFile]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const response = await fetch("/api/auth/signout");

      if (!response.ok) {
        throw new Error("Sign out failed");
      }

      const data = await response.json();
      console.log("Sign-out response:", data);

      dispatch(signOutUserSuccess());
      navigate("/signin");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
          <div className="h-4 bg-emerald-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-emerald-100 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-32 sm:h-40 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            {isUploading && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1.5">
                <div
                  className="bg-white h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          <div className="px-6 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 sm:-mt-16">
              <div className="relative group">
                <input
                  onChange={handleImageChange}
                  type="file"
                  ref={imageInputRef}
                  hidden
                  accept="image/*"
                  disabled={isUploading}
                />
                <div className="relative">
                  <img
                    src={
                      currentUser?.avatar ||
                      `https://avatars.dicebear.com/api/initials/${
                        currentUser?.username || "user"
                      }.svg`
                    }
                    alt={currentUser?.username || "User profile"}
                    className={`h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white shadow-lg object-cover transition-transform duration-300 ${
                      isUploading
                        ? "opacity-70"
                        : "cursor-pointer group-hover:scale-105"
                    }`}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-white border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  {!isUploading && (
                    <div
                      className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                      onClick={() =>
                        !isUploading && imageInputRef.current.click()
                      }
                    >
                      <FiEdit className="text-white text-xl" />
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:ml-6 mt-2 sm:mt-0 flex-1">
                <div className="flex items-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {currentUser?.username || "Username"}
                  </h1>
                  {currentUser?.verified && (
                    <span className="ml-2 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <BsShieldCheck className="mr-1" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-emerald-600 flex items-center mt-1">
                  <FiMail className="mr-2" />{" "}
                  {currentUser?.email || "user@example.com"}
                </p>
                <div className="flex-wrap items-center mt-2 text-sm text-gray-500 gap-3 -ml-3">
                  <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                    <BsHouseDoor className="mr-2" />
                    Member since{" "}
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="ml-auto mt-4 sm:mt-0">
                <Link
                  to="/profile/edit"
                  className={`flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg transition-all shadow-md ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-emerald-700 hover:shadow-emerald-200"
                  }`}
                  onClick={(e) => isUploading && e.preventDefault()}
                >
                  <FiEdit className="mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">
                Properties Listed
              </h3>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BsHouseDoor className="text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">
              {stats.propertiesListed}
              <span className="text-sm font-normal text-emerald-600 ml-2">
                +2 this month
              </span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">
                Saved Properties
              </h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BsBookmark className="text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">
              {stats.savedProperties}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">
                Properties Sold
              </h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUser className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">
              5
              <span className="text-sm font-normal text-purple-600 ml-2">
                +1 recently
              </span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">
                Active Listings
              </h3>
              <div className="p-2 bg-amber-100 rounded-lg">
                <HiOutlineDocumentText className="text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">7</p>
          </motion.div>
        </div>

        {/* Profile Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100"
        >
          <h2 className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50">
            Account Settings
          </h2>
          <nav className="divide-y divide-gray-100">
            <Link
              to="/profile/edit"
              className="flex items-center px-6 py-4 hover:bg-emerald-50 transition-all group"
            >
              <div className="p-2 bg-emerald-100 rounded-lg mr-4 group-hover:bg-emerald-200 transition">
                <FiSettings className="text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Edit Profile</p>
                <p className="text-sm text-gray-500">
                  Update your personal information
                </p>
              </div>
            </Link>

            <Link
              to="/profile/change-password"
              className="flex items-center px-6 py-4 hover:bg-emerald-50 transition-all group"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition">
                <FiLock className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Change Password</p>
                <p className="text-sm text-gray-500">
                  Update your security settings
                </p>
              </div>
            </Link>

            <Link
              to="/profile/saved"
              className="flex items-center px-6 py-4 hover:bg-emerald-50 transition-all group"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200 transition">
                <BsBookmark className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Saved Properties</p>
                <p className="text-sm text-gray-500">
                  View your favorite listings
                </p>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center px-6 py-4 text-red-500 hover:bg-red-50 transition-all group"
            >
              <div className="p-2 bg-red-100 rounded-lg mr-4 group-hover:bg-red-200 transition">
                <FiLogOut className="text-red-600" />
              </div>
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-red-400">End your current session</p>
              </div>
            </button>
          </nav>
        </motion.div>

        {/* Recent Activity (Optional Section) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <h2 className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50">
            Recent Activity
          </h2>
          <div className="px-6 py-4">
            <div className="flex items-start pb-4 last:pb-0">
              <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                <BsHouseDoor className="text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">New listing added</p>
                <p className="text-sm text-gray-500">
                  You added a property at 123 Main St
                </p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start py-4 border-t border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <BsBookmark className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Property saved</p>
                <p className="text-sm text-gray-500">
                  You saved a beachfront villa
                </p>
                <p className="text-xs text-gray-400 mt-1">1 week ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
