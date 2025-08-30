import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { handleSignout } from "../../redux/user/authThunks";
import ProfileSidebar from "../../components/user/Profile/ProfileSidebar";
import ProfileOverview from "../../components/user/Profile/ProfileOverview";
import ProfileForm from "../../components/user/Profile/ProfileForm";
import ProfileAddressesPage from "../../components/user/Profile/ProfileAddressPage";
import ProfileFollowedGuidesPage from "../../components/user/Profile/ProfileFollowedPage";
import ProfileLikedPostsPage from "../../components/user/Profile/ProfileLikePage";
import ProfileNavbar from "../../components/user/Profile/ProfileNavbar";

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
      case "edit-profile":
        return <ProfileForm />;
      case "addresses":
        return <ProfileAddressesPage />;
      case "followed-guides":
        return <ProfileFollowedGuidesPage />;
      case "liked-posts":
        return <ProfileLikedPostsPage />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="bg-[#f8f5ef] min-h-screen pt-20 p-4">
      <ProfileNavbar />
      <div className="max-w-7x mx-auto flex gap-2">
        <ProfileSidebar 
          active={activePage} 
          setActive={setActivePage} 
          user={currentUser}
        />
        <div className="flex-1 bg-white border border-[#e0d8c3] rounded-lg shadow-xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}