import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { GetAllDestinations } from "../../redux/user/userThunks";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
};

const GuideDestinations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await dispatch(GetAllDestinations());
      setDestinations(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching destinations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-8 pb-10">
          <h1 className="text-3xl font-bold mb-8">All Destinations</h1>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <div
                  key={dest._id}
                  className="bg-[#111] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/guide/destination/${dest._id}`)}
                >
                  <img
                    src={dest.photos?.[0] || "/placeholder.jpg"}
                    alt={dest.name}
                    loading="lazy"
                    decoding="async"
                    className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{dest.name}</h2>
                    <p className="text-sm text-gray-400">
                      {dest.location}, {dest.country}
                    </p>
                    <p className="mt-2 text-gray-300 text-sm line-clamp-2">
                      {dest.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-10">
              No destinations found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuideDestinations;
