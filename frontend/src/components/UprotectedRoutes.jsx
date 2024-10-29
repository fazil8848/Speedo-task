import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const UnprotectedRoute = ({ element }) => {
  const token = Cookies.get("userToken");

  if (token) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return element;
};

export default UnprotectedRoute;
