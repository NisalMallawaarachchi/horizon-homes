import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${userId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await res.json();
        setListings(data);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  const handleDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }

      setListings((prev) => prev.filter((l) => l._id !== listingId));
      toast.success("Listing deleted");
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer position="top-center" />
      <h2 className="text-3xl font-bold mb-6 text-center">My Listings</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full relative" // Added relative here
            >
              {/* Clickable area covering the image and text */}
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/listing/${listing._id}`)}
              >
                <div className="relative pb-[60%]">
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1 flex-grow">
                  <h3 className="text-lg font-semibold">{listing.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="flex-shrink-0 text-emerald-700" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                  {/* Price Section */}
                  <p className="text-sm text-emerald-600 font-bold">
                    {listing.offer ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-500 line-through">
                          ${listing.regularPrice}
                        </span>
                        <span className="text-md text-emerald-600 font-bold">
                          ${listing.discountedPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-md text-slate-800 font-bold">
                        ${listing.regularPrice}
                      </span>
                    )}
                  </p>
                  {/* 👇 Beds and Baths */}
                  <div className="flex gap-4 text-sm text-gray-600 mt-4">
                    <span>
                      <FaBed className="text-emerald-700 mr-2" />
                      {listing.bedrooms} Bed{listing.bedrooms > 1 ? "s" : ""}
                    </span>
                    <span>
                      <FaBath className="text-emerald-700 mr-2" />
                      {listing.bathrooms} Bath{listing.bathrooms > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons - not part of the clickable area */}
              <div className="flex justify-end mt-3 gap-3 p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(listing._id);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update-listing/${listing._id}`);
                  }}
                  className="text-emerald-500 hover:text-emerald-700"
                  title="Edit"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
