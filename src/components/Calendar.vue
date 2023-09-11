<template>
  <DayPilotCalendar :config="config" ref="calendar" />
</template>

<script>
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
import { scheduleJob } from "../store/scheduleJob";
export default {
  name: 'Calendar',
  
  data() {
    return {
      config: {
        locale: 'fr-fr',
        viewType: 'Week',
        theme: 'maeltheme',
        businessBeginsHour: 7,
        businessEndsHour: 23,
        headerDateFormat: 'ddd d/M/yyyy',
        timeRangeSelectedHandling: 'Enabled',
        onTimeRangeSelected: async args => {
          const modal = await DayPilot.Modal.prompt('Ajouter horraires décathlon:', 'Décathlon')
          const dp = args.control
          dp.clearSelection()
          if (modal.canceled) {
            return
          }
          const newEvent = {
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result,
          }

          dp.events.add(newEvent)
          const store = scheduleJob();
          store.postScheduleJob(newEvent)
        },
        eventDeleteHandling: 'Update',
        onEventDeleted: args => {
          const store = scheduleJob();
          store.deleteScheduleJob(args.e.id())
          console.log('Horraire suprimmé: ' + args.e.text())
        },
        eventMoveHandling: 'Update',
        onEventMoved: async args => { 
          const updatedEvent = {
            start: args.newStart,
            end: args.newEnd,
            text: args.e.text(),
            id: args.e.id(),
          }
          const store = scheduleJob();
          store.postScheduleJob(updatedEvent)
          console.log('Event moved: ' + args.e.text())
        },
        eventResizeHandling: 'Update',  
        onEventResized: args => {
          const updatedEvent = {
            start: args.newStart,
            end: args.newEnd,
            text: args.e.text(),
            id: args.e.id(),
          }
          const store = scheduleJob();
          store.postScheduleJob(updatedEvent)
          console.log('Event resized: ' + args.e.text())
        },
        eventClickHandling: 'Disabled',
      },
    }
  },

  props: {
    events: {
    type: Array,
    },
  },
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
      const events = this.events
      this.calendar.update( {events} ) 
    },
  }, 
  mounted: function () {
    this.loadEvents();
  },
  
 
}

</script>
<style> 
@import '../assets/maeltheme.css';
</style>
