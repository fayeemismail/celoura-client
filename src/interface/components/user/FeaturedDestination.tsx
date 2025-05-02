import { MapPin, Heart } from "lucide-react";
import COLORS from "../../styles/theme";

// Mock data for featured destinations
const featuredDestinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image: "/api/placeholder/400/250",
    description: "Tropical paradise with stunning beaches and vibrant culture",
    rating: 4.8
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "/api/placeholder/400/250",
    description: "Ancient temples and traditional gardens in Japan's cultural heart",
    rating: 4.7
  },
  {
    id: 3,
    name: "Santorini, Greece",
    image: "/api/placeholder/400/250",
    description: "Iconic white buildings with blue domes overlooking the Aegean Sea",
    rating: 4.9
  }
];

export default function FeaturedDestinations() {
  return (
    <section className="mb-12">
      <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-6">Featured Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredDestinations.map((destination) => (
          <div
            key={destination.id}
            style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ color: COLORS.text }} className="text-lg font-semibold">{destination.name}</h3>
                <div style={{ color: COLORS.accent }} className="flex items-center">
                  <span className="mr-1">★</span>
                  <span>{destination.rating}</span>
                </div>
              </div>
              <p style={{ color: COLORS.secondaryText }} className="mb-4">{destination.description}</p>
              <div className="flex items-center justify-between">
                <button
                  style={{ color: COLORS.accent }}
                  className="flex items-center font-medium hover:underline"
                >
                  <MapPin className="mr-1 h-4 w-4" /> View Details
                </button>
                <button
                  style={{ color: COLORS.secondaryText }}
                  className="flex items-center hover:text-accent"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}