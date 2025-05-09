import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import COLORS from "../../styles/theme";
import { Mail, User, Lock, Save, Eye, EyeOff } from "lucide-react";
import { handleSignout, handleUpdateProfile } from "../../redux/user/authThunks";
import ProfileNavbar from "../../components/user/Profile/ProfileNavbar";
import { validatePasswords } from "../../validator/PasswordValidator";

export default function Profile() {
  const { currentUser, error, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || "");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  useEffect(() => {
    if (!currentUser) {
      dispatch(handleSignout());
      navigate("/login");
    }
  }, [currentUser, dispatch, navigate]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };
  

  const cancelPasswordChange = () => {
    setShowPasswordFields(false);
    setPasswordData({
      current: "",
      new: "",
      confirm: "",
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: {
      id: string;
      name?: string;
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = { id: currentUser!.id };

    if(currentUser?.id) payload.id = currentUser.id 
    
    //Password Logic
    if (name !== currentUser?.name) payload.name = name;

    if (showPasswordFields) {
      const { current, new: newPass, confirm } = passwordData;
      
      //Validating with Zod
      const result = validatePasswords({ current, new: newPass, confirm });

      if(!result.success){
        setFormError(result.message || "Something went wrong");
        return 
      }

      payload.currentPassword = current;
      payload.newPassword = newPass;
      payload.confirmPassword = confirm;
    }
      setFormError('');
    if (Object.keys(payload).length > 1) {
      dispatch(handleUpdateProfile(payload));
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.bg, minHeight: "100vh", paddingTop: "80px" }}
      className="flex items-center justify-center p-4"
    >
      <div
        style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
        className="w-full max-w-md rounded-lg border shadow-xl"
      >
        <ProfileNavbar />
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div>
            {formError && <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{formError}</div>}
            {error && <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{error}</div>}
            </div>
            {/* Name */}
            <div className="mb-4">
              <div className="relative">
                <User style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                  className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Email - Read only */}
            <div className="mb-4">
              <div className="relative">
                <Mail style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  style={{
                    backgroundColor: COLORS.inputBg,
                    borderColor: COLORS.border,
                    color: COLORS.secondaryText,
                    cursor: "not-allowed",
                  }}
                  className="w-full rounded-lg border p-3 pl-10"
                />
              </div>
            </div>

            {/* Toggle Password Fields */}
            {!showPasswordFields ? (
              <button
                type="button"
                onClick={() => setShowPasswordFields(true)}
                className="mb-4 text-sm font-medium underline"
                style={{ color: COLORS.accent }}
              >
                Change Password?
              </button>
            ) : (
              <>
                {/* Current Password */}
                <div className="mb-4">
                  <div className="relative">
                    <Lock style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                    <input
                      type={passwordData.showCurrent ? "text" : "password"}
                      placeholder="Current Password"
                      value={passwordData.current}
                      onChange={(e) => handlePasswordChange("current", e.target.value)}
                      required
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                      className="w-full rounded-lg border p-3 pl-10 pr-10 focus:outline-none focus:ring-2"
                    />
                    <div
                      onClick={() => toggleVisibility("showCurrent")}
                      className="absolute right-3 top-3 cursor-pointer"
                    >
                      {passwordData.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <div className="relative">
                    <Lock style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                    <input
                      type={passwordData.showNew ? "text" : "password"}
                      placeholder="New Password"
                      value={passwordData.new}
                      onChange={(e) => handlePasswordChange("new", e.target.value)}
                      required
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                      className="w-full rounded-lg border p-3 pl-10 pr-10 focus:outline-none focus:ring-2"
                    />
                    <div
                      onClick={() => toggleVisibility("showNew")}
                      className="absolute right-3 top-3 cursor-pointer"
                    >
                      {passwordData.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <div className="relative">
                    <Lock style={{ color: COLORS.secondaryText }} className="absolute left-3 top-3 h-5 w-5" />
                    <input
                      type={passwordData.showConfirm ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={passwordData.confirm}
                      onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                      required
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                      className="w-full rounded-lg border p-3 pl-10 pr-10 focus:outline-none focus:ring-2"
                    />
                    <div
                      onClick={() => toggleVisibility("showConfirm")}
                      className="absolute right-3 top-3 cursor-pointer"
                    >
                      {passwordData.showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                {/* Cancel password change */}
                <div className="mb-4 text-right">
                  <button
                    type="button"
                    onClick={cancelPasswordChange}
                    className="text-sm font-medium underline"
                    style={{ color: COLORS.accent }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
              className="flex w-full items-center justify-center rounded-lg py-3 font-medium transition-colors duration-300 hover:opacity-90"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  Save Changes <Save className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
