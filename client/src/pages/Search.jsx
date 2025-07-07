import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = new URLSearchParams({
        ...sidebardata,
        startIndex: 0, // Add this
      }).toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setShowMore(data.length > 8);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]); // ✅ dependency array added

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
    const [sort, order] = e.target.value.split("_");
    setSidebardata({ 
      ...sidebardata, 
      sort: sort === "regularPrice" ? "regularPrice" : sort,
      order 
    });
  }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar – Search / Filters */}
      <div className="w-full lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-300 bg-white shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white px-4 py-3 rounded-xl flex flex-col gap-6 shadow-md border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-700">Filters</h2>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <label className="text-gray-600 sm:whitespace-nowrap font-medium">
              Search Term:
            </label>
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full sm:flex-1 bg-gray-50 focus:outline-none text-gray-700 px-3 py-2 rounded-md border border-gray-300"
              id="searchTerm"
              value={sidebardata.searchTerm}
              onChange={handleChange}
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
                onChange={handleChange}
                checked={sidebardata.type == "all"}
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
                onChange={handleChange}
                checked={sidebardata.type == "rent"}
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
                onChange={handleChange}
                checked={sidebardata.type == "sale"}
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
                onChange={handleChange}
                checked={sidebardata.offer}
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
                onChange={handleChange}
                checked={sidebardata.parking}
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
                onChange={handleChange}
                checked={sidebardata.furnished}
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
              id="sort_order"
              name="sort_order"
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 px-3 py-2 rounded-md focus:outline-none"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <p className="text-lg text-slate-600 text-center w-full">
              Loading...
            </p>
          )}
          {!loading && listings.length === 0 && (
            <p className="text-lg text-slate-500 text-center w-full">
              No listings found!
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="w-full text-center text-green-700 hover:underline py-4"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
