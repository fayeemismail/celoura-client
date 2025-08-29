import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import COLORS from "../../styles/theme";
import { Mail, KeyRound, Lock, RotateCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { 
    changeForgotPasswordThunk,
  forgotPassVerifyOtp, 
  forgotPasswordRequest, 
  resentForgotPasswordOtpThunk 
} from "../../redux/user/authThunks";

// Custom hook for timer functionality
const useTimer = (initialTime: number, onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const start = (time?: number) => {
    setTimeLeft(time || initialTime);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = (time?: number) => {
    setTimeLeft(time || initialTime);
    setIsActive(false);
  };

  return { timeLeft, isActive, start, stop, reset };
};

// Component for OTP input with timer
const OtpStep = ({ 
  email, 
  onVerify, 
  onResend, 
  loading 
}: { 
  email: string; 
  onVerify: (otp: string) => void; 
  onResend: (email: string) => void; 
  loading: boolean; 
}) => {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleTimerComplete = () => {
    // Timer completed, can resend now
  };

  const { timeLeft, isActive, start } = useTimer(90, handleTimerComplete);

  useEffect(() => {
    start();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  const handleResendOtp = async () => {
    if (isActive) return;
    
    setResendLoading(true);
    try {
      await onResend(email);
      start(); // Restart the timer
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <KeyRound
            style={{ color: COLORS.secondaryText }}
            className="absolute left-3 top-3 h-5 w-5"
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter OTP"
            style={{
              backgroundColor: COLORS.inputBg,
              borderColor: COLORS.border,
              color: COLORS.text,
            }}
            className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
          className="w-full rounded-lg py-3 font-medium transition-colors duration-300 hover:opacity-90"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      
      <div className="mt-4 flex items-center justify-center">
        {isActive ? (
          <p className="text-sm" style={{ color: COLORS.secondaryText }}>
            Resend OTP in {formatTime(timeLeft)}
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="flex items-center text-sm font-medium"
            style={{ color: COLORS.accent }}
          >
            <RotateCw className={`mr-1 h-4 w-4 ${resendLoading ? 'animate-spin' : ''}`} />
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </>
  );
};

// Main ForgotPassword component
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get email and step from URL params if available
  const urlEmail = searchParams.get('email') || '';
  const urlStep = parseInt(searchParams.get('step') || '1') as 1 | 2 | 3;
  
  const [step, setStep] = useState<1 | 2 | 3>(urlStep);
  const [email, setEmail] = useState(urlEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Update URL params when email or step changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    if (step > 1) params.set('step', step.toString());
    
    // Replace current URL with updated params
    setSearchParams(params, { replace: true });
  }, [email, step, setSearchParams]);

  // Password validation
  const isPasswordValid = (pwd: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      setLoading(true);
      const response = await dispatch(forgotPasswordRequest(email));
      if (response.status === 200) {
        setMessage("OTP sent to your email.");
        setStep(2);
      } else {
        setError(response.data?.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setMessage(null);
    setError(null);
    try {
      setLoading(true);
      const response = await dispatch(forgotPassVerifyOtp(email, otp));
      console.log(response);
      if (response.status === 200) {
        setMessage("OTP verified successfully.");
        setStep(3);
      } else {
        setError(response.data?.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async (email: string) => {
    setMessage(null);
    setError(null);
    try {
      const response = await dispatch(resentForgotPasswordOtpThunk(email));
      console.log(response);
      if (response.status === 200) {
        setMessage("New OTP sent to your email.");
      } else {
        setError(response.data?.message || "Failed to resend OTP.");
        throw new Error("Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP.");
      throw err;
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setError(
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long."
      );
      return;
    }

    try {
      setLoading(true);
      // Implement password reset API call
      const response = await dispatch(changeForgotPasswordThunk(email, newPassword));
      if (response.status === 200) {
        setMessage("Password reset successful. Redirecting to login...");
        // Clear URL params on success
        setSearchParams({}, { replace: true });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.data?.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  // Clean up URL params when navigating away
  const handleBackToLogin = () => {
    setSearchParams({}, { replace: true });
    navigate("/login");
  };

  return (
    <div
      style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }}
      className="flex w-full items-center justify-center p-4"
    >
      <div
        style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
        className="w-full max-w-md overflow-hidden rounded-lg shadow-xl border"
      >
        <div
          style={{ backgroundColor: COLORS.accent }}
          className="p-6 text-center"
        >
          <h1
            style={{ color: COLORS.cardBg }}
            className="mt-2 text-3xl font-bold"
          >
            Forgot Password
          </h1>
          <p style={{ color: COLORS.inputBg }} className="mt-1">
            {step === 1
              ? "Enter your email"
              : step === 2
              ? "Enter OTP"
              : "Set New Password"}
          </p>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4 relative">
                <Mail
                  style={{ color: COLORS.secondaryText }}
                  className="absolute left-3 top-3 h-5 w-5"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: COLORS.inputBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
                className="w-full rounded-lg py-3 font-medium transition-colors duration-300 hover:opacity-90"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <OtpStep 
              email={email}
              onVerify={handleOtpVerify}
              onResend={handleOtpResend}
              loading={loading}
            />
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4 relative">
                <Lock
                  style={{ color: COLORS.secondaryText }}
                  className="absolute left-3 top-3 h-5 w-5"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New Password"
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: COLORS.inputBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                />
              </div>
              <div className="mb-4 relative">
                <Lock
                  style={{ color: COLORS.secondaryText }}
                  className="absolute left-3 top-3 h-5 w-5"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: COLORS.inputBg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
                className="w-full rounded-lg py-3 font-medium transition-colors duration-300 hover:opacity-90"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a
              onClick={handleBackToLogin}
              className="cursor-pointer font-medium hover:underline"
              style={{ color: COLORS.accent }}
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}