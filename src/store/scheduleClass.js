import { defineStore } from 'pinia'
import axios from "axios"

export const scheduleClass = defineStore("scheduleClass",{
    state: () => ({
      scheduleClass: [
            
          ],
    }),
    getters: {

    },
    actions: {
      async fetchScheduleClass() {
        try {
            const { data } = await axios.get(`https://mael-planner-back.vercel.app:1631/api/v1/scheduleClass/getSchedule`)
            this.scheduleClass = data.scheduleClass           
          }
          catch (error) {
            alert(error)
            console.log(error) 
        }
      },

      async postScheduleClass(scheduleClass) {
        try {
        const body = {
          scheduleClassJoi: {
            id: scheduleClass.id,
            newStart: scheduleClass.start,
            newEnd: scheduleClass.end,
            newText: scheduleClass.text,
            subject_id: scheduleClass.subject_id,
          },
        }
        await axios.post(`https://mael-planner-back.vercel.app:1631/api/v1/scheduleClass/postSchedule`, body)
        this.scheduleClass = this.scheduleClass.filter((scheduleClass) => scheduleClass.id !== scheduleClass.id)
        this.scheduleClass.push(scheduleClass)
      }
        catch (error) {
          alert(error)
          console.log(error) 
      }
      },
  },
})