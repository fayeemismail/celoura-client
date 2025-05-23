import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  GetAllUsersData,
  handleUserBlockUnblock,
} from "../../redux/admin/authThunks";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  blocked: boolean;
  role: "user" | "guide" | "admin";
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
  googleUser?: boolean;
}

export default function AllUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<"user" | "guide">("user");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await dispatch(GetAllUsersData());
      if (response.data?.users) {
        const users = response.data?.users;
        const guide = response.data?.guide;
        const userAndGuide = [...users, ...guide];
        setUsers(userAndGuide);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  console.log('re render')

  const UserBlockUnBlock = async (
    userId: string,
    isCurrentlyBlocked: boolean
  ): Promise<void> => {
    try {
      await dispatch(handleUserBlockUnblock(userId, isCurrentlyBlocked));

      // Update local user state immediately
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, blocked: !isCurrentlyBlocked } : user
        )
      );

      toast.success(`User ${isCurrentlyBlocked ? "unblocked" : "blocked"} successfully`);
    } catch (error: any) {
      console.error("Unexpected Error", error.message);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) => user.role === filterRole);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    fetchUsers();
  }, []);

  return (
    <div style={{ backgroundColor: "#1A1F2C" }} className="flex min-h-screen">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <AdminHeader />

        <div className="p-6">
          <div
            style={{ backgroundColor: "#242A38" }}
            className="rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#fff]">
                User Management
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => setFilterRole("user")}
                  className={`px-4 py-2 rounded ${
                    filterRole === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setFilterRole("guide")}
                  className={`px-4 py-2 rounded ${
                    filterRole === "guide"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  All Guides
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead
                  style={{ backgroundColor: "#1A1F2C" }}
                  className="text-white uppercase tracking-wider"
                >
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Blocked</th>
                    <th className="py-3 px-4">Google</th>
                    <th className="py-3 px-4">Joined At</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody
                  style={{ backgroundColor: "rgb(29 36 54)", color: "#F2F0EF" }}
                >
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-t border-gray-300">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4 capitalize">{user.role}</td>
                        <td className="py-3 px-4">
                          {user.blocked ? "Yes" : "No"}
                        </td>
                        <td className="py-3 px-4">
                          {user.googleUser ? "Yes" : "No"}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString("in")}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              UserBlockUnBlock(user._id, user.blocked)
                            }
                            className={`px-3 py-1 cursor-pointer rounded text-white ${
                              user.blocked ? "bg-green-600" : "bg-red-600"
                            }`}
                          >
                            {user.blocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-4 text-center" colSpan={8}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
