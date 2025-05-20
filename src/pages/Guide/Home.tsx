import { Users, Calendar, MapPin } from 'lucide-react';
import { GUIDE_COLORS } from '../../styles/theme';



// Import components
import GuideNavbar from '../../components/guide/GuideNavbar';
import StatCard from '../../components/guide/StatCard';
import UpcomingTrips from '../../components/guide/UpcomingTrips';
import QuickActions from '../../components/guide/QuickActions';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {  RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';




const GuideHome = () => {

    const navigate = useNavigate()
    const { isAuthenticated, currentGuide } = useSelector((state: RootState) => state.guide);
    console.log(currentGuide?.id)

    

     useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guide/login");

    }
  }, [isAuthenticated, navigate]);


  return (
    <div 
      style={{ 
        backgroundColor: GUIDE_COLORS.bg, 
        minHeight: '100vh',
        color: GUIDE_COLORS.text 
      }} 
      className="p-8 pt-24"
    >
      <GuideNavbar />
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <h1 
            className="text-3xl font-bold mb-6"
            style={{ color: GUIDE_COLORS.text }}
          >
            Welcome, {currentGuide? currentGuide.name : 'User'}
          </h1>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard 
              icon={<Users />} 
              title="Total Clients" 
              value={42} 
            />
            <StatCard 
              icon={<MapPin />} 
              title="Trips Completed" 
              value={18} 
            />
            <StatCard 
              icon={<Calendar />} 
              title="Upcoming Trips" 
              value={6} 
            />
          </div>

          <UpcomingTrips />
        </div>
        
        <QuickActions />
      </div>
    </div>
  );
};

export default GuideHome;