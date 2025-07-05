import { FaUpload, FaTrashAlt, FaDollarSign } from "react-icons/fa";
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

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sale",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    furnished: false,
    parking: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);

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
      setImageUploadError("Image upload failed (2MB max per image)");
      toast.error("Image upload failed (2MB max per image)");
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
    toast.info("Image removed");
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
        type: id === "sale" || id === "rent" ? id : prev.type,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "number" ? Number(value) : value,
      }));
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Create a Listing
        </h1>
        <p className="mt-2 text-slate-500 text-sm md:text-base">
          Fill in the details to create your property listing
        </p>
      </div>

      <form className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Form Fields */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Listing Name
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Beautiful modern apartment in downtown"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              required
              placeholder="Describe your property in detail..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              required
              placeholder="123 Main St, City, Country"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          {/* Listing Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Listing Type</p>
            <div className="flex gap-4">
              {["sale", "rent"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    id={option}
                    className="h-4 w-4 text-emerald-600 border-slate-300"
                    checked={formData.type === option}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-slate-700 capitalize">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Features */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Features</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["parking", "furnished", "offer"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id={option}
                    className="h-4 w-4 text-emerald-600 border-slate-300 rounded"
                    checked={formData[option]}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-slate-700 capitalize">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Property Details</p>
            <div className="grid grid-cols-2 gap-4">
              {["bedrooms", "bathrooms"].map((field) => (
                <div key={field} className="space-y-1">
                  <label htmlFor={field} className="block text-sm text-slate-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="number"
                    id={field}
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    onChange={handleChange}
                    value={formData[field]}
                  />
                </div>
              ))}

              {["regularPrice", "discountedPrice"].map((field) => (
                <div key={field} className="space-y-1">
                  <label htmlFor={field} className="block text-sm text-slate-700">
                    {field.split(/(?=[A-Z])/).join(' ')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      <FaDollarSign className="text-sm" />
                    </span>
                    <input
                      type="number"
                      id={field}
                      required
                      min="1"
                      max="1000000"
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      onChange={handleChange}
                      value={formData[field]}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                      {formData.type === "rent" ? "/month" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Image Upload */}
        <div className="flex flex-col flex-1 gap-6">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">
                Property Images
              </label>
              <span className="text-xs text-slate-500">
                {formData.imageUrls.length}/6 images
              </span>
            </div>

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center w-full px-4 py-10 border-2 border-dashed border-slate-200 rounded-lg hover:border-emerald-400 transition">
                  <div className="text-center">
                    <FaUpload className="mx-auto text-slate-400 text-xl mb-2" />
                    <p className="text-sm text-slate-500">
                      Drag & drop images or click to browse
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      (Max 6 images, 2MB each)
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                </div>
              </label>
            </div>

            <button
              onClick={handleImageUpload}
              disabled={uploading || !files.length}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 ${
                uploading || !files.length
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              } transition`}
            >
              <FaUpload />
              {uploading ? `Uploading (${uploadProgress}%)` : "Upload Images"}
            </button>

            {uploading && (
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {imageUploadError && (
              <p className="text-red-500 text-sm mt-1">{imageUploadError}</p>
            )}
          </div>

          {/* Uploaded Images Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">
              Uploaded Images ({formData.imageUrls.length})
            </h3>

            {formData.imageUrls.length === 0 ? (
              <div className="border border-slate-200 rounded-lg p-8 text-center">
                <p className="text-slate-400">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 py-3 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}