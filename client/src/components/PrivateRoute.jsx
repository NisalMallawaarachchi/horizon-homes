import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user); // Changed from state.auth to state.user

  // Optional: Add loading state handling
  // if (loading) return <LoadingSpinner />;

  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
}
