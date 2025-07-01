import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import { getPaginatedDestinationGuideThunk } from "../../redux/guide/authThunks";

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [attractionFilter, setAttractionFilter] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getPaginatedDestinationGuideThunk(page, limit, search, attractionFilter)
      );
      setDestinations(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching destinations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [page, search, attractionFilter]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex bg-[#000] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <GuideNavbar />
        <main className="pt-24 px-8 pb-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">All Destinations</h1>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-1/2 px-4 py-2 rounded bg-[#1a1f2e] border border-gray-600 text-white"
            />

            <div className="relative inline-block w-64">
              <select
                value={attractionFilter}
                onChange={(e) => {
                  setAttractionFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none px-4 py-2 pr-10 rounded bg-[#1a1f2e] border border-gray-600 text-white"
              >
                <option value="">All Attractions</option>
                <option value="Historical">Historical</option>
                <option value="Adventure">Adventure</option>
                <option value="Camping">Camping</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Beaches">Beaches</option>
                <option value="Religious">Religious</option>
                <option value="Architecture">Architecture</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-2 w-2 rotate-45 border-r-2 border-b-2 border-white"></div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : destinations.length > 0 ? (
            <>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 flex-wrap gap-2">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-4 py-2 rounded ${
                          page === pageNumber
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400 mt-10">No destinations found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuideDestinations;
