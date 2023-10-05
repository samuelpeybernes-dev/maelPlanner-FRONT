import { defineStore } from 'pinia'
import { axiosAuth } from '../hook/axios'

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
            const { data } = await axiosAuth.get(`/scheduleJob/getSchedule`)
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
            newHtml: scheduleJob.html,
            newJob: scheduleJob.job,
            newBackColor: scheduleJob.backColor,
            newBorderColor: scheduleJob.borderColor,
          },
        }
        await axiosAuth.post(`/scheduleJob/postSchedule`, body)
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
          axiosAuth.delete(`/scheduleJob/deleteSchedule?id=${scheduleJobId}`)
          this.scheduleJob = this.scheduleJob.filter((scheduleJob) => scheduleJob.id !== scheduleJobId)
          }
          catch (error) {
            alert(error)
            console.log(error) 
      }
    },
  },
})