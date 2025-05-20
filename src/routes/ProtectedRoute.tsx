import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const ProtectedRoute = ({ redirectedPath = '/login' }) => {
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.user);
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const hasOAuthParam = Boolean(searchParams.get("email"));

    // still loading
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full border-b-2 border-t-2 border-gray-900 h-8 w-8" />
            </div>
        );
    }

    // not authenticated, and no oauth param
    if (!isAuthenticated && !hasOAuthParam) {
        return <Navigate to={redirectedPath} replace state={{ from: location }} />;
    }

    // either authenticated or OAuth redirect in progress
    return <Outlet />;
};
