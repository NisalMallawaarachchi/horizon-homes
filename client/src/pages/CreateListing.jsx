import { FaUpload, FaTrashAlt } from "react-icons/fa";

export default function CreateListing() {
  return (
    <main className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800">Create a Listing</h1>
        <p className="mt-2 text-slate-500">
          Fill in the details to create your property listing
        </p>
      </div>

      <form className="flex flex-col sm:flex-row gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Listing Name
            </label>
            <input
              type="text"
              placeholder="Beautiful modern apartment in downtown"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
              id="name"
              minLength="10"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="Description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              placeholder="Describe your property in detail..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl resize-none h-28 focus:outline-none focus:ring-2 focus:ring-slate-500"
              id="Description"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="Address" className="block text-sm font-medium text-slate-700">
              Address
            </label>
            <input
              type="text"
              placeholder="123 Main St, City, Country"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
              id="Address"
              required
            />
          </div>

          {/* Listing Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Listing Options</p>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "sale", label: "Sell" },
                { id: "rent", label: "Rent" },
                { id: "parking", label: "Parking spot" },
                { id: "furnished", label: "Furnished" },
                { id: "offer", label: "Offer" },
              ].map(({ id, label }) => (
                <label key={id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-slate-600 rounded border-slate-300"
                    id={id}
                  />
                  <span className="text-slate-700 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Property Details</p>
            <div className="flex flex-wrap gap-6">
              {[{ id: "bedrooms", label: "Bedrooms" }, { id: "bathrooms", label: "Bathrooms" }].map(
                ({ id, label }) => (
                  <div key={id} className="flex items-center gap-3">
                    <input
                      type="number"
                      className="px-4 py-2.5 w-20 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                      id={id}
                      min="1"
                      max="10"
                      required
                    />
                    <label htmlFor={id} className="text-slate-700 text-sm">{label}</label>
                  </div>
                )
              )}

              {/* Prices */}
              {[
                { id: "regularPrice", label: "Regular price" },
                { id: "discountedPrice", label: "Discounted price" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <input
                    type="number"
                    className="px-4 py-2.5 w-28 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                    id={id}
                    min="1"
                    max="1000000"
                    required
                  />
                  <div className="flex flex-col">
                    <label htmlFor={id} className="text-slate-700 text-sm">{label}</label>
                    <span className="text-xs text-slate-500">($ / month)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1 gap-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700">
                Property Images
              </label>
              <span className="text-xs text-slate-500">
                First image will be the cover (max 6)
              </span>
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                id="images"
                type="file"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-800 transition duration-200 flex items-center gap-2"
              >
                <FaUpload className="text-base" /> Upload
              </button>
            </div>
          </div>

          {/* Image Preview */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden">
                  <img src="#" alt="listing image" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">image.jpg</p>
                  <p className="text-xs text-slate-500">2.4 MB</p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 text-red-600 hover:text-red-800 transition duration-200 rounded-full hover:bg-red-100"
              >
                <FaTrashAlt className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="mt-2 px-5 py-3 bg-slate-700 text-white rounded-xl uppercase text-sm font-semibold hover:bg-slate-800 transition duration-200 shadow-sm flex items-center justify-center gap-2"
            type="submit"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
