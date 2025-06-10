import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { handleGuideLogin } from "../../redux/guide/authThunks";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { guideGoogleLogin } from "../../api/auth";
import { clearError, setGuide } from "../../redux/guide/guideSlice";

type inputPropsType = {
  display: boolean;
  content: string;
};

interface GoogleJwtPaload {
  email: string;
  name: string
}

export default function GuideLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.guide);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [userLoginValidationError, setUserLoginValidationError] =
    useState<inputPropsType>({ display: false, content: "" });

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

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if(credentialResponse.credential) {
        const userData: GoogleJwtPaload = jwtDecode(
          credentialResponse.credential
        );
        const response = await guideGoogleLogin( userData.email, userData.name );

        if(response.status == 200) {
          const userData = {
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            role: response.data.data.role,
          };

          dispatch(setGuide(userData));
        } else {
          const message = response.data?.message;
          setUserLoginValidationError({
            display: true,
            content: 
              message === 'Your Account is Blocked' 
                ? "Your Acount has been Blocked!! Please contact customer service for further details"
                  : message == 'User not exists'
                    ? 'User not Exists..! Plase Sign up'
                      : message == 'Access denied' 
                        ? "Access Denied!!!"
                          : message,
          });
        };
      };
    } catch (error) {
      console.log(error);
      handleGoogleError()
    }
  }

  const handleGoogleError = () => {
    console.log('Google Guide Login Failed')
  }

  return (
  <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#ff]">
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl">
      <div className="p-6 text-center bg-green-600">
        <h1 className="mt-2 text-3xl font-bold text-white">Celoura Travels</h1>
        <p className="mt-1 text-green-100">Guide Portal</p>
      </div>

      <div className="p-6">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Welcome Back</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-red-700">{error}</div>
        )}

        {userLoginValidationError.display && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-red-700" aria-live="assertive">
            {userLoginValidationError.content}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 pl-10 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-[#21954c] py-3 font-medium text-white transition-colors duration-300 hover:opacity-90"
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

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="100%"
              logo_alignment="left"
              ux_mode="popup"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          {/* <p className="text-gray-500">Trouble logging in?</p>
          <a
            className="cursor-pointer font-medium text-green-600 hover:underline"
            onClick={() => navigate('/guide/forgot-password')}
          >
            Reset password
          </a> */}
        </div>
      </div>
    </div>
  </div>
);

}