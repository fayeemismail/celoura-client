import { User, Users, Smile, Search } from "lucide-react";
import COLORS from "../../styles/theme";
import Navbar from "../../components/user/home/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllGuidesOnUserThunk } from "../../redux/user/userThunks";
import { useDebounce } from "../../hooks/useDebounce";

type Guide = {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers: number;
  happyCustomers: number;
  basedOn: string;
};

const categories = [
  { value: "", label: "All Categories" },
  { value: "Adventure", label: "Adventure" },
  { value: "Historical Tours", label: "Historical Tours" },
  { value: "City", label: "City Tours" },
  { value: "Nature", label: "Nature" },
  { value: "Food Tours", label: "Food Tours" },
];

export default function GuideListing() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAllGuidesOnUserThunk(page, limit, debouncedSearch, category)
      );
      setGuides(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    else fetchGuides();
  }, [isAuthenticated, navigate, page, debouncedSearch, category]);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>
            Available Guides
          </h1>
          <p className="mt-2" style={{ color: COLORS.secondaryText }}>
            Connect with professional guides for your travels
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: COLORS.secondaryText }} />
              </div>
              <input
                type="text"
                placeholder="Search guides by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.cardBg,
                  color: COLORS.text,
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.cardBg,
                  color: COLORS.text,
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin"
              style={{
                borderColor: COLORS.accent,
                borderTopColor: 'transparent',
              }}
            />
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
              No guides found
            </h2>
            <p className="mt-2" style={{ color: COLORS.secondaryText }}>
              {search || category
                ? "Try adjusting your search or filter criteria"
                : "There are currently no guides available"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <div
                  key={guide._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md border hover:shadow-lg transition-shadow duration-300"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.cardBg,
                  }}
                >
                  <div className="p-6">
                    {/* Guide Profile Header */}
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        {guide.profilePic ? (
                          <img
                            src={guide.profilePic}
                            alt={guide.name}
                            className="w-16 h-16 rounded-full object-cover border-2"
                            style={{ borderColor: COLORS.accent }}
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: COLORS.accent + '20' }}
                          >
                            <User className="h-8 w-8" style={{ color: COLORS.accent }} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: COLORS.text }}
                        >
                          {guide.name}
                        </h3>
                        <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                          {guide.email}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: COLORS.accent + '20',
                              color: COLORS.accent
                            }}
                          >
                            {guide.basedOn}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    {guide.bio && (
                      <p
                        className="mb-4 text-sm"
                        style={{ color: COLORS.secondaryText }}
                      >
                        {guide.bio.length > 120
                          ? guide.bio.slice(0, 120) + "..."
                          : guide.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t"
                      style={{ borderColor: COLORS.border + '50' }}
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" style={{ color: COLORS.accent }} />
                        <span className="text-sm" style={{ color: COLORS.secondaryText }}>
                          {guide.followers} followers
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Smile className="h-4 w-4 mr-1" style={{ color: COLORS.accent }} />
                        <span className="text-sm" style={{ color: COLORS.secondaryText }}>
                          {guide.happyCustomers} happy customers
                        </span>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <button
                      onClick={() => navigate(`/guide-profile/${guide._id}`)}
                      className="w-full mt-4 py-2 rounded-md font-medium text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: COLORS.accent }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: COLORS.cardBg,
                      color: COLORS.text,
                      borderColor: COLORS.border,
                    }}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${page === pageNum
                            ? "font-bold"
                            : "font-medium"
                          }`}
                        style={{
                          backgroundColor:
                            page === pageNum ? COLORS.accent : COLORS.cardBg,
                          color: page === pageNum ? "white" : COLORS.text,
                          borderColor: COLORS.border,
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: COLORS.cardBg,
                      color: COLORS.text,
                      borderColor: COLORS.border,
                    }}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}