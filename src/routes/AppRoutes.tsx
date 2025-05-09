import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import { ProtectedRoute } from './ProtectedRoute';
import Home from '../pages/user/Home';
import Otp from '../components/user/Otp';
import AdminLogin from '../pages/admin/AdminLogin';
import HomeAdmin from '../pages/admin/Home';
import ProfilePage from '../pages/user/Profile';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<Otp />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path='/Profile' element={<ProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<HomeAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
