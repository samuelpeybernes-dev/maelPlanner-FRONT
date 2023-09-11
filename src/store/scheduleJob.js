import { defineStore } from 'pinia'
import axios from "axios"

export const scheduleJob = defineStore("scheduleJob",{
    state: () => ({
        scheduleJob: [
            {
              id: "4",
              start: "2023-09-04T06:00:00.000Z",
              end: "2023-09-04T06:00:00.000Z",
              text: "decathlon",
              backColor: "",
              borderColor: "",
            },
          ],
    }),
    getters: {

    },
    actions: {
      async fetchScheduleJob() {
        try {
            const { data } = await axios.get(`http://127.0.0.1:1631/api/v1/scheduleJob/getSchedule`)
            this.scheduleJob = data.scheduleJob           
          }
          catch (error) {
            alert(error)
            console.log(error) 
        }
      },

      postScheduleJob(scheduleJob) {
        try {
        const body = {
          scheduleJobJoi: {
            id: scheduleJob.id,
            newStart: scheduleJob.start,
            newEnd: scheduleJob.end,
            newText: scheduleJob.text,
          },
        }
        axios.post(`http://127.0.0.1:1631/api/v1/scheduleJob/postSchedule`, body)
      }
        catch (error) {
          alert(error)
          console.log(error) 
      }
      },

      deleteScheduleJob(scheduleJobId) {
        try {
          axios.delete(`http://127.0.0.1:1631/api/v1/scheduleJob/deleteSchedule?id=${scheduleJobId}`)
          }
          catch (error) {
            alert(error)
            console.log(error) 
      }
    },
  },
})