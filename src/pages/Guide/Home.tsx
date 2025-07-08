import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import GuideNavbar from "../../components/guide/GuideNavbar";
import Sidebar from "../../components/guide/GuideSidebar";
import { Plus, Compass, MapPin, User as UserIcon } from "lucide-react";
import { getNewDestinationsThunk } from "../../redux/guide/authThunks";

const GuideHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.guide);
  const dispatch = useDispatch<AppDispatch>()

  const getNewDestinations = async() => {
    try {
      const response = await dispatch(getNewDestinationsThunk(4));
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guide/login");
    }
    getNewDestinations()
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-[#000]">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="p-10 pt-24 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate("/guide/create-post")}
              className="rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-24 cursor-pointer transition-transform transform hover:scale-105 bg-[#09b86c]"
            >
              <Plus className="w-5 h-5 mb-1" />
              <h2 className="text-sm font-medium">New Post</h2>
            </div>

            <div
              onClick={() => navigate("/guide/explore")}
              className="rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-24 cursor-pointer transition-transform transform hover:scale-105 bg-[#2596be]"
            >
              <Compass className="w-5 h-5 mb-1" />
              <h2 className="text-sm font-medium">Explore</h2>
            </div>

            <div
              onClick={() => navigate("/guide/add-destination")}
              className="rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-24 cursor-pointer transition-transform transform hover:scale-105 bg-[#e0a800]"
            >
              <MapPin className="w-5 h-5 mb-1" />
              <h2 className="text-sm font-medium">Add Destination</h2>
            </div>

            <div
              onClick={() => navigate("/guide/profile")}
              className="rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-24 cursor-pointer transition-transform transform hover:scale-105 bg-[#ff6f61]"
            >
              <UserIcon className="w-5 h-5 mb-1" />
              <h2 className="text-sm font-medium">Profile</h2>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default GuideHome;