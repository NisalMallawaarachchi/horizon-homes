import { FaUpload, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    furnished: false,
    parking: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);

  console.log("formData", formData);
  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!files.length || files.length + formData.imageUrls.length > 6) {
      toast.error("Please select between 1 and 6 images.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    try {
      const urls = await Promise.all(promises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      toast.success("Images uploaded successfully!");

      setImageUploadError(false);
    } catch (error) {
      setImageUploadError("Image upload failed: " + error.message);
      console.error("Image upload failed (2MB max per image)");
      toast.error("Image upload failed: " + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: e.target.id,
      }));
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked,
      }));
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        formData.offer &&
        +formData.regularPrice <= +formData.discountedPrice
      ) {
        throw new Error("Regular price must be greater than discounted price");
      }

      setLoading(true);
      setError(false);

      const listingData = {
        ...formData,
        userRef: currentUser._id,
      };

      // Only include discountedPrice if offer is true
      if (!formData.offer) {
        delete listingData.discountedPrice;
      }

      const res = await fetch("/api/listing/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(listingData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to create listing");
      }

      setLoading(false);
      toast.success("Listing created successfully!");

      setTimeout(() => {
        navigate(`/listing/${data._id}`);
      }, 2000);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Error creating listing:", error);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
      <ToastContainer position="top-center" />
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800">Create a Listing</h1>
        <p className="mt-2 text-slate-500">
          Fill in the details to create your property listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Listing Name
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Beautiful modern apartment in downtown"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="Description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              required
              placeholder="Describe your property in detail..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none h-28 focus:outline-none focus:ring-2 focus:ring-slate-500"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="Address"
              className="block text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              required
              placeholder="123 Main St, City, Country"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Listing Options
            </p>
            <div className="flex flex-wrap gap-4">
              {["sale", "rent", "parking", "furnished", "offer"].map((id) => (
                <label
                  key={id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={id}
                    className="w-5 h-5 text-slate-600 border-slate-300"
                    onChange={handleChange}
                    checked={
                      id === "sale" || id === "rent"
                        ? formData.type === id
                        : formData[id]
                    }
                  />
                  <span className="text-slate-700 text-sm capitalize">
                    {id}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Property Details
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { id: "bedrooms", label: "Bedrooms" },
                { id: "bathrooms", label: "Bathrooms" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <input
                    type="number"
                    id={id}
                    required
                    min="1"
                    max="10"
                    className="px-4 py-2.5 w-20 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                    onChange={handleChange}
                    value={formData[id]}
                  />
                  <label htmlFor={id} className="text-slate-700 text-sm">
                    {label}
                  </label>
                </div>
              ))}

              {/* Regular Price - always shown */}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="regularPrice"
                  required
                  min="1"
                  max="1000000"
                  className="px-4 py-2.5 w-28 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col">
                  <label
                    htmlFor="regularPrice"
                    className="text-slate-700 text-sm"
                  >
                    Regular price
                  </label>
                  <span className="text-xs text-slate-500">($ / month)</span>
                </div>
              </div>

              {/* Discounted Price - shown only if offer is checked */}
              {formData.offer && (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="discountedPrice"
                    required={formData.offer}
                    min="0"
                    max={formData.regularPrice - 1 || 1000000}
                    className="px-4 py-2.5 w-28 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                    onChange={handleChange}
                    value={formData.discountedPrice}
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor="discountedPrice"
                      className="text-slate-700 text-sm"
                    >
                      Discounted price
                    </label>
                    <span className="text-xs text-slate-500">($ / month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700">
                Property Images
              </label>
              <span className="text-xs text-slate-500">
                First image will be the cover (max 6)
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                type="file"
                accept="image/*"
                multiple
              />
              <button
                onClick={handleImageUpload}
                type="button"
                disabled={uploading}
                className={`px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm flex items-center gap-2 ${
                  uploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-800"
                } transition duration-200`}
              >
                <FaUpload className="text-base" />
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {imageUploadError && (
            <p className="text-red-500 text-sm mt-1">{imageUploadError}</p>
          )}

          {/* Uploaded Images Preview */}
          {formData.imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {`Image ${index + 1}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="p-2 text-red-600 hover:text-red-800 transition duration-200 rounded-full hover:bg-red-100"
              >
                <FaTrashAlt className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            className="mt-2 px-5 py-3 bg-slate-700 text-white rounded-xl uppercase text-sm font-semibold transition duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || uploading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
