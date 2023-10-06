import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { user } from "../store/user";

const axiosAuth = axios.create({
  baseURL: "/planner",
});
const axiosNoAuth = axios.create({
  baseURL: "/planner",
});

axiosAuth.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosAuth, axiosNoAuth };

const refreshAuthLogic = (failedRequest) => {
  const userStore = user();

  const data = {
    refreshToken: localStorage.getItem("refreshToken"),
  };

  const options = {
    method: "POST",
    data,
    url: "/planner/guest/refresh-token",
  };

  return axios(options)
    .then(async (tokenRefreshResponse) => {
      failedRequest.response.config.headers.Authorization =
        "Bearer " + tokenRefreshResponse.data.data.accessToken;

      userStore.$state.user = {
        auth: true,
        access_token: tokenRefreshResponse.data.data.accessToken,
        refresh_token: tokenRefreshResponse.data.data.refreshToken,
      };

      localStorage.setItem("token", tokenRefreshResponse.data.data.accessToken);
      localStorage.setItem(
        "refreshToken",
        tokenRefreshResponse.data.data.refreshToken
      );
      axiosAuth.defaults.headers.common["Authorization"] =
        "Bearer " + tokenRefreshResponse.data.data.accessToken;
      return Promise.resolve();
    })
    .catch(async (err) => {
      Promise.reject(`Error refreshing token: ${err}`);
      userStore.$reset();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    });
};

createAuthRefreshInterceptor(axiosAuth, refreshAuthLogic, {});
