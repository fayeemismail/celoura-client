import { MapPin, Heart } from "lucide-react";
import COLORS from "../../styles/theme";
import Navbar from "../../components/user/home/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPaginatedDestiUser } from "../../redux/user/userThunks";
import { useDebounce } from "../../hooks/useDebounce";

type Destination = {
  _id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  photos: string[];
  features?: string[];
};

export default function UserDestinations() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebounce(search, 400)
  
  const getDestinations = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAllPaginatedDestiUser(page, limit, debouncedSearch, category)
      );
      setDestinations(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    else getDestinations();
  }, [isAuthenticated, navigate, page, debouncedSearch, category]);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
        {/* Search & Category filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-1/2 px-4 py-2 rounded border border-gray-300"
          />

          <div className="relative inline-block w-64">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full appearance-none px-4 py-2 pr-10 rounded border border-gray-300"
            >
              <option value="">All Categories</option>
              <option value="Historical">Historical</option>
              <option value="Adventure">Adventure</option>
              <option value="Camping">Camping</option>
              <option value="Spiritual">Spiritual</option>
              <option value="Beaches">Beaches</option>
              <option value="Religious">Religious</option>
              <option value="Architecture">Architecture</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-2 w-2 rotate-45 border-r-2 border-b-2 border-gray-500" />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-[#9B8759] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : destinations.length === 0 ? (
          <h2 className="text-2xl text-center font-bold text-[#797979]">
            No destinations found.
          </h2>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md border"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.cardBg,
                  }}
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      loading="lazy"
                      width="100%"
                      height="224"
                      className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between h-[280px]">
                    <div className="mb-3">
                      <h3 style={{ color: COLORS.text }} className="text-xl font-semibold mb-1">
                        {item.name}
                      </h3>
                      <p style={{ color: COLORS.secondaryText }} className="text-sm mb-2">
                        {item.location} - {item.country}
                      </p>
                      <p style={{ color: COLORS.secondaryText }} className="text-sm">
                        {item.description.length > 100
                          ? item.description.slice(0, 150) + "..."
                          : item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.features?.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ color: COLORS.accent, backgroundColor: "#f0f0f0" }}
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/destination/${item._id}`)}
                        style={{ color: COLORS.accent }}
                        className="flex items-center text-sm font-medium hover:underline"
                      >
                        <MapPin className="mr-1 h-4 w-4" /> View Details
                      </button>
                      <button
                        className="hover:scale-110 transition-transform"
                        style={{ color: COLORS.secondaryText }}
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-4 py-2 rounded ${page === num
                        ? "bg-[#9B8759] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
