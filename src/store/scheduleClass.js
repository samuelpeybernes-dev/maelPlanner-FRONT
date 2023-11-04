import { defineStore } from "pinia";
import { axiosAuth } from "../hook/axios";

export const scheduleClass = defineStore("scheduleClass", {
  state: () => ({
    scheduleClass: [],
  }),
  getters: {},
  actions: {
    async fetchScheduleClass() {
      try {
        const userId = localStorage.getItem("_id");
        const { data } = await axiosAuth.get(
          `/scheduleClass/getSchedule?_id=${userId}`
        );
        this.scheduleClass = data.scheduleClass;
        for (const event of this.scheduleClass) {
          const subject = event.subject?.[0];
          if (subject && subject.backColor && subject.borderColor) {
            // Affectation des couleurs directement
            event.backColor = subject.backColor;
            event.borderColor = subject.borderColor;
          }
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async postScheduleClass(scheduleClass) {
      try {
        const userId = localStorage.getItem("_id");
        const body = {
          scheduleClassJoi: scheduleClass.map((item) => ({
            id: item.id,
            newStart: item.start,
            newEnd: item.end,
            newText: item.text,
            newHtml: item.html,
            subject_id: item.subject_id,
          })),
        };
        await axiosAuth.post(`/scheduleClass/postSchedule?_id=${userId}`, body);
        const idsToRemove = scheduleClass.map((item) => item.id);
        this.scheduleClass = this.scheduleClass.filter(
          (item) => !idsToRemove.includes(item.id)
        );
        this.scheduleClass.push(...scheduleClass);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async deleteScheduleClass(start, end) {
      try {
        const userId = localStorage.getItem("_id");
        await axiosAuth.delete(
          `/scheduleClass/deleteSchedule?_id=${userId}&start=${start}&end=${end}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
