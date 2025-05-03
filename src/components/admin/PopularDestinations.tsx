import React from "react";
import { ADMIN_COLORS } from "../../styles/theme";
import { TrendingUp } from "lucide-react";

// Mock data for popular destinations
const destinations = [
  {
    name: "Bali, Indonesia",
    bookings: 245,
    growth: 18,
    image: "/api/placeholder/400/320"
  },
  {
    name: "Santorini, Greece",
    bookings: 189,
    growth: 12,
    image: "/api/placeholder/400/320"
  },
  {
    name: "Tokyo, Japan",
    bookings: 156,
    growth: 9,
    image: "/api/placeholder/400/320"
  },
  {
    name: "Paris, France",
    bookings: 132,
    growth: 5,
    image: "/api/placeholder/400/320"
  }
];

export default function PopularDestinations() {
  return (
    <div 
      style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }} 
      className="rounded-lg border shadow-sm"
    >
      <div 
        style={{ borderColor: ADMIN_COLORS.border }} 
        className="flex items-center justify-between border-b p-6"
      >
        <h2 style={{ color: ADMIN_COLORS.text }} className="text-lg font-semibold">
          Popular Destinations
        </h2>
        <button 
          style={{ color: ADMIN_COLORS.accent }} 
          className="text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {destinations.map((destination, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 style={{ color: ADMIN_COLORS.text }} className="text-sm font-medium">
                    {destination.name}
                  </h3>
                  <p style={{ color: ADMIN_COLORS.secondaryText }} className="text-xs">
                    {destination.bookings} bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center text-green-600 bg-green-100 rounded-full px-2 py-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="text-xs font-medium">+{destination.growth}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <button
          style={{ 
            backgroundColor: ADMIN_COLORS.hoverBg, 
            color: ADMIN_COLORS.accent,
            borderColor: ADMIN_COLORS.border
          }}
          className="mt-6 w-full rounded-lg border py-2 text-sm font-medium hover:bg-opacity-80"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}