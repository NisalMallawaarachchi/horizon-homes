import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
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
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full"
            >
              <div className="relative pb-[60%]"> {/* This maintains a 3:2 aspect ratio */}
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="absolute w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1 flex-grow">
                <h3 className="text-lg font-semibold">{listing.name}</h3>
                <p className="text-sm text-gray-600">{listing.address}</p>
                <p className="text-sm text-emerald-600 font-bold">
                  $
                  {listing.offer ? listing.discountPrice : listing.regularPrice}
                </p>

                <div className="flex justify-end mt-3 gap-3">
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => alert("Edit functionality coming soon!")}
                    className="text-emerald-500 hover:text-emerald-700"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}