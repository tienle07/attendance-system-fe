import axios from "axios";
import jwt_decode from "jwt-decode";
let isRefreshing = false;
let refreshSubscribers = [];
const refreshToken = async () => {
  try {
    const refresh = {
      refreshToken: localStorage.getItem("refresh"),
    };
    const res = await axios.post("/api/authenticate", refresh);
    localStorage.setItem("refresh", res?.data?.data?.token?.refreshToken);
    return res.data;
  } catch (err) {
  }
};
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};
const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};
export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwt_decode(user?.data?.token?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000 + 60) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const newAccessToken = await refreshToken();
            dispatch(stateSuccess(newAccessToken));
            newInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken?.data?.token?.accessToken}`;
            onTokenRefreshed(newAccessToken?.data?.token?.accessToken);
          } catch (error) {
            // dispatch(logoutSuccess)
          } finally {
            isRefreshing = false;
          }
        }
        return new Promise((resolve) => {
          subscribeTokenRefresh((newAccessToken) => {
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            resolve(config);
          });
        });
      }
      config.headers["Authorization"] = `Bearer ${user?.data?.token?.accessToken}`;
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};
