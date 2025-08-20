import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import Navbar from "../home/Navbar";
import { getGuideWDestinationThunk } from "../../../redux/user/userThunks";
import { FaUserCircle } from "react-icons/fa";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  features?: string[];
};

type Guide = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  basedOn: string;
  bio: string;
  profilePic: string;
  expertise: string[];
  availableDestinations: string[];
};

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [destination, setDestination] = useState<Destination>();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [activePhoto, setActivePhoto] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.admin
  );

  const getSingleSpot = async () => {
    setLoading(true);
    try {
      if (id) {
        const data = await dispatch(getGuideWDestinationThunk(id));
        // console.log(data.guide)
        setDestination(data.destination);
        setGuides(data.guide || []);
        setActivePhoto(data.destination.photos?.[0] || "");
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    getSingleSpot();
  }, [isAuthenticated, id]);

  const handleViewProfile = (guideId: string) => {
    navigate(`/guide-profile/${guideId}`);
  };

  const handleBookGuide = (guideId: string) => {
    if (id) {
      navigate(`/book-guide/${id}/${guideId}`, {
        state: { destinationId: id },
      });
    }
  };

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-10 px-4 max-w-7xl mx-auto min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-[#9B8759] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : destination ? (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Image and Thumbnails */}
            <div className="relative">
              <img
                src={activePhoto}
                alt={destination.name}
                loading="lazy"
                decoding="async"
                className="w-full h-[500px] object-cover rounded-t-2xl"
              />
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/70 p-2 rounded-xl backdrop-blur-md shadow-md">
                {destination.photos?.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    onClick={() => setActivePhoto(photo)}
                    className={`w-20 h-16 object-cover rounded cursor-pointer border-2 ${
                      activePhoto === photo ? "border-blue-500" : "border-transparent"
                    }`}
                    alt={`thumb-${idx}`}
                  />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-3 text-gray-900">
                {destination.name}
              </h1>
              <p className="text-md text-gray-500 mb-4">
                📍 {destination.location}, {destination.country}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {destination.description}
              </p>

              {destination.features && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Key Features
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {destination.features.map((feat, i) => (
                      <span
                        key={i}
                        className="bg-[#9B8759]/20 text-[#9B8759] text-sm px-3 py-1 rounded-full"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Guides Section */}
              {guides.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Available Guides in {destination.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guides.map((guide) => (
                      <div
                        key={guide._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
                      >
                        <div className="p-4 flex items-start space-x-4 flex-1">
                          {guide.profilePic ? (
                            <img
                              src={guide.profilePic}
                              alt={guide.user.name}
                              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <FaUserCircle className="w-16 h-16 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{guide.user.name}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                              {guide.bio || "No bio available"}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {guide.expertise?.map((skill, i) => (
                                <span
                                  key={i}
                                  className="bg-[#9B8759]/20 text-[#9B8759] text-xs px-2 py-1 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex border-t border-gray-100 mt-auto">
                          <button
                            onClick={() => handleViewProfile(guide.user._id)}
                            className="flex-1 py-2 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleBookGuide(guide.user?._id)}
                            className="flex-1 py-2 px-4 bg-[#9B8759] text-white hover:bg-[#8a7a4d] transition-colors text-sm font-medium"
                          >
                            Book Guide
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-2 bg-[#9B8759] text-white text-sm rounded-lg hover:bg-[#8a7a4d] transition-colors"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Destination not found.</p>
        )}
      </section>
    </>
  );
}