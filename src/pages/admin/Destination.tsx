import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { deleteDestinationThunk, getAllPaginatedDesti } from "../../redux/admin/authThunks";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../components/common/ConfirmationDialog"; // 👈 import your component

export default function DestinationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [AttractionFilter, setAttractionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false); // 👈 modal visibility
  const [selectedId, setSelectedId] = useState<string | null>(null); // 👈 destination to delete

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteDestination = async (destinationId: string) => {
    try {
      // 🔥 Replace with actual delete logic (API call);
      const response = await dispatch(deleteDestinationThunk(destinationId));
      console.log("Deleting destination:", response);
      toast.success("Deleted successfully");
      setShowConfirm(false);
      getDestinations(); // Refresh list after deletion
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const getDestinations = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAllPaginatedDesti(page, limit, search, AttractionFilter)
      );
      setDestinations(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else {
      getDestinations();
    }
  }, [isAuthenticated, navigate, page, search, AttractionFilter]);

  return (
    <div className="flex min-h-screen text-white bg-[rgb(8,16,40)]">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`flex-1 transition-all duration-300 min-w-0 ${
          sidebarOpen ? "pl-64" : "pl-20"
        }`}
      >
        <AdminHeader />
        <div className="p-8 max-w-7xl mx-auto">
          {/* Heading and Create Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-wide">🌍 Destinations</h2>
            <button
              onClick={() => navigate("/admin/create-destinations")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-5 py-2 rounded-xl font-medium text-white shadow-md transition-all duration-200"
            >
              + Create Destination
            </button>
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
                value={AttractionFilter}
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

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-lg border border-gray-700 rounded-lg bg-[#1a1f2e]">
              No destinations available. Add one to get started.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination: any) => (
                <div
                  key={destination._id}
                  className="relative bg-[#1f273b] rounded-xl overflow-hidden shadow-md border border-[#2c354d] transform transition duration-300 hover:scale-[1.02] flex flex-col"
                >
                  {destination.photos?.[0] ? (
                    <img
                      src={destination.photos[0]}
                      alt={destination.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-700 flex items-center justify-center text-gray-300 text-sm">
                      No Image
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold mb-1">{destination.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {destination.location} — {destination.country}
                      </p>
                      {destination.description && (
                        <p className="text-sm text-gray-300 mb-3 line-clamp-4">
                          {destination.description.length > 120
                            ? destination.description.slice(0, 120) + "..."
                            : destination.description}
                        </p>
                      )}
                    </div>

                    {destination.features?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {destination.features.slice(0, 3).map((feat: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-100"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-destination/${destination._id}`)
                        }
                        className="flex items-center gap-1 text-sm border border-[#e2e6f2] text-[#fff] hover:bg-[#95909c] hover:text-white px-3 py-1 rounded-full transition"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(destination._id); // set ID
                          setShowConfirm(true); // open modal
                        }}
                        className="flex items-center gap-1 text-sm border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && destinations.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8 flex-wrap gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
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
        </div>
      </main>

      {/* 🔥 Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this destination? This action cannot be undone."
        color="#e11d48" // Tailwind red-600
        onConfirm={() => {
          if (selectedId) handleDeleteDestination(selectedId);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
