import { User, Users, Smile } from "lucide-react";
import COLORS from "../../styles/theme";
import Navbar from "../../components/user/home/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllGuidesOnUserThunk } from "../../redux/user/userThunks";

type Guide = {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers: number;
  happyCustomers: number;
  basedOn: string
};

export default function GuideListing() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("")

  const fetchGuides = async () => {
    setLoading(true);
    try {
    const response = await dispatch(getAllGuidesOnUserThunk(page, limit, search, category));
      setGuides(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setCategory(response.category);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    else fetchGuides();
  }, [isAuthenticated, navigate, page, search]);

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

        {/* Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search guides by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-1/2 px-4 py-2 rounded border border-gray-300"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-[#9B8759] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : guides.length === 0 ? (
          <h2 className="text-2xl text-center font-bold text-[#797979]">
            No guides found matching your search.
          </h2>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <div
                  key={guide._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md border p-6"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.cardBg,
                  }}
                >
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
                      <p className="text-sm" style={{ color: COLORS.secondaryText }}>
                        Based On: {guide.basedOn}
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
                  <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
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
                    className="w-full mt-4 py-2 rounded-md font-medium text-white transition-colors"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
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