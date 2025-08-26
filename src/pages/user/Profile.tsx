// /pages/user/Profile.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { handleSignout } from "../../redux/user/authThunks";
import ProfileNavbar from "../../components/user/Profile/ProfileNavbar";
import ProfileSidebar from "../../components/user/Profile/ProfileSidebar";
import ProfileOverview from "../../components/user/Profile/ProfileOverview";
import ProfileForm from "../../components/user/Profile/ProfileForm";

export default function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("overview"); 

  useEffect(() => {
    if (!currentUser) {
      dispatch(handleSignout());
      navigate("/login");
    }
  }, [currentUser, dispatch, navigate]);

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <ProfileOverview />;
      case "bookings":
        return <div className="p-6">Bookings Page</div>;
      case "edit-profile":
        return <ProfileForm />;
      case "addresses":
        return <div className="p-6">Manage Addresses</div>;
      case "followed-guides":
        return <div className="p-6">Followed Guides</div>;
      case "liked-posts":
        return <div className="p-6">Liked Posts</div>;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="bg-[#f8f5ef] min-h-screen pt-20 p-4">
      <div className="max-w-5xl mx-auto bg-white border border-[#e0d8c3] rounded-lg shadow-xl flex">
        <ProfileSidebar active={activePage} setActive={setActivePage} />
        <div className="flex-1">
          <ProfileNavbar />
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
