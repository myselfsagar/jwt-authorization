import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, getItem } from "../utils/localStorageManager";

function CheckIsLogin() {
  const location = useLocation();

  const accessToken = getItem(ACCESS_TOKEN);
  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ prevUrl: location.pathname }} />
  );
}

export default CheckIsLogin;
