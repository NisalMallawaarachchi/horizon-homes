import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Listing() {
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          toast.error("Listing not found");
          return;
        }
        setListing(data);
      } catch (error) {
        setError(true);
        toast.error("Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleContactOwner = async () => {
    try {
      setContactLoading(true);
      // Implement your contact logic here
      toast.success("Contact request sent successfully!");
    } catch (error) {
      toast.error("Failed to send contact request");
    } finally {
      setContactLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 w-full bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Listing Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The listing you're looking for does not exist or may have been
          removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse Other Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 mb-4 hover:text-slate-900 transition"
      >
        <IoIosArrowBack className="mr-1" /> Back to results
      </button>

      <h1 className="text-3xl font-bold mb-4">{listing.name}</h1>

      {/* Image Slider */}
      <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
        <Slider {...sliderSettings}>
          {listing.imageUrls.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`${listing.name} - View ${index + 1}`}
                className="w-full h-96 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Price Section */}
      <div className="bg-emerald-50 p-4 rounded-lg mb-6">
        <p className="text-emerald-700 font-bold text-2xl">
          {listing.offer ? (
            <>
              <span className="line-through text-gray-500 mr-2 text-lg">
                ${listing.regularPrice.toLocaleString()}
              </span>
              ${listing.discountedPrice.toLocaleString()}
              <span className="ml-2 text-emerald-600 text-sm font-bold">
                (
                {Math.round(
                  100 - (listing.discountedPrice / listing.regularPrice) * 100
                )}
                % off!)
              </span>
            </>
          ) : (
            <>${listing.regularPrice.toLocaleString()}</>
          )}
          <span className="block text-gray-600 text-sm font-normal mt-1">
            {listing.type === "rent" ? "per month" : "one-time payment"}
          </span>
        </p>
      </div>

      {/* Property Type Badge */}
      <div className="mb-4">
        <span className="inline-block bg-red-200 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
          <FaBed className="text-emerald-700 mr-2" />
          <span className="text-emerald-700">
            {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
          </span>
        </div>
        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
          <FaBath className="text-emerald-700 mr-2" />
          <span className="text-emerald-700">
            {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
          </span>
        </div>
        {listing.parking && (
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <FaParking className="text-emerald-700 mr-2" />
            <span className="text-emerald-700">Parking</span>
          </div>
        )}
        {listing.furnished && (
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <FaChair className="text-emerald-700 mr-2" />
            <span className="text-emerald-700">Furnished</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {/* Address with Location Icon */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-gray-700">{listing.address}</p>
        </div>
      </div>

      {/* Contact Button */}
      <button
        onClick={handleContactOwner}
        disabled={contactLoading}
        className={`w-full py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium hover:bg-blue-700 transition ${
          contactLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {contactLoading ? "Processing..." : "Contact Owner"}
      </button>
    </div>
  );
}
