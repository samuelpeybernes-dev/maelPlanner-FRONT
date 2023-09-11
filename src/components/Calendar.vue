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
      eventDeleteHandling: 'Update',
      eventMoveHandling: 'Update',
      eventResizeHandling: 'Update',
      eventClickHandling: 'Disabled',
      onTimeRangeSelected: this.onTimeRangeSelected,
      onEventDeleted: this.onEventDeleted,
      onEventMoved: this.onEventMoved,
      onEventResized: this.onEventResized,
    },
  };
},
methods: {
  async onTimeRangeSelected(args) {
    const modal = await DayPilot.Modal.prompt('Ajouter horaires décathlon:', 'Décathlon');
    const dp = args.control;
    dp.clearSelection();
    if (modal.canceled) {
      return;
    }
    const newEvent = {
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
    };
    dp.events.add(newEvent);
    const store = scheduleJob();
    store.postScheduleJob(newEvent);
  },
  onEventDeleted(args) {
    const store = scheduleJob();
    store.deleteScheduleJob(args.e.id());
    console.log('Horraire suprimmé: ' + args.e.text());
  },
  async onEventMoved(args) {
    const updatedEvent = {
      start: args.newStart,
      end: args.newEnd,
      text: args.e.text(),
      id: args.e.id(),
    };
    const store = scheduleJob();
    store.postScheduleJob(updatedEvent);
    console.log('Event moved: ' + args.e.text());
  },
  onEventResized(args) {
    const updatedEvent = {
      start: args.newStart,
      end: args.newEnd,
      text: args.e.text(),
      id: args.e.id(),
    };
    const store = scheduleJob();
    store.postScheduleJob(updatedEvent);
    console.log('Event resized: ' + args.e.text());
  },

  loadEvents() {  
      const events = this.events
      this.calendar.update( {events} ) 
    },
  }, 
  mounted: function () {
    this.loadEvents();
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

}

</script>
<style> 
@import '../assets/maeltheme.css';
</style>
