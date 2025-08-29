// /components/user/Profile/ProfileOverview.tsx
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function ProfileOverview() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Welcome, {currentUser?.name}</h2>
      <p className="text-gray-600">Email: {currentUser?.email}</p>
      {/* {currentUser?.id && <p className="text-gray-600">Phone: {currentUser?.id}</p>} */}
      <p className="mt-4 text-gray-500">This is your profile overview page. From here, you can manage your account settings, bookings, and preferences.</p>
    </div>
  );
}
