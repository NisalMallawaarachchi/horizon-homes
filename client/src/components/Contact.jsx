import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Contact({ listing }) {
  const [landOwner, setLandOwner] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandOwner = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);

        if (!res.ok) {
          throw new Error(
            `Failed to fetch landlord information (status: ${res.status})`
          );
        }

        const data = await res.json();

        if (!data.email || !data.username) {
          throw new Error("Landlord data is incomplete");
        }

        setLandOwner(data);
      } catch (error) {
        console.error("Fetch landlord error:", error);
        toast.error(error.message || "Error fetching landlord data");
      }
    };

    if (listing.userRef) {
      fetchLandOwner();
    }
  }, [listing.userRef]);

  return (
    <>
      {landOwner && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landOwner.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landOwner.email.trim()}?subject=${encodeURIComponent(
              `Regarding ${listing.name}`
            )}&body=${encodeURIComponent(message)}`}
            className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95 font-medium"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
