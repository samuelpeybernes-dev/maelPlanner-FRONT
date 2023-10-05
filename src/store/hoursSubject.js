import { defineStore } from 'pinia'
import { axiosAuth } from '../hook/axios'

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
            const { data } = await axiosAuth.get(`/hoursSubject/gethoursSubject`)
            this.hoursSubject = data.hoursSubject           
          }
          catch (error) {
            alert(error)
            console.log(error) 
        }
      },

    
  },
})