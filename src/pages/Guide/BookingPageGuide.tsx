import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import { fetchBookingsOnGuideThunk } from "../../redux/guide/authThunks";
import { useDebounce } from "../../hooks/useDebounce";

type Booking = {
  _id: string;
  budget: string;
  durationInDays: string;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  guideAccepted: boolean;
  locations: string[];
  specialRequests: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
};

const GuideBookings = () => {
  const { isAuthenticated, currentGuide } = useSelector(
    (state: RootState) => state.guide
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearch = useDebounce(search, 300);

  const getBookings = async () => {
    setLoading(true);
    try {
      const result = await dispatch(
        fetchBookingsOnGuideThunk(
          currentGuide?.id!,
          page,
          limit,
          debouncedSearch,
          statusFilter == "all" ? "" : statusFilter
        )
      );
      if (result && result.data) {
        setBookings(result.data);
        setTotalBookings(result.total);
        setTotalPages(Math.ceil(result.total / limit));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/guide/login");
    if (currentGuide?.id) {
      getBookings();
    }
  }, [isAuthenticated, currentGuide, page, debouncedSearch, statusFilter]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <GuideNavbar />
        <main className="pt-24 px-8 pb-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              My Bookings
            </h1>
            <div className="text-sm text-gray-400">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalBookings)} of {totalBookings} bookings
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <input
              type="text"
              placeholder="🔍 Search by client name or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page when searching
              }}
              className="w-full sm:w-1/2 px-4 py-2 rounded-xl bg-[#1a1f2e]/70 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />

            <div className="relative inline-block w-64">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1); // Reset to first page when filtering
                }}
                className="w-full appearance-none px-4 py-2 pr-10 rounded-xl bg-[#1a1f2e]/70 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-2 w-2 rotate-45 border-r-2 border-b-2 border-gray-400"></div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 mb-10">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 p-6 backdrop-blur-md"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                          <h2 className="text-2xl font-bold tracking-tight">
                            {booking.user.name}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )} shadow-sm`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                          {!booking.guideAccepted && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-md">
                              Action Required
                            </span>
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                          <div className="p-3 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                            <p className="text-xs uppercase text-gray-400 tracking-wide">
                              Duration
                            </p>
                            <p className="text-lg font-semibold">
                              {booking.durationInDays} days
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                            <p className="text-xs uppercase text-gray-400 tracking-wide">
                              Budget
                            </p>
                            <p className="text-lg font-semibold">
                              ${booking.budget}
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                            <p className="text-xs uppercase text-gray-400 tracking-wide">
                              Dates
                            </p>
                            <p className="text-lg font-semibold">
                              {formatDate(booking.startDate)} →{" "}
                              {formatDate(booking.endDate)}
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                            <p className="text-xs uppercase text-gray-400 tracking-wide">
                              Contact
                            </p>
                            <p className="text-lg font-semibold">
                              {booking.user.phone}
                            </p>
                          </div>
                        </div>

                        {/* Locations */}
                        <div className="mb-6">
                          <p className="text-xs uppercase text-gray-400 tracking-wide">
                            Locations
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {booking.locations.map((location, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-sm border border-indigo-600/40"
                              >
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                          <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                            <p className="text-xs uppercase text-gray-400 tracking-wide">
                              Special Requests
                            </p>
                            <p className="text-base mt-2">
                              {booking.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Content (Actions) */}
                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                          onClick={() =>
                            navigate(`/guide/booking/${booking._id}`)
                          }
                          className="px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all shadow-md"
                        >
                          View Details
                        </button>
                        {booking.status === "pending" &&
                          !booking.guideAccepted && (
                            <button className="px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all shadow-md">
                              Accept Booking
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      page === 1
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-[#1a1f2e] text-white hover:bg-indigo-600 transition-colors"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          page === pageNum
                            ? "bg-indigo-600 text-white"
                            : "bg-[#1a1f2e] text-white hover:bg-indigo-600 transition-colors"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      page === totalPages
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-[#1a1f2e] text-white hover:bg-indigo-600 transition-colors"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400 mt-10">
              No bookings found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuideBookings;