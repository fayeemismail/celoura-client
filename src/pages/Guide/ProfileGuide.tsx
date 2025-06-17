import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import { GetAllDestinations } from "../../redux/user/userThunks";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  features?: string[];
};

const GuideProfile = () => {
  const { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const getDestinations = async () => {
    setLoading(true);
    try {
      const response = await dispatch(GetAllDestinations());
      setDestinations(response.data?.data || []);
    } catch (error: any) {
      console.error("Failed to fetch destinations:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guide/login");
    } else {
      getDestinations();
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const profileImage = useMemo(() => {
    return destinations[5]?.photos?.[0] || "/placeholder.jpg";
  }, [destinations]);

  const profileDescription = useMemo(() => {
    return (
      destinations[8]?.description?.slice(0, 121) ||
      "Welcome to my guide profile. Exploring new places and sharing my stories."
    );
  }, [destinations]);

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-8 pb-10">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6 mb-10">
                <div className="flex-shrink-0">
                  <img
                    src={profileImage}
                    alt="Profile"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#09b86c]"
                  />
                </div>

                {/* Guide Info */}
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-bold">{currentGuide?.name || "Guide Name"}</h2>
                  <p className="text-gray-400">@{currentGuide?.email?.split("@")[0] || "guide_user"}</p>
                  <p className="mt-2 text-sm text-gray-300 max-w-md">{profileDescription}</p>

                  {/* Stats */}
                  <div className="mt-4 flex justify-center sm:justify-start gap-6 text-sm">
                    <div>
                      <span className="font-semibold">25</span> Posts
                    </div>
                    <div>
                      <span className="font-semibold">1.2k</span> Followers
                    </div>
                    <div>
                      <span className="font-semibold">180</span> Following
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinations.map((item) => (
                  <div
                    key={item._id}
                    className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={item.photos?.[0] || "/placeholder.jpg"}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuideProfile;
