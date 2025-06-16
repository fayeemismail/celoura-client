import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import Navbar from "../home/Navbar";
import { GetSingleDestination } from "../../../redux/user/userThunks";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  features?: string[];
};

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [destination, setDestination] = useState<Destination>();
  const [activePhoto, setActivePhoto] = useState<string>("");
  const [loading, setLoading] = useState(false)

  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.admin
  );

  const getSingleSpot = async () => {
    setLoading(true)
    try {
      if (id) {
        const response = await dispatch(GetSingleDestination(id));
        setDestination(response.data);
        setActivePhoto(response.data.photos?.[0]); 
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    getSingleSpot();
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-10 px-4 max-w-7xl mx-auto min-h-screen">
        {loading ? (
          <p className="text-center text-lg font-semibold">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : destination ? (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Image and Thumbnails */}
            <div className="relative">
              <img
                src={activePhoto}
                alt={destination.name}
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
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                ← Go Back
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Destination not found.</p>
        )}
      </section>
    </>
  );
}
