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
            const { data } = await axios.get(`http://127.0.0.1:1631/api/v1/hoursSubject/gethoursSubject`)
            this.hoursSubject = data.hoursSubject           
          }
          catch (error) {
            alert(error)
            console.log(error) 
        }
      },

    
  },
})