import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import COLORS from "../../styles/theme";
import { ArrowRight, Lock, Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { clearError, signInFailure } from "../../../redux/user/userSlice";
import { API_BASE_URL } from "../../../infrastructure/config/constants";
import axios from "axios";



export default function Signup() {

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user)
    const [ formData, setFormData ] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    //redirect if authenticated
    useEffect(() => {
        if ( isAuthenticated ){
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    //clrar errors
    useEffect(() => {
        return () => {
            dispatch(clearError());
        }
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate formData
    const validateForm = () => {
      let errors: { [key: string]: string } = {};
    
      if (!formData.name) {
        errors.name = 'Name is required.';
      } else if (formData.name.length < 3) {
        errors.name = 'Name must be at least 3 characters.';
      }
    
      if (!formData.email) {
        errors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email address is invalid.';
      }
    
      if (!formData.password) {
        errors.password = "Password is required.";
      } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
        errors.password = "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character.";
      }
      
    
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords Doesn't match.";
      }
    
      setFormErrors(errors);
    
      return Object.keys(errors).length === 0;
    }

    const handleSignup = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()

      try {
        const isValid = validateForm();
        if (!isValid) return; // Stop if not valid

        // Continue signup process
        await axios.post(`${API_BASE_URL}/auth/signup`, formData);
        navigate(`/verify-otp?email=${formData.email}`)
        
      } catch (error: any) {
        console.log(error.response?.data?.error);
        dispatch(signInFailure(error.response?.data?.error || 'Registration failed'))
      }
      
    };

    return (
      <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }} className="flex w-full items-center justify-center p-4">
          <div style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="w-full max-w-md overflow-hidden rounded-lg shadow-xl border">
              <div style={{ backgroundColor: COLORS.accent }} className="p-6 text-center">
                  <h1 style={{ color: COLORS.cardBg }} className="mt-2 text-3xl font-bold">Travel Guide</h1>
                  <p style={{ color: COLORS.inputBg }} className="mt-1">Your journey begins here</p>
              </div>

              <div className="p-6">
                  <h2 style={{ color: COLORS.text }} className="mb-6 text-center text-2xl font-semibold">Create Account</h2>
                  {error && <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{error}</div>}

                  {/* Name Field */}
                  <div className="mb-4">
                      <div className="relative">
                          <UserPlus style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                          <input
                              type="text"
                              name="name"
                              placeholder="Full Name"
                              value={formData.name}
                              onChange={handleInputChange}
                              style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                              className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                          />
                      </div>
                      {formErrors.name && <div className="text-red-500">{formErrors.name}</div>}
                  </div>

                  {/* Email Field */}
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
                          />
                      </div>
                      {formErrors.email && <div className="text-red-500">{formErrors.email}</div>}
                  </div>

                  {/* Password Field */}
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
                          />
                      </div>
                      {formErrors.password && <div className="text-red-500">{formErrors.password}</div>}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                      <div className="relative">
                          <Lock style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                          <input
                              type="password"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                              className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                          />
                      </div>
                      {formErrors.confirmPassword && <div className="text-red-500">{formErrors.confirmPassword}</div>}
                  </div>

                  {/* Submit Button */}
                  <button
                      onClick={handleSignup}
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
                              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                      )}
                  </button>

                  <div className="mt-6 text-center">
                      <p style={{ color: COLORS.secondaryText }}>Already have an account?</p>
                      <a style={{ color: COLORS.accent }} className="cursor-pointer font-medium hover:underline" onClick={() => navigate('/login')}>
                          Log in now
                      </a>
                  </div>
              </div>
          </div>
      </div>
  );

}