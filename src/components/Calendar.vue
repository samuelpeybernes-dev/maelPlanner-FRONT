<template>
  <DayPilotCalendar :config="config" ref="calendar" />
</template>

<script>
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
import { format } from 'date-fns'
export default {
  components: {
    DayPilotCalendar,
  },
  computed: {
    // DayPilot.Calendar object - https://api.daypilot.org/daypilot-calendar-class/
    calendar: function () {
      return this.$refs.calendar.control
    },
  },
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
    hoursStore: {
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
    async onBeforeEventRender(args) {
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
      await this.addRandomScheduleClass();
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
        subject_id: args.e.data.subject_id,
      };
      if (!args.e.data.job) {
        await this.classStore.postScheduleClass(updatedEvent);
        console.log('Event moved: ' + args.e.text());
      } else {
        await this.store.postScheduleJob(updatedEvent);
        console.log('Event moved: ' + args.e.text());
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
        await this.classStore.fetchScheduleClass();
        this.combinedEvents.push(...this.classStore.scheduleClass);

        // Maintenant que nous avons ajouté les événements, nous pouvons formater les couleurs
        this.formatEventColors(this.classStore.scheduleClass);
      }
    },
    formatEventColors(events) {
      for (const event of events) {
        const subject = event.subject?.[0];
        if (subject && subject.backColor && subject.borderColor) {
          // Affectation des couleurs directement
          event.backColor = subject.backColor;
          event.borderColor = subject.borderColor;
        }
      }
    },
    async addRandomScheduleClass() {
      const currentDate = new Date();
      const weekDays = this.getCurrentWeekDays();

      if (!this.hoursStore.hoursSubject || this.hoursStore.hoursSubject.length === 0) {
        await this.hoursStore.fetchHoursSubject();
      }

      const maxEventHoursPerDay = 8;
      const maxEventHoursPerSubject = 2; // Limite de 2 heures par événement
      const minEventHours = 1; // Minimum de 1 heure par événement
      const minEventHoursFor30MinWeekHours = 0.5; // Minimum de 30 minutes si weekHours est de 30 minutes
      const lunchBreakStartHour = 12;
      const lunchBreakEndHour = 13;

      const getRandomHour = () => {
        return Math.floor(Math.random() * (lunchBreakStartHour - 9)) + 9; // Commence entre 9h et lunchBreakStartHour
      };

      const getRandomSubject = () => {
        const availableSubjects = this.hoursStore.hoursSubject.filter(
          (subject) => subject.weekHours > 0
        );
        if (availableSubjects.length === 0) {
          return null; // Toutes les matières sont déjà utilisées
        }
        return availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
      };

      for (const day of weekDays) {
        let remainingEventHours = maxEventHoursPerDay;
        let startDate = new Date(day.date);

        // Assurez-vous que le premier événement commence à 9h
        startDate.setHours(9, 0, 0, 0);

        while (remainingEventHours > 0) {
          const randomStartHour = getRandomHour();
          const subject = getRandomSubject();

          if (!subject) {
            break; // Plus de matières disponibles pour la journée
          }

          const maxEventHours = Math.min(
            remainingEventHours,
            subject.weekHours,
            maxEventHoursPerSubject // Limite de 2 heures par événement
          );

          // Détermine la durée minimale en fonction de weekHours
          let eventDuration;
          let halfHour;
          if (subject.weekHours === 0.5) {
            eventDuration = Math.max(minEventHoursFor30MinWeekHours, maxEventHours);
            halfHour = 30;
          } else {
            eventDuration = Math.max(minEventHours, maxEventHours);
            halfHour = 0;
          }

          // Calcul de endDate en ajoutant eventDuration à startDate
          const endDate = new Date(startDate);
          endDate.setHours(startDate.getHours() + (subject.weekHours === 0.5 ? 0 : eventDuration), startDate.getMinutes() + halfHour, 0, 0);

          if (
              (endDate.getHours() >= lunchBreakStartHour && endDate.getMinutes() > 0) || // Si l'heure de fin est après 12h01
              endDate.getHours() === lunchBreakEndHour
            ) {
            const lunchBreak = lunchBreakEndHour - startDate.getHours();
            startDate.setHours(lunchBreakEndHour, 0, 0, 0);
            endDate.setHours(endDate.getHours() + lunchBreak, 0, 0, 0);
          }


          const formatedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
          const formatedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
          // Créez un nouvel événement avec les dates générées
          const newEvent = {
            id: DayPilot.guid(),
            start: formatedStartDate,
            end: formatedEndDate,
            text: subject.text,
            subject_id: subject._id,
          };

          // Ajoutez cet événement via postScheduleClass
          await this.classStore.postScheduleClass(Object.assign({}, newEvent));

          // Mettez à jour les heures restantes pour cette matière
          subject.weekHours -= eventDuration;

          // Mettez à jour les heures restantes pour la journée
          remainingEventHours -= eventDuration;

          // Mettez à jour la date de début pour le prochain événement
          startDate = new Date(endDate);
        }
      }
    },


    getCurrentWeekDays() {
      const currentDate = new Date();
      const currentDayOfWeek = currentDate.getDay(); // Jour de la semaine actuel (0 = Lundi , 1 = Mardi, ...)
      currentDate.setDate(currentDate.getDate() - currentDayOfWeek + 1); // Réglez la date sur le lundi de la semaine actuelle

      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i);
        weekDays.push({
          dayOfWeek: i, // 0 pour Lundi, 1 pour mardi, ...
          date: day.toISOString().split('T')[0], // Date au format 'YYYY-MM-DD'
        });
      }
      return weekDays;


    },

  },


  mounted: async function () {
    //this.getCurrentWeekDays()
    //await this.addRandomScheduleClass();
    await this.loadJobEvents();
    await this.loadClassEvents();

    this.calendar.update({ events: this.combinedEvents });
  },
}

</script>
<style> @import '../assets/maeltheme.css';
</style>
