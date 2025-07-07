import {
  FaHome,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import { MdOutlineEmojiPeople } from "react-icons/md";
import PropTypes from "prop-types";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-32 px-6 bg-gradient-to-r from-emerald-800 to-emerald-600 text-white flex-grow-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Redefining Real Estate Excellence
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8">
            At Horizon Homes, we don't just sell properties - we create lasting
            relationships and help build communities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/search"
              className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition duration-300"
            >
              Get Started
            </a>
            <a
              href="/search"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-700 transition duration-300"
            >
              Browse Listings
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <StatCard
            number="500+"
            label="Happy Clients"
            icon={
              <MdOutlineEmojiPeople className="text-3xl text-emerald-600" />
            }
          />
          <StatCard
            number="$1B+"
            label="Properties Sold"
            icon={<FaHome className="text-3xl text-emerald-600" />}
          />
          <StatCard
            number="15+"
            label="Years Experience"
            icon={<FaAward className="text-3xl text-emerald-600" />}
          />
          <StatCard
            number="98%"
            label="Client Satisfaction"
            icon={<FaHandshake className="text-3xl text-emerald-600" />}
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 bg-gray-50 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2008, Horizon Homes began as a small team of
                passionate realtors with a vision to transform the real estate
                experience. What started as a local boutique agency has grown
                into one of the region's most trusted names in real estate.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our growth has been fueled by our commitment to integrity,
                innovation, and personalized service. We've consistently ranked
                among the top agencies in customer satisfaction, proving that
                putting people first is good business.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Our team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center text-gray-800">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<FaHandshake className="text-4xl mb-4 text-emerald-600" />}
              title="Integrity"
              description="We believe in doing business the right way - with honesty, transparency, and ethical practices that stand the test of time."
            />
            <ValueCard
              icon={<FaUsers className="text-4xl mb-4 text-emerald-600" />}
              title="Client Focus"
              description="Your goals are our priority. We listen first, then craft personalized strategies to meet your unique real estate needs."
            />
            <ValueCard
              icon={<FaChartLine className="text-4xl mb-4 text-emerald-600" />}
              title="Expertise"
              description="Our deep market knowledge and innovative tools ensure you get the best advice and maximum value from every transaction."
            />
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 px-6 bg-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Meet Our Award-Winning Team
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our success comes from our people - a diverse group of professionals
            united by a passion for real estate and service excellence.
          </p>
          <a
            href="/team"
            className="inline-block px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition duration-300"
          >
            View Our Team
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're buying, selling, or investing, we have the expertise
            to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/"
              className="px-8 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition duration-300"
            >
              Get in Touch
            </a>
            <a
              href="/search"
              className="px-8 py-3 border-2 border-emerald-700 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition duration-300"
            >
              Explore Listings
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Reusable Components
function StatCard({ number, label, icon }) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="text-3xl font-bold text-gray-800 mb-2">{number}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

function ValueCard({ icon, title, description }) {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition duration-300">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

StatCard.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

ValueCard.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
