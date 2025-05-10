import { ArrowRight, Lock, Mail } from "lucide-react";
import { ADMIN_COLORS } from "../../styles/theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { handleAdminLogin } from "../../redux/admin/authThunks";
import { useNavigate } from "react-router-dom";
import { clearError } from "../../redux/user/userSlice";



export default function AdminLogin() {

  const [ formData, setFormData ] = useState({ email: '', password: '' });
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) {
      navigate('/admin/home');
    }
  }, [isAuthenticated, navigate]);

  //clearing the error after the component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    dispatch(handleAdminLogin(formData));
  }

    return (
        <div style={{ backgroundColor: ADMIN_COLORS.bg, minHeight: "100vh" }} className="flex w-full items-center justify-center p-4">
          <div style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }} className="w-full max-w-md overflow-hidden rounded-lg shadow-xl border">
            <div style={{ backgroundColor: ADMIN_COLORS.accent }} className="p-6 text-center">
              <h1 style={{ color: ADMIN_COLORS.cardBg }} className="mt-2 text-3xl font-bold">Celoura Travels</h1>
              <p style={{ color: ADMIN_COLORS.inputBg }} className="mt-1">Your journey begins here</p>
            </div>
    
            <div className="p-6">
              <h2 style={{ color: ADMIN_COLORS.text }} className="mb-6 text-center text-2xl font-semibold">Welcome Back</h2>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{error}</div>}
    
              <form  onSubmit={onSubmit} >
                <div className="mb-4">
                  <div className="relative">
                    <Mail style={{ color: ADMIN_COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ backgroundColor: ADMIN_COLORS.inputBg, borderColor: ADMIN_COLORS.border, color: ADMIN_COLORS.text }}
                      className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                      required
                    />
                  </div>
                </div>
    
                <div className="mb-4">
                  <div className="relative">
                    <Lock style={{ color: ADMIN_COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      style={{ backgroundColor: ADMIN_COLORS.inputBg, borderColor: ADMIN_COLORS.border, color: ADMIN_COLORS.text }}
                      className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                      required
                    />
                  </div>
                </div>
    
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: ADMIN_COLORS.accent, color: ADMIN_COLORS.cardBg }}
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
    
              
            </div>
          </div>
        </div>
      );

}