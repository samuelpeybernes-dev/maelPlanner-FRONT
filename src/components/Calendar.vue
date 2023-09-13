<template>
  <DayPilotCalendar :config="config" ref="calendar" />
</template>

<script>
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
export default {
  name: 'Calendar',
  props: {
    store: {
      type: Object,
      required: true,
    },
    classStore: {
      type: Object,
      required: true,
    },
  },
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
        onBeforeEventRender: this.onBeforeEventRender
      },
      combinedEvents: [],
    };
  },
  methods: {
    async onBeforeEventRender(args){
      if (!args.data.job) {
        args.data.deleteDisabled = true;
        args.data.resizeDisabled = true;
      } else {
        args.data.deleteDisabled = false;
        args.data.resizeDisabled = false;
      }
    },
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
        job: true,
      };
      dp.events.add(newEvent);
      await this.store.postScheduleJob(newEvent);
    },
    async onEventDeleted(args) {     
      if (!args.e.data.job) {
        console.log('Cannot delete: ' + args.e.text());
      } else {
        await this.store.deleteScheduleJob(args.e.id());
        console.log('Horraire suprimmé: ' + args.e.text());
      }
    },
    async onEventMoved(args) {
      const updatedEvent = {
        start: args.newStart,
        end: args.newEnd,
        id: args.e.id(),
        text: args.e.text(),
        job: args.e.data.job,
      };
      if (args.e.data.job) {
        await this.store.postScheduleJob(updatedEvent);
        console.log('Event moved: ' + args.e.text());
      } else {

      }
    },
    async onEventResized(args) {
      const updatedEvent = {
        start: args.newStart,
        end: args.newEnd,
        id: args.e.id(),
        text: args.e.text(),
        job: args.e.data.job,
      };
      if (!args.e.data.job) {
        console.log('Cannot resize: ' + args.e.text());
      } else {
        await this.store.postScheduleJob(updatedEvent);
        console.log('Event resized: ' + args.e.text());
      }
    },

    async loadJobEvents() {
      if (this.store.scheduleJob.length === 0) {
        await this.store.fetchScheduleJob();
      }
      this.combinedEvents.push(...this.store.scheduleJob);
    },
    async loadClassEvents() {
      if (this.classStore.scheduleClass.length === 0) {
        await this.classStore.fetchScheduleClass()   
      }
      this.combinedEvents.push(...this.classStore.scheduleClass);
    },
  },

  mounted: async function () {
    await this.loadJobEvents();
    await this.loadClassEvents();
    this.calendar.update({ events: this.combinedEvents });
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
<style> @import '../assets/maeltheme.css';
</style>
