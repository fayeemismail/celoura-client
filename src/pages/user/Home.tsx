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

  // Redirect to login if not authenticated
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}