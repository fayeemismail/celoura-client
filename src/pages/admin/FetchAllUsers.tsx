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
import ConfirmationDialog from "../../components/common/ConfirmationDialog"; 

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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();

  // Confirmation modal states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await dispatch(GetAllUsersData(page, limit, filterRole, search));
      const data = response?.data || [];
      const pagination = response?.pagination;
      setUsers(data);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleBlockUnblockConfirmed = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(handleUserBlockUnblock(selectedUser._id, selectedUser.blocked));

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, blocked: !selectedUser.blocked } : user
        )
      );

      toast.success(`User ${selectedUser.blocked ? "unblocked" : "blocked"} successfully`);
    } catch (error: any) {
      console.error("Unexpected Error", error.message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const openConfirmDialog = (user: User) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    fetchUsers();
  }, [filterRole, page, search]);

  return (
    <div style={{ backgroundColor: "#1A1F2C" }} className="flex min-h-screen">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />
        <div className="p-6">
          <div style={{ backgroundColor: "#242A38" }} className="rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#fff]">User Management</h2>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setFilterRole("user");
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded ${filterRole === "user" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
                >
                  All Users
                </button>
                <button
                  onClick={() => {
                    setFilterRole("guide");
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded ${filterRole === "guide" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
                >
                  All Guides
                </button>
              </div>
            </div>

            {/* 🔍 Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-500 text-white bg-[#1A1F2C] focus:outline-none"
              />
            </div>

            {/* 🧾 Table */}
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
                <tbody style={{ backgroundColor: "rgb(29 36 54)", color: "#F2F0EF" }}>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="border-t border-gray-300">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4 capitalize">{user.role}</td>
                        <td className="py-3 px-4">{user.blocked ? "Yes" : "No"}</td>
                        <td className="py-3 px-4">{user.googleUser ? "Yes" : "No"}</td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString("in")}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openConfirmDialog(user)}
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

            {/* 📄 Pagination */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-white">{`Page ${page} of ${totalPages}`}</span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Block/Unblock Confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        title="Confirm Action"
        message={`Are you sure you want to ${selectedUser?.blocked ? "unblock" : "block"} this user?`}
        color={selectedUser?.blocked ? "#16a34a" : "#dc2626"}
        onConfirm={handleBlockUnblockConfirmed}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </div>
  );
}
