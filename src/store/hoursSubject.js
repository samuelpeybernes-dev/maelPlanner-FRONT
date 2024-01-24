import { defineStore } from "pinia";
import { axiosAuth } from "../hook/axios";

export const hoursSubject = defineStore("hoursSubject", {
  state: () => ({
    hoursSubject: [],
  }),
  getters: {},
  actions: {
    async fetchHoursSubject() {
      try {
        const userId = localStorage.getItem("_id");
        const { data } = await axiosAuth.get(
          `/hoursSubject/gethoursSubject?_id=${userId}`
        );
        this.hoursSubject = data.hoursSubject;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
