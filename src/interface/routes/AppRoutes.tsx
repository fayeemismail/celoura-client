import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import { ProtectedRoute } from './ProtectedRoute';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Home from '../pages/Home';
import Otp from '../components/user/Otp';


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

                </Routes>
            </BrowserRouter>
        </Provider>
    )
}