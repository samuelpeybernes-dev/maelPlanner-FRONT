import { defineStore } from 'pinia'
import axios from "axios"

export const scheduleJob = defineStore("scheduleJob",{
    state: () => ({
        scheduleJob: [
            {
              id: 4,
              start: "2023-09-04T06:00:00.000Z",
              end: "2023-09-04T06:00:00.000Z",
              text: "decathlon",

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
        const body = {
          scheduleJobJoi: {
            id: scheduleJob.id,
            start: scheduleJob.start,
            end: scheduleJob.end,
            text: scheduleJob.text,
            backColor: scheduleJob.backColor,
            borderColor: scheduleJob.borderColor
          },
        }
    
        axios.post(`http://127.0.0.1:1631/api/v1/scheduleJob/postSchedule`, body)
      },
    },
})