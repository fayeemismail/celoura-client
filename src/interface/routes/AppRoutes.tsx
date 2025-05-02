import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import { ProtectedRoute } from './ProtectedRoute';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Home from '../pages/user/Home';
import Otp from '../components/user/Otp';
import AdminLogin from '../pages/admin/AdminLogin';


export default function AppRoutes() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    
                    
                    {/* Public Routes */}
                    <Route path='/login' element={ <Login /> } />
                    <Route path='/signup' element={ <Signup /> } />
                    <Route path='/verify-otp' element={ <Otp /> } ></Route>


                    {/* Protected Routes */}
                    <Route element={ <ProtectedRoute /> }>
                        <Route path='/' element={<Home />} />
                    </Route>

                    {/* Default Redirect */}
                    {/* <Route path='/' element={<Navigate to='/login' replace />} /> */}


                    {/* adminPage */}
                    <Route path='/adminLogin' element={ <AdminLogin /> } />

                </Routes>
            </BrowserRouter>
        </Provider>
    )
}