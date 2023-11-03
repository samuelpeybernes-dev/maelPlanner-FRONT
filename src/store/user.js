import { defineStore } from "pinia";
import { axiosAuth, axiosNoAuth } from "../hook/axios";

export const user = defineStore("user", {
  state: () => ({
    user: {
      auth: false,
    },
  }),
  getters: {},
  actions: {
    async fetchUserProfil(userToken) {
      try {
        const { data } = await axiosAuth.get(
          `/user/getCustomization?token=${userToken}`
        );
        this.user = data.profil;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async postUserProfil(userToken, customElement) {
      try {
        const body = {
          userJoi: {
            maxEventHoursPerDay: customElement.maxEventHoursPerDay,
            lunchBreakStartHour: customElement.lunchBreakStartHour,
            lunchBreakEndHour: customElement.lunchBreakEndHour,
            startHour: customElement.startHour,
          },
        };
        await axiosAuth.post(
          `/user/postCustomization?token=${userToken}`,
          body
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
          token: user.token,
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
