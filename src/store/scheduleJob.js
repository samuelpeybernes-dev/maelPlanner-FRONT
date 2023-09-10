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
              backColor: "testb",
              borderColor: "aaaa"
            },
          ],
    }),
    getters: {

    },
    actions: {
      async fetchScheduleJob() {
        try {
            const { data } = await axios.get(`http://127.0.0.1:1631/api/v1/scheduleJob/getSchedule?id=1`)
            this.scheduleJob = data
           
          }
          catch (error) {
            alert(error)
            console.log(error)
        }
      },

      postProjectNotePersonalization({ commit, state }, ProjectNotesPersonalization) {
        commit('POST_PROJECT_NOTE_PERSO', ProjectNotesPersonalization)
        // Met à jour les légendes dans le state
        const updatedPriority = {
          priorityId: ProjectNotesPersonalization.priorityId,
          label: ProjectNotesPersonalization.newLabel,
          color: state.defaultPriorities[ProjectNotesPersonalization.priorityId].color,
        }
        commit('UPDATE_PRIORITY', updatedPriority)
        // Met à jour les légendes dans la bdd
        const body = {
          ProjectNotesPersonalizationJoi: {
            empUsername: ProjectNotesPersonalization.empUsername,
            priorityId: state.defaultPriorities[ProjectNotesPersonalization.priorityId].priorityId,
            newLabel: ProjectNotesPersonalization.newLabel,
            newColor: state.defaultPriorities[ProjectNotesPersonalization.priorityId].color,
          },
        }
    
        this.$axios.post(`/bagdad/projectNotes/postLabel`, body)
      },
    },
})