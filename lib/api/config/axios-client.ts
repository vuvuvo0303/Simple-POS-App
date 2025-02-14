import axios from "axios";
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
