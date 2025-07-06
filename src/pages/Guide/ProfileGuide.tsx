import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import { User, Settings  } from "lucide-react";
import { getProfileGuide } from "../../redux/guide/authThunks";
import { Guide } from "../../types/Guide";

const GuideProfile = () => {
  let { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [guideProfile, setGuideProfile] = useState<Guide | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleProfile = async (id: string) => {
    try {
      const response = await dispatch(getProfileGuide(id));
      setGuideProfile(response);
      // if(currentGuide) 
    } catch (error) {
      console.error("Failed to fetch guide profile", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guide/login");
    }
    handleProfile(currentGuide?.id!);
  }, [isAuthenticated, currentGuide?.id]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleCreatePost = () => {
    navigate("/guide/create-post");
  };

  const handleEditProfile = () => {
    navigate("/guide/edit-profile");
  };

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-4 pb-10">
          {guideProfile && (
            <div className="bg-[#111] p-6 rounded-2xl shadow-md relative max-w-4xl mx-auto">
              {/* Action menu */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="p-2 hover:bg-gray-700 rounded-full transition"
                >
                  <Settings  className="w-6 h-6 text-gray-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#1c1c1c] border border-gray-700 rounded-md shadow-lg z-50">
                    <button
                      onClick={handleCreatePost}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                    >
                      Create New Post
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>

              {/* Profile section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-8">
                <div className="flex-shrink-0 w-32 h-32 relative mb-4 sm:mb-0">
                  {guideProfile.profilePic ? (
                    <img
                      src={guideProfile.profilePic}
                      alt="Profile"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#09b86c]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-[#09b86c] bg-gray-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  {guideProfile.name ? (
                    <h2 className="text-2xl font-bold mb-1">
                    {guideProfile.name}
                  </h2>
                  ) : (
                    <h2 className="text-2xl font-bold mb-1">
                    User
                  </h2>
                  )}
                  
                  <p className="text-gray-400 mb-3">
                    @{currentGuide?.email?.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-300 max-w-md mx-auto sm:mx-0">
                    {guideProfile.bio?.trim() || "Add bio"}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-3 text-center gap-4 text-sm text-gray-400">
                <div>
                  <p className="text-lg font-semibold text-white">{guideProfile.destinations.length}</p>
                  <p>Destinations</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{guideProfile.followers.length}</p>
                  <p>Followers</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{guideProfile.happyCustomers.length}</p>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuideProfile;
