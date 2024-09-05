import axios from "axios";
import {
  ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;
export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;

  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  if (response.data.statusCode === "ok") {
    return response.data;
  }

  const originalRequest = response.config;
  const statusCode = response.data.statusCode;
  const errorMessage = response.data.message;

  if (statusCode === 401) {
    const response = await axios
      .create({ withCredentials: true })
      .get(`${baseURL}/auth/refresh`);

    if (response.data.status === "ok") {
      setItem(ACCESS_TOKEN, response.data.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.data.result.accessToken}`;

      return axios(originalRequest);
    } else {
      removeItem(ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      return Promise.reject(errorMessage);
    }
  }
});
