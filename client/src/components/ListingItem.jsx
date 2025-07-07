import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import PropTypes from "prop-types";

export default function ListingItem({ listing }) {
  const imageUrl =
    listing?.imageUrls?.[0] ||
    "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg";

  // Use the same property name as in MyListings (discountedPrice)
  const showDiscount = listing.offer && (listing.discountedPrice || listing.discountPrice);
  const discountedPrice = listing.discountedPrice || listing.discountPrice;

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px] md:w-[310px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={imageUrl}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name || "No name"}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address || "No address provided"}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description || "No description"}
          </p>
          
          {/* Updated Price Display */}
          <div className="flex items-center gap-2">
            {showDiscount ? (
              <>
                <p className="text-slate-500 font-semibold line-through">
                  ${listing.regularPrice?.toLocaleString("en-US")}
                </p>
                <p className="text-green-600 font-semibold">
                  ${discountedPrice?.toLocaleString("en-US")}
                </p>
              </>
            ) : (
              <p className="text-slate-500 font-semibold">
                ${listing.regularPrice?.toLocaleString("en-US") || "N/A"}
              </p>
            )}
            {listing.type === "rent" && (
              <span className="text-sm text-gray-500">/ month</span>
            )}
          </div>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms || 0} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms || 0} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    regularPrice: PropTypes.number,
    discountPrice: PropTypes.number,  // Keep both for backward compatibility
    discountedPrice: PropTypes.number, // Add the new property name
    offer: PropTypes.bool,
    type: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};