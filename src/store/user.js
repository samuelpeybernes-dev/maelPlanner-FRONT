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
    async fetchUserProfil() {
      try {
        const userId = localStorage.getItem("_id");
        const { data } = await axiosAuth.get(
          `/user/getCustomization?_id=${userId}`
        );
        this.user = data.profil;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async postUserProfil(customElement) {
      try {
        const userId = localStorage.getItem("_id");
        const body = {
          userJoi: {
            maxEventHoursPerDay: customElement.maxEventHoursPerDay,
            lunchBreakStartHour: customElement.lunchBreakStartHour,
            lunchBreakEndHour: customElement.lunchBreakEndHour,
            startHour: customElement.startHour,
          },
        };
        await axiosAuth.post(`/user/postCustomization?_id=${userId}`, body);
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
        localStorage.setItem("_id", resp.data.id);
        axiosAuth.defaults.headers.common["Authorization"] =
          "Bearer " + resp.data.accessToken;
      } catch (error) {
        return error;
      }
    },
    async postRegister(user) {
      try {
        const body = {
          firstName: user.firstName,
          name: user.name,
          email: user.email,
          password: user.password,
        };
        const resp = await axiosNoAuth.post(`/guest/register`, body);
        this.user = {
          auth: true,
          access_token: resp.data.accessToken,
          refresh_token: resp.data.refreshToken,
          name: user.name,
          email: user.email,
        };
        localStorage.setItem("token", resp.data.accessToken);
        localStorage.setItem("refreshToken", resp.data.refreshToken);
        localStorage.setItem("_id", resp.data.id);
        axiosAuth.defaults.headers.common["Authorization"] =
          "Bearer " + resp.data.accessToken;
      } catch (error) {
        return error;
      }
    },
    async resetPasswordRequest(email) {
      try {
        const body = {
          userJoi: {
            email: email,
          },
        };
        const resp = await axiosNoAuth.post(
          `/guest/resetPasswordRequest`,
          body
        );
        return resp;
      } catch (error) {
        return error;
      }
    },
    async resetPassword(userData) {
      try {
        const body = {
          userJoi: {
            userId: userData.userId,
            token: userData.token,
            password: userData.password,
          },
        };
        const resp = await axiosAuth.post(`/user/resetPassword`, body);
        return resp;
      } catch (error) {
        return error;
      }
    },
  },
});
