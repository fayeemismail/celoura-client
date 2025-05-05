import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleTokenRefresh } from "./redux/user/authThunks";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const dispatch = useDispatch();

  // Refresh token once when the app mounts
  useEffect(() => {
    dispatch(handleTokenRefresh());
  }, [dispatch]);

  return <AppRoutes />;
}
