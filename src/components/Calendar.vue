<template>
  <DayPilotCalendar :config="config" ref="calendar" />
</template>

<script>
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'

export default {
  name: 'Calendar',
  data: function () {
    return {
      config: {
        locale: 'fr-fr',
        viewType: 'Week',
        theme: 'maeltheme',
        businessBeginsHour: 7,
        businessEndsHour: 23,
        headerDateFormat: 'ddd M/d/yyyy',
        timeRangeSelectedHandling: 'Enabled',
        onTimeRangeSelected: async args => {
          const modal = await DayPilot.Modal.prompt('Ajouter horraires décathlon:', 'Décathlon')
          const dp = args.control
          dp.clearSelection()
          if (modal.canceled) {
            return
          }
          dp.events.add({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result,
          })
        },
        eventDeleteHandling: 'Update',
        onEventDeleted: args => {
          console.log('Horraire suprimmé: ' + args.e.text())
        },
        eventMoveHandling: 'Update',
        onEventMoved: args => {
          console.log('Event moved: ' + args.e.text())
        },
        eventResizeHandling: 'Update',
        onEventResized: args => {
          console.log('Event resized: ' + args.e.text())
        },
        eventClickHandling: 'Disabled',
      },
    }
  },
  props: {},
  components: {
    DayPilotCalendar,
  },
  computed: {
    // DayPilot.Calendar object - https://api.daypilot.org/daypilot-calendar-class/
    calendar: function () {
      return this.$refs.calendar.control
    },
  },
  methods: {
    loadEvents() {
      const events = [
        {
          id: 1,
          start: '2023-09-04T08:00:00',
          end: '2023-09-04T11:00:00',
          text: 'Biochimie ',
          backColor: '#fac4fa',
          borderColor: '#fac4fa',
        },
        {
          id: 2,
          start: '2023-09-04T11:00:00',
          end: '2023-09-04T12:30:00',
          text: 'Eco-gestion',
          backColor: '#e2b172',
          borderColor: '#e2b172',
        },
        {
          id: 3,
          start: '2023-09-04T13:00:00',
          end: '2023-09-04T16:00:00',
          text: 'Nutri-Ali',
          backColor: '#479bd3',
          borderColor: '#479bd3',
        },
        {
          id: 4,
          start: '2023-09-04T16:00:00',
          end: '2023-09-04T18:00:00',
          text: 'ATA',
          backColor: '#f56e6e',
          borderColor: '#f56e6e',
        },
        {
          id: 5,
          start: '2023-09-04T18:30:00',
          end: '2023-09-04T20:15:00',
          text: 'COURSES',
          backColor: '#bad6f7',
          borderColor: '#bad6f7',
        },
        {
          id: 6,
          start: '2023-09-04T21:15:00',
          end: '2023-09-04T22:30:00',
          text: 'FICHES',
          backColor: '#a8a8a8',
          borderColor: '#a8a8a8',
        },
      ]
      this.calendar.update({ events })
    },
  },
  mounted: function () {
    this.loadEvents()
  },
}
</script>
<style>
@import '../assets/maeltheme.css';
</style>
