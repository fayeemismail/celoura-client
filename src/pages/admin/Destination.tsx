import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getAllDestinations } from "../../redux/admin/authThunks";

export default function DestinationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch<AppDispatch>();

  const getDestinations = async () => {
    try {
      const response = await dispatch(getAllDestinations())
      setDestinations(response.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else {
      getDestinations();
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ backgroundColor: "rgb(8 16 40)" }} className="flex min-h-screen text-white">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />

        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-wide">🌍 Destinations</h2>
            <button
              onClick={() => navigate("/admin/create-destinations")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-5 py-2 rounded-xl font-medium text-white shadow-md transition-all duration-200"
            >
              + Create Destination
            </button>
          </div>

          {destinations.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-lg border border-gray-700 rounded-lg bg-[#1a1f2e]">
              No destinations available. Add one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination: any) => (
                <div
                  key={destination._id}
                  className="bg-[#1f273b] w-[320px] mx-auto rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#2c354d] flex flex-col"
                >
                  {destination.photos?.[0] ? (
                    <img
                      src={destination.photos[0]}
                      alt={destination.name}
                      className="w-full h-50 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-300 text-sm">
                      No Image
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{destination.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {destination.country} — {destination.location}
                      </p>
                      {destination.description && (
                        <p className="text-sm text-gray-300 line-clamp-4 mb-3">
                          {destination.description}
                        </p>
                      )}
                      {destination.features?.length > 0 && (
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          {destination.features.slice(0, 4).map((feat: string, idx: number) => (
                            <li key={idx}>{feat}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
