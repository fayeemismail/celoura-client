import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import COLORS from "../../styles/theme";

// Import components
import Navbar from "../../components/user/home/Navbar";
import HeroSection from "../../components/user/home/HeroSection";
import CategoriesSection from "../../components/user/home/Category";
import FeaturedDestinations from "../../components/user/home/FeaturedDestination";
import TravelTips from "../../components/user/home/TravelTips";
import Footer from "../../components/user/home/Footer";



export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Redirection to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);



  return (
    <div style={{ backgroundColor: COLORS.bg }} className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto p-4">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Featured Destinations */}
        <FeaturedDestinations />

        {/* Travel Tips Section */}
        <TravelTips />

        
        <section className="my-16 container mx-auto px-4">
          <div style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
            className="border rounded-xl shadow-lg p-8 max-w-4xl mx-auto text-center">
            <h2 style={{ color: COLORS.text }} className="text-2xl font-bold mb-4">
              Become a Tour Guide
            </h2>
            <p style={{ color: COLORS.secondaryText }} className="mb-6 max-w-2xl mx-auto">
              Share your local knowledge and earn money by guiding travelers through your city's hidden gems.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/become-a-guide')}
                style={{ backgroundColor: COLORS.accent }}
                className="px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Apply Now
              </button>
              <button
                style={{ color: COLORS.text, borderColor: COLORS.border }}
                className="px-6 py-3 font-medium rounded-lg border hover:bg-gray-50 transition"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}