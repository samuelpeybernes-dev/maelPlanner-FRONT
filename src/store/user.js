import { defineStore } from "pinia";
import { axiosAuth, axiosNoAuth } from "../hook/axios";

export const user = defineStore("user", {
  state: () => ({
    user: {
      auth: false,
      email: "",
    },
  }),
  getters: {},
  actions: {
    async fetchUserProfil(userEmail) {
      try {
        const { data } = await axiosAuth.get(
          `/user/getCustomization?email=${userEmail}`
        );
        this.user = data;
        console.log(
          "🚀 ~ file: user.js:16 ~ fetchUserProfil ~ data:",
          this.user
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async postLogin(userData) {
      try {
        const body = {
          email: userData.email,
          password: userData.password,
        };
        const resp = await axiosNoAuth.post(`/guest/login`, body);

        this.user = {
          auth: true,
          access_token: resp.data.accessToken,
          refresh_token: resp.data.refreshToken,
          name: userData.name,
          email: userData.email,
        };
        localStorage.setItem("token", resp.data.accessToken);
        localStorage.setItem("refreshToken", resp.data.refreshToken);
        axiosAuth.defaults.headers.common["Authorization"] =
          "Bearer " + resp.data.accessToken;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async postRegister(user) {
      try {
        const body = {
          name: user.name,
          email: user.email,
          password: user.password,
        };
        const resp = await axiosNoAuth.post(`/guest/register`, body);
        this.user = {
          auth: true,
          access_token: resp.data.access_token,
          refresh_token: resp.data.refresh_token,
          name: user.name,
          email: user.email,
        };
        localStorage.setItem("token", resp.data.access_token);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
