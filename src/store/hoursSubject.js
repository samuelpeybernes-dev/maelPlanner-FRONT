import { defineStore } from 'pinia'
import axios from "axios"

export const hoursSubject = defineStore("hoursSubject",{
    state: () => ({
      hoursSubject: [
            
          ],
    }),
    getters: {

    },
    actions: {
      async fetchHoursSubject() {
        try {
            const { data } = await axios.get(`/planner/hoursSubject/gethoursSubject`)
            this.hoursSubject = data.hoursSubject           
          }
          catch (error) {
            alert(error)
            console.log(error) 
        }
      },

    
  },
})