import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { fetchAllBookingsThunk } from "../../redux/admin/authThunks";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";

export default function BookingsOnAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getBookings = async () => {
    setLoading(true);
    try {
      const response = await dispatch(fetchAllBookingsThunk(page, limit));
      setBookings(response.data || []);
      setTotalPages(Math.ceil(response.total / limit) || 1);
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
      getBookings();
    }
  }, [isAuthenticated, navigate, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20";
      case "pending":
        return "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20";
      case "cancelled":
        return "bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20";
      default:
        return "bg-slate-400/10 text-slate-400 ring-1 ring-slate-400/20";
    }
  };

  const getPaymentBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20";
      case "pending":
        return "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20";
      case "failed":
        return "bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20";
      default:
        return "bg-slate-400/10 text-slate-400 ring-1 ring-slate-400/20";
    }
  };

  // Filter bookings based on search and status filter
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guide?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.locations?.some((location: string) => 
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`flex-1 transition-all duration-300 min-w-0 ${
          sidebarOpen ? "lg:pl-72 pl-20" : "pl-20"
        }`}
      >
        <AdminHeader />
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header with search and filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Bookings Management
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select 
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-colors"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg">
                <div className="text-slate-400 text-sm">Total Bookings</div>
                <div className="text-2xl font-bold mt-1">{bookings.length}</div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2"></div>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg">
                <div className="text-slate-400 text-sm">Confirmed</div>
                <div className="text-2xl font-bold mt-1">
                  {bookings.filter((b: any) => b.status === 'confirmed').length}
                </div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2"></div>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg">
                <div className="text-slate-400 text-sm">Pending Payment</div>
                <div className="text-2xl font-bold mt-1">
                  {bookings.filter((b: any) => b.paymentStatus === 'pending').length}
                </div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-400/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full border-t-emerald-400 animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-400">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-lg rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <svg className="mx-auto h-12 w-12 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              No bookings found.
              {searchTerm || statusFilter !== "all" ? " Try adjusting your filters." : ""}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700/50">
                  <thead className="bg-slate-700/20">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        User & Guide
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Trip Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredBookings.map((booking: any) => (
                      <tr key={booking._id} className="hover:bg-slate-700/10 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-200">User</div>
                              <div className="text-sm">{booking.user?.name}</div>
                              <div className="text-xs text-slate-400">{booking.user?.email}</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-200">Guide</div>
                              <div className="text-sm">{booking.guide?.name || "N/A"}</div>
                              <div className="text-xs text-slate-400">{booking.guide?.email || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <div>
                              <div className="text-sm font-semibold text-slate-200">Dates</div>
                              <div className="text-sm">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-200">Duration</div>
                              <div className="text-sm">{booking.durationInDays} days</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-200">Locations</div>
                              <div className="text-sm text-ellipsis overflow-hidden max-w-xs">{booking.locations?.join(", ")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <div>
                              <div className="text-xs font-semibold text-slate-400 mb-1">Booking Status</div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-400 mb-1">Payment Status</div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg transition-colors">
                              View Details
                            </button>
                            <button className="text-xs bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-lg transition-colors">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && bookings.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8 flex-wrap gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 enabled:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show limited page numbers with ellipsis for many pages
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        page === pageNumber
                          ? "bg-emerald-400/20 border-emerald-400/30 text-emerald-400 shadow-lg shadow-emerald-400/10"
                          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return <span key={pageNumber} className="px-2 py-2 text-slate-500">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 enabled:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}