export default function Search() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar – Search / Filters */}
      <div className="w-full lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-300 bg-white shadow-sm">
        <form
          action=""
          className="bg-white px-4 py-3 rounded-xl flex flex-col gap-6 shadow-md border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-700">Filters</h2>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <label className="text-gray-600 whitespace-nowrap font-medium">
              Search Term:
            </label>
            <input
              type="text"
              placeholder="Search listings..."
              className="flex-1 bg-gray-50 focus:outline-none text-gray-700 px-3 py-2 rounded-md border border-gray-300"
            />
          </div>

          {/* Filter - Type Checkboxes */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 font-medium">Type:</span>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                id="all"
                name="type"
                value="all"
                className="w-5 h-5 text-blue-600 rounded"
              />
              All Types
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                id="rent"
                name="type"
                value="rent"
                className="w-5 h-5 text-blue-600 rounded"
              />
              Rent
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                id="sale"
                name="type"
                value="sale"
                className="w-5 h-5 text-blue-600 rounded"
              />
              Sale
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                id="offer"
                name="type"
                value="offer"
                className="w-5 h-5 text-blue-600 rounded"
              />
              Offer
            </label>
          </div>

          {/* Filter - Amenities Checkboxes */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 font-medium">Amenities:</span>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                id="parking"
                name="amenities"
                value="parking"
                className="w-5 h-5 text-blue-600 rounded"
              />
              Parking
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                id="furnished"
                name="amenities"
                value="furnished"
                className="w-5 h-5 text-blue-600 rounded"
              />
              Furnished
            </label>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-600 font-medium">
              Sort:
            </label>
            <select
              id="sort"
              name="sort_order"
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Right Content – Listings */}
      <div className="w-full lg:w-2/3 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Listing Results:
        </h1>

        {/* Placeholder for listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example Listing Box */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800">
              Listing Title
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Description goes here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
