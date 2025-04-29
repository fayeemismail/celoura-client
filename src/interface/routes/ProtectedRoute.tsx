import { Navigate, Outlet } from "react-router-dom";
import { RootState, } from "../../redux/store";
import { useSelector } from "react-redux";


interface ProtectedRouteProps {
    redirectedPath?: string;
};

export const ProtectedRoute = ({ redirectedPath = '/login' }: ProtectedRouteProps) => {
    
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.user);

    //show loaiding while checking authentication status
    if( loading ) {
        return (
            <div className="flex h-screen w-full items-center justify-center" >
                <div className="animate-spin rounded-full border-b-2 border-t-2 border-gray-900 h-8 w-8" ></div>
            </div>
        );
    }

    // redirect if not authenticated
    if ( !isAuthenticated ) {
        return <Navigate to={redirectedPath} replace />;
    }

    // render children if authenicated
    return <Outlet />;
};