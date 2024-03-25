import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

export const Dashboard = () => {
  const { user } = useAuthStore();

  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      <h1>Auth component</h1>
      <Link to={"/auth/login"}>Go to Homepage</Link>
      <Outlet />
    </div>
  );
};
