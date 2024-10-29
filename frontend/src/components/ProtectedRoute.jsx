import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = Cookies.get("userToken");

  if (!token) {
    return <Navigate to={"/"} replace />;
  }

  return element;
};

export default ProtectedRoute;
