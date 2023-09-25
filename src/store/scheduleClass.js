import { defineStore } from 'pinia'
import axios from "axios"

export const scheduleClass = defineStore("scheduleClass", {
  state: () => ({
    scheduleClass: [

    ],
  }),
  getters: {

  },
  actions: {
    async fetchScheduleClass() {
      try {
        const { data } = await axios.get(`/planner/scheduleClass/getSchedule`)
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
            newHtml: scheduleClass.html,
            subject_id: scheduleClass.subject_id,
          },
        }
        await axios.post(`/planner/scheduleClass/postSchedule`, body)
        this.scheduleClass = this.scheduleClass.filter((scheduleClass) => scheduleClass.id !== scheduleClass.id)
        this.scheduleClass.push(scheduleClass)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteScheduleClass(start, end) {
      try {
        axios.delete(`/planner/scheduleClass/deleteSchedule?start=${start}&end=${end}`)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
  },
})