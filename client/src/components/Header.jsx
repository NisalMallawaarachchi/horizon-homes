import { useState, useEffect, useRef } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  // Keep search term in sync with URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-emerald-100 shadow-md sticky top-0 z-30">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-emerald-500">Horizon</span>
              <span className="text-slate-700">Homes</span>
            </h1>
          </Link>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-2 rounded-lg flex items-center shadow-sm mx-2 flex-1 max-w-md"
        >
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="focus:outline-none bg-transparent w-full px-2 text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-emerald-600 ml-2" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex space-x-4 text-sm sm:text-base text-emerald-700 items-center">
          <li
            className={`hover:text-emerald-900 hover:underline ${
              location.pathname === "/" ? "font-bold underline" : ""
            }`}
          >
            <Link to="/">Home</Link>
          </li>
          <li
            className={`hover:text-emerald-900 hover:underline ${
              location.pathname === "/about" ? "font-bold underline" : ""
            }`}
          >
            <Link to="/about">About</Link>
          </li>
          <li ref={dropdownRef} className="relative">
            {currentUser ? (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <img
                    src={
                      currentUser?.avatar ||
                      "https://i.postimg.cc/Y0JPMM7V/image.png"
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="hidden md:inline">
                    Welcome, {currentUser?.username}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-emerald-50"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/listings"
                      className="block px-4 py-2 hover:bg-emerald-50"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/signout"
                      className="block px-4 py-2 hover:bg-emerald-50"
                    >
                      Sign Out
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link to="/signin">
                <button className="bg-emerald-500 text-white px-4 py-1 rounded-lg hover:bg-emerald-700 transition">
                  Sign in
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-emerald-100 p-4 shadow-md z-40">
          <ul className="flex flex-col space-y-3">
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block py-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block py-2"
              >
                About
              </Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block py-2"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signout"
                    onClick={() => setIsOpen(false)}
                    className="block py-2"
                  >
                    Sign Out
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block py-2"
                >
                  <button className="bg-emerald-500 text-white px-4 py-1 rounded-lg w-full">
                    Sign in
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
