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
    async postHoursSubject(subject) {
      try {
        console.log("🚀 ~ postHoursSubject ~ hoursSubjects:", subject);

        const userId = localStorage.getItem("_id");
        const body = {
          hoursSubjectJoi: [
            {
              id: subject._id,
              newText: subject.text,
              newWeekHours: subject.weekHours,
              newBorderColor: subject.backColor,
              newBackColor: subject.backColor,
            },
          ],
        };
        const response = await axiosAuth.post(
          `/hoursSubject/postHoursSubject?_id=${userId}`,
          body
        );
        this.hoursSubject.push(...response.data.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async deleteHoursSubject(subjectId) {
      try {
        axiosAuth.delete(`/hoursSubject/deleteHoursSubject?id=${subjectId}`);
        this.hoursSubject = this.hoursSubject.filter(
          (hoursSubject) => hoursSubject._id !== subjectId
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
