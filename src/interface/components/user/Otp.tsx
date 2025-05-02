import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";
import axios from "axios";
import { API_BASE_URL } from "../../../infrastructure/config/constants";
import { clearError } from "../../../redux/user/userSlice";
import COLORS from "../../styles/theme";


export default function Otp() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const dispatch = useDispatch<AppDispatch>();

    const [ otp, setOtp ] = useState('');
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setErrors ] = useState<string>('');
    // const { error } = useSelector((state: RootState) => state.user);

    const handleVerify = async () => {
        setLoading(true);
        setErrors('')
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email , otp });
            console.log(response.data, 'This is response for otp');
            navigate('/login');
        } catch (error: any) {
            console.log(error.response?.data?.message);
            setErrors(error.response?.data?.message || 'Check your OTP');
        } finally {
            setLoading(false)
            dispatch(clearError())
        }
    }

    const handleResendOtp = async () => {
        try {
            console.log('ehy')
            const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
            console.log(response)
        } catch (error: any) {
            console.log(error);
            // setErrors(error)
        } finally {
            setLoading(false);
            dispatch(clearError());
        }
    }

    return ( 
        <div style={{ backgroundColor: COLORS.bg }} className="min-h-screen flex items-center justify-center p-4">
        <div style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="w-full max-w-md p-6 rounded-lg border shadow-xl">
            <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
            <p style={{ color: COLORS.secondaryText }} className="text-center mb-4">An OTP has been sent to <span className="font-medium">{email}</span></p>
            
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mb-4 rounded-lg border focus:outline-none"
                style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
                onClick={handleVerify}
                disabled={loading}
                style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
                className="w-full py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
                {loading ? "Verifying..." : "Verify"}
            </button>

            <p className="mt-4 text-center text-sm" style={{ color: COLORS.secondaryText }}>
                Didn't receive the OTP? <button onClick={handleResendOtp} className="text-blue-500 hover:underline">Resend</button>
            </p>
        </div>
    </div>

    )

}