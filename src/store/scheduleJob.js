import { defineStore } from 'pinia'
import axios from "axios"

export const scheduleJob = defineStore("scheduleJob",{
    state: () => ({
        scheduleJob: [
            
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

      async postScheduleJob(scheduleJob) {
        try {
        const body = {
          scheduleJobJoi: {
            id: scheduleJob.id,
            newStart: scheduleJob.start,
            newEnd: scheduleJob.end,
            newText: scheduleJob.text,
          },
        }
        await axios.post(`http://127.0.0.1:1631/api/v1/scheduleJob/postSchedule`, body)
        this.scheduleJob = this.scheduleJob.filter((scheduleJob) => scheduleJob.id !== scheduleJob.id)
        this.scheduleJob.push(scheduleJob)
      }
        catch (error) {
          alert(error)
          console.log(error) 
      }
      },

      async deleteScheduleJob(scheduleJobId) {
        try {
          axios.delete(`http://127.0.0.1:1631/api/v1/scheduleJob/deleteSchedule?id=${scheduleJobId}`)
          this.scheduleJob = this.scheduleJob.filter((scheduleJob) => scheduleJob.id !== scheduleJobId)
          }
          catch (error) {
            alert(error)
            console.log(error) 
      }
    },
  },
})