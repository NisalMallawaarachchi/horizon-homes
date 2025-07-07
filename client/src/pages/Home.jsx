import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListingItem from "../components/ListingItem";
import { FaSearch, FaHome, FaMoneyBillWave, FaKey } from "react-icons/fa";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Fetch all listings in parallel
        const [offers, rent, sale] = await Promise.all([
          fetch("/api/listing/get?offer=true&limit=4").then(res => res.json()),
          fetch("/api/listing/get?type=rent&limit=4").then(res => res.json()),
          fetch("/api/listing/get?type=sale&limit=4").then(res => res.json())
        ]);
        
        setOfferListings(offers);
        setRentListings(rent);
        setSaleListings(sale);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Enhanced slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  // Quick links data
  const quickLinks = [
    {
      icon: <FaSearch className="text-2xl text-emerald-600" />,
      title: "Find a Home",
      description: "Browse our extensive property listings",
      link: "/search",
    },
    {
      icon: <FaMoneyBillWave className="text-2xl text-emerald-600" />,
      title: "Special Offers",
      description: "View properties with exclusive discounts",
      link: "/search?offer=true",
    },
    {
      icon: <FaHome className="text-2xl text-emerald-600" />,
      title: "For Sale",
      description: "Explore homes available for purchase",
      link: "/search?type=sale",
    },
    {
      icon: <FaKey className="text-2xl text-emerald-600" />,
      title: "For Rent",
      description: "Find your perfect rental property",
      link: "/search?type=rent",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 bg-gradient-to-r from-emerald-800 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find Your Dream <span className="text-emerald-200">Home</span> Today
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover the perfect property from our curated collection of homes, apartments, and commercial spaces.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition duration-300"
            >
              <FaSearch className="mr-2" />
              Explore Properties
            </Link>
          </div>
          <div className="md:w-1/2 hidden md:block">
            <img 
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg" 
              alt="Beautiful home"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-emerald-50 rounded-full mr-4">
                  {link.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{link.title}</h3>
              </div>
              <p className="text-gray-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Carousel */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Featured Properties</h2>
          {loading ? (
            <div className="text-center py-12">Loading featured properties...</div>
          ) : offerListings.length > 0 ? (
            <Slider {...sliderSettings}>
              {offerListings.map((listing) => (
                <div key={listing._id} className="px-2">
                  <Link to={`/listing/${listing._id}`}>
                    <div
                      className="h-64 md:h-96 w-full rounded-lg shadow-md relative"
                      style={{
                        background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center/cover no-repeat`,
                      }}
                    >
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold">{listing.name}</h3>
                        <p className="text-lg">
                          ${listing.regularPrice?.toLocaleString()}
                          {listing.type === "rent" && "/month"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-12 text-gray-500">No featured properties available</div>
          )}
        </div>
      </section>

      {/* Listings Sections */}
      <section className="py-12 px-6 bg-white max-w-6xl mx-auto">
        <ListingSection
          title="Recent Offers"
          listings={offerListings}
          loading={loading}
          link="/search?offer=true"
          linkText="View all offers"
        />

        <ListingSection
          title="Properties for Rent"
          listings={rentListings}
          loading={loading}
          link="/search?type=rent"
          linkText="View all rentals"
        />

        <ListingSection
          title="Properties for Sale"
          listings={saleListings}
          loading={loading}
          link="/search?type=sale"
          linkText="View all sales"
        />
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-lg mb-8">
            Our expert agents are here to help you every step of the way.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition duration-300"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}

// Reusable Listing Section Component
function ListingSection({ title, listings, loading, link, linkText }) {
  if (loading) return null;
  if (listings.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Link
          to={link}
          className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
        >
          {linkText} <span className="ml-1">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  );
}