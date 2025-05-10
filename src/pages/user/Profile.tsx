// /pages/user/Profile.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { handleSignout } from "../../redux/user/authThunks";
import COLORS from "../../styles/theme";
import ProfileNavbar from "../../components/user/Profile/ProfileNavbar";
import ProfileForm from "../../components/user/Profile/ProfileForm";

export default function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      dispatch(handleSignout());
      navigate("/login");
    }
  }, [currentUser, dispatch, navigate]);

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
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
