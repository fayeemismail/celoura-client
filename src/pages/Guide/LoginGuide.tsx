import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { clearError } from "../../redux/user/userSlice";
import { handleGuideLogin } from "../../redux/guide/authThunks";
import { GUIDE_COLORS } from "../../styles/theme";
// import { handleGuideLogin } from "../../redux/guide/authThunks";

// Define color constants

export default function GuideLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.guide);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/guide/home');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(handleGuideLogin(formData));
  };

  return (
    <div style={{ backgroundColor: GUIDE_COLORS.bg, minHeight: "100vh" }} className="flex w-full items-center justify-center p-4">
      <div style={{ backgroundColor: GUIDE_COLORS.cardBg, borderColor: GUIDE_COLORS.border }} className="w-full max-w-md overflow-hidden rounded-lg shadow-xl border">
        <div style={{ backgroundColor: GUIDE_COLORS.accent }} className="p-6 text-center">
          <h1 style={{ color: GUIDE_COLORS.cardBg }} className="mt-2 text-3xl font-bold">Celoura Travels</h1>
          <p style={{ color: GUIDE_COLORS.inputBg }} className="mt-1">Guide Portal</p>
        </div>

        <div className="p-6">
          <h2 style={{ color: GUIDE_COLORS.text }} className="mb-6 text-center text-2xl font-semibold">Guide Login</h2>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <div className="relative">
                <Mail style={{ color: GUIDE_COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ backgroundColor: GUIDE_COLORS.inputBg, borderColor: GUIDE_COLORS.border, color: GUIDE_COLORS.text }}
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-green-400"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Lock style={{ color: GUIDE_COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ backgroundColor: GUIDE_COLORS.inputBg, borderColor: GUIDE_COLORS.border, color: GUIDE_COLORS.text }}
                  className="w-full rounded-lg border p-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-green-400"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff style={{ color: GUIDE_COLORS.secondaryText }} className="h-5 w-5" />
                  ) : (
                    <Eye style={{ color: GUIDE_COLORS.secondaryText }} className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: GUIDE_COLORS.accent, color: GUIDE_COLORS.bg }}
              className="flex w-full items-center justify-center rounded-lg py-3 font-medium transition-colors duration-300 hover:opacity-90"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center">
                  Guide Login <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {/* <p style={{ color: GUIDE_COLORS.secondaryText }}>Trouble logging in?</p>
            <a style={{ color: GUIDE_COLORS.accent }} className="cursor-pointer font-medium hover:underline" onClick={() => navigate('/guide/forgot-password')}>
              Reset password
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}