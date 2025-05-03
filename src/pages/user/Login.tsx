import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import COLORS from "../../styles/theme";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { clearError } from "../../redux/user/userSlice";
import { handleLogin } from "../../redux/user/authThunks";




export default function LoginPage() {

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    };
  }, [ isAuthenticated, navigate]);

  //clear errors on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(handleLogin(formData))
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }} className="flex w-full items-center justify-center p-4">
      <div style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="w-full max-w-md overflow-hidden rounded-lg shadow-xl border">
        <div style={{ backgroundColor: COLORS.accent }} className="p-6 text-center">
          <h1 style={{ color: COLORS.cardBg }} className="mt-2 text-3xl font-bold">Celoura Travels</h1>
          <p style={{ color: COLORS.inputBg }} className="mt-1">Your journey begins here</p>
        </div>

        <div className="p-6">
          <h2 style={{ color: COLORS.text }} className="mb-6 text-center text-2xl font-semibold">Welcome Back</h2>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <div className="relative">
                <Mail style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Lock style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
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
                  Log In <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: COLORS.secondaryText }}>Don't have an account?</p>
            <a style={{ color: COLORS.accent }} className="cursor-pointer font-medium hover:underline" onClick={() => navigate('/signup')}>
              Sign up now
            </a>
          </div>
        </div>
      </div>
    </div>
  );

}