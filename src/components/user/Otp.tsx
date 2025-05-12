import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import axios from "axios";
import { API_BASE_URL } from "../../config/constants";
import { clearError } from "../../redux/user/userSlice";
import COLORS from "../../styles/theme";

export default function Otp() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const dispatch = useDispatch<AppDispatch>();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setErrors] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(90); // 1.5 minutes (90 seconds)

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerify = async () => {
        if (timeLeft <= 0) {
            setErrors("OTP expired. Please resend.");
            return;
        }

        setLoading(true);
        setErrors('');
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
            navigate('/login');
        } catch (error: any) {
            console.log(error.response?.data?.message);
            setErrors(error.response?.data?.message || 'Check your OTP');
        } finally {
            setLoading(false);
            dispatch(clearError());
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setErrors('');
        try {
            await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
            setTimeLeft(90); // Reset timer
        } catch (error: any) {
            console.log(error.response?.data?.message);
            setErrors(error.response?.data?.message);
        } finally {
            setLoading(false);
            dispatch(clearError());
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div style={{ backgroundColor: COLORS.bg }} className="min-h-screen flex items-center justify-center p-4">
            <div style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="w-full max-w-md p-6 rounded-lg border shadow-xl">
                <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
                <p style={{ color: COLORS.secondaryText }} className="text-center">An OTP has been sent to <span className="font-medium">{email}</span></p>
                <p style={{ color: COLORS.secondaryText }} className="text-center mb-4">If you didn't get any, please check your spam.</p>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 mb-4 rounded-lg border focus:outline-none"
                    style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                />

                {timeLeft > 0 ? (
                    <p className="text-center text-sm mb-2" style={{ color: COLORS.secondaryText }}>
                        OTP expires in <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span>
                    </p>
                ) : (
                    <p className="text-center text-sm mb-2 text-red-500 font-semibold">
                        OTP expired. Please resend.
                    </p>
                )}

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    onClick={handleVerify}
                    disabled={loading || timeLeft <= 0}
                    style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
                    className="w-full py-3 rounded-lg font-medium hover:opacity-90 transition"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <p className="mt-4 text-center text-sm" style={{ color: COLORS.secondaryText }}>
                    Didn't receive the OTP?{" "}
                    <button onClick={handleResendOtp} className="text-blue-500 hover:underline">Resend</button>
                </p>
            </div>
        </div>
    );
}
