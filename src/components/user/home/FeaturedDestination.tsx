import { MapPin, Heart } from "lucide-react";
import COLORS from "../../../styles/theme";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  rating?: number;
};

interface Props {
  destinations?: Destination[];
}

export default function FeaturedDestinations({ destinations = [] }: Props) {
  return (
    <section className="mb-12">
      <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-6">
        Featured Destinations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div
            key={destination._id}
            style={{
              backgroundColor: COLORS.cardBg,
              borderColor: COLORS.border,
            }}
            className="border rounded-lg overflow-hidden shadow-sm transition-transform duration-400 hover:scale-105"
          >
            <img
              src={destination.photos[0]}
              alt={destination.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 style={{ color: COLORS.text }} className="text-lg font-semibold">
                    {destination.name}
                  </h3>
                  <div style={{ color: COLORS.accent }} className="flex items-center">
                    <span className="mr-1">★</span>
                    <span>{destination.rating ?? "4.5"}</span>
                  </div>
                </div>
                <p
                  style={{ color: COLORS.secondaryText }}
                  className="mb-4 line-clamp-3"
                >
                  {destination.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
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
