import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import { ProtectedRoute } from './ProtectedRoute';
import Home from '../pages/user/Home';
import Otp from '../components/user/Otp';
import AdminLogin from '../pages/admin/AdminLogin';
import HomeAdmin from '../pages/admin/Home';
import ProfilePage from '../pages/user/Profile';
import GuideLogin from '../pages/Guide/LoginGuide';
import GuideHome from '../pages/Guide/Home';
import BecomeAGuide from '../pages/user/BecomeAGuide';
import FetchAllUsers from '../pages/admin/FetchAllUsers';
import GuideRequests from '../pages/admin/GuideRequests';
import DestinationPage from '../pages/admin/Destination';
import CreateDestination from '../pages/admin/CreateDestination';
import UserDestinations from '../pages/user/Destinations';
import DestinationDetailPage from '../components/user/Destination/DetailedDestination';
import GuideProfile from '../pages/Guide/ProfileGuide';
import GuideDestinations from '../pages/Guide/GuideDestinations';
import EditDestination from '../pages/admin/EditDestination';
import EditProfile from '../pages/Guide/EditProfileGuide';
import CreatePost from '../pages/Guide/CreatePost';
import GuideListing from '../pages/user/GuideListing';
import GuideProfileUserView from '../pages/user/GuideProfile';
import NotFound from '../pages/NotFoundPage';

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
          <Route path='/become-a-guide' element={ <BecomeAGuide /> } />
          <Route path='/destinations' element={ <UserDestinations /> } />
          <Route path='/destination/:id' element={ <DestinationDetailPage /> } />
          <Route path='/guides' element={ <GuideListing /> } />
          <Route path='/guide/:guideId' element={ <GuideProfileUserView /> } />;
        </Route>

        {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/home" element={<HomeAdmin />} />
          <Route path='/admin/all-users' element={ <FetchAllUsers /> } />
          <Route path='/admin/guide-requests' element={< GuideRequests /> } />
          <Route path='/admin/destinations' element={ <DestinationPage /> } />
          <Route path='/admin/create-destinations' element={ <CreateDestination /> } />
          <Route path='/admin/edit-destination/:id' element={ <EditDestination /> } />

        {/* guide side */}
          <Route path='/guide/login' element={ <GuideLogin /> } />
          <Route path='/guide/home' element={ <GuideHome /> } />
          <Route path='/guide/profile' element={ <GuideProfile /> } />
          <Route path='/guide/destinations' element={ <GuideDestinations /> } />
          <Route path='/guide/edit-profile' element={ <EditProfile /> } />
          <Route path='/guide/create-post' element={ <CreatePost /> } />;

        {/* 404 page */}
        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </BrowserRouter>
  );
}
