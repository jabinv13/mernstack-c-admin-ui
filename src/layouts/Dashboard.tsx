import { Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div>
      <h1>Auth component</h1>
      <Outlet />
    </div>
  );
};
