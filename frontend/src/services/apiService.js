import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: apiUrl,
});

API.interceptors.request.use((req) => {
  const token = Cookies.get("userToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logout = () => API.post("/auth/logout");

export const getTrips = () => API.get("/trip/getTrips");
export const uploadTrip = (data) =>
  API.post("/trip/addTrip", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteTripsAPI = (data) =>
  API.delete("/trip/deleteTrips", { data });

export const getSelectedTrips = (data) =>
  API.post("/trip/getSelectedTrips", data);
