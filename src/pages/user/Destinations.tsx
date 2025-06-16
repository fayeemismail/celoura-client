import { MapPin, Heart } from "lucide-react";
import COLORS from "../../styles/theme";
import Navbar from "../../components/user/home/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDestinations } from "../../redux/admin/authThunks";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  features?: string[];
};

export default function UserDestinations() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const getAllDestinationData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getAllDestinations());
      setDestinations(response.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    getAllDestinationData();
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-xl font-semibold text-gray-500 animate-pulse">
              Loading destinations...
            </p>
          </div>
        ) : destinations.length === 0 ? (
          <h2 className="text-2xl text-center font-bold text-[#797979]">
            Sorry, there are no destinations available...
          </h2>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl overflow-hidden shadow-md border transform transition duration-300 hover:scale-105"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.cardBg,
                }}
              >
                <img
                  src={item.photos[0]}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 flex flex-col justify-between h-[280px]">
                  <div className="mb-3">
                    <h3
                      style={{ color: COLORS.text }}
                      className="text-xl font-semibold mb-1"
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{ color: COLORS.secondaryText }}
                      className="text-sm mb-2"
                    >
                      {item.location} - {item.country}
                    </p>
                    <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                      {item.description.length > 100
                        ? item.description.slice(0, 150) + "..."
                        : item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.features?.slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-gray-200"
                        style={{
                          color: COLORS.accent,
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/destination/${item._id}`)}
                      style={{ color: COLORS.accent }}
                      className="flex items-center text-sm font-medium hover:underline"
                    >
                      <MapPin className="mr-1 h-4 w-4" /> View Details
                    </button>
                    <button
                      className="hover:scale-110 transition-transform"
                      style={{ color: COLORS.secondaryText }}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
