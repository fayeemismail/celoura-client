import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import { addToAvailableDestinationThunk, getDestinationByIdThunk } from "../../redux/guide/authThunks";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  features: string[];
};

const GuideDestinationDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fetchDestination = async () => {
    setLoading(true);
    try {
      if (id) {
        const res = await dispatch(getDestinationByIdThunk(id));
        setDestination(res || null);
      }
    } catch (err) {
      console.error("Error fetching destination", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/guide/login");
    fetchDestination();
  }, [id]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddToTour = async () => {
  try {
    if (id) {
      const response = await dispatch(addToAvailableDestinationThunk(id, currentGuide?.id!));
      
      if (response.success) {
        setShowAddAnimation(true);
        setTimeout(() => setShowAddAnimation(false), 2000);
      } else {
        toast.error("Failed to add destination");
      }
    }
  } catch (error) {
    console.log(error);
    toast.error("An unexpected error occurred");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#000] text-white">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <GuideNavbar />
          <div className="flex justify-center items-center h-screen">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex bg-[#000] text-white">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <GuideNavbar />
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Destination not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <GuideNavbar />
        <main className="pt-24 px-8 pb-10 max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to destinations
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-80 w-full rounded-xl overflow-hidden">
                <img
                  src={destination.photos[selectedImage]}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <AnimatePresence>
                  {showAddAnimation && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 2 }}
                        className="bg-green-500/80 rounded-full p-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {destination.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 rounded-md overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-indigo-500 scale-105"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
              <p className="text-lg text-gray-400 mb-4">
                {destination.location}, {destination.country}
              </p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-300">{destination.description}</p>
              </div>

              {destination.features?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Features</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {destination.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToTour}
                className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add to My Tour
              </motion.button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuideDestinationDetail;