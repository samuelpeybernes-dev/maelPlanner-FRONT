import { defineStore } from "pinia";
import { axiosAuth } from "../hook/axios";
export const scheduleJob = defineStore("scheduleJob", {
  state: () => ({
    scheduleJob: [],
  }),
  getters: {},
  actions: {
    async fetchScheduleJob() {
      try {
        const userId = localStorage.getItem("_id");
        const { data } = await axiosAuth.get(
          `/scheduleJob/getSchedule?_id=${userId}`
        );

        this.scheduleJob = data.scheduleJob;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async postScheduleJob(scheduleJob) {
      try {
        const userId = localStorage.getItem("_id");
        const body = {
          scheduleJobJoi: {
            id: scheduleJob.id,
            newStart: scheduleJob.start,
            newEnd: scheduleJob.end,
            newText: scheduleJob.text,
            newHtml: scheduleJob.html,
            newJob: scheduleJob.job,
            newBackColor: scheduleJob.backColor,
            newBorderColor: scheduleJob.borderColor,
          },
        };
        await axiosAuth.post(`/scheduleJob/postSchedule?_id=${userId}`, body);
        const isDuplicate = this.scheduleJob.some(
          (item) => item.id === scheduleJob.id
        );
        if (!isDuplicate) {
          this.scheduleJob.push(scheduleJob);
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async deleteScheduleJob(scheduleJobId) {
      try {
        axiosAuth.delete(`/scheduleJob/deleteSchedule?id=${scheduleJobId}`);
        this.scheduleJob = this.scheduleJob.filter(
          (scheduleJob) => scheduleJob.id !== scheduleJobId
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
