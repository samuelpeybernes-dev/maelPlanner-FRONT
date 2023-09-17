<template>
  <DayPilotCalendar :config="config" ref="calendar" />
  <div v-show="isLoading"
    class="fixed h-full w-full bg-fuchsia-300 bg-opacity-25 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-progress-circular class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" indeterminate
          color="#c026d3" width="12" size="128"></v-progress-circular>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
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
      isLoading: false,
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
        onBeforeEventRender: this.onBeforeEventRender,
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
      this.isLoading = true;
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

      let previousSubject = null;
      const getRandomSubject = () => {

        const availableSubjects = this.hoursStore.hoursSubject.filter(
          (subject) => subject.weekHours > 0 && subject !== previousSubject
        );
        if (availableSubjects.length === 0) {
          return null; // Toutes les matières sont déjà utilisées
        }
        const selectedSubject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];

        // Mettez à jour la matière de l'événement précédent
        previousSubject = selectedSubject;

        return selectedSubject;
      };

      for (const day of weekDays) {
        let remainingEventHours = maxEventHoursPerDay;
        let startDate = new Date(day.date);

        // Assurez-vous que le premier événement commence à 9h
        startDate.setHours(9, 0, 0, 0);

        while (remainingEventHours > 0) {
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

          // Vérifiez si un événement d'une heure peut être ajouté entre 11h et 12h
          if (startDate.getHours() === (lunchBreakStartHour - 1) && eventDuration > 1) {
            // Mise à jour de l'événement actuel pour durer une heure
            eventDuration = 1;
            endDate.setHours(startDate.getHours() + 1, startDate.getMinutes(), 0, 0);
          }

          if (this.isEventBetweenDates(startDate, endDate, lunchBreakStartHour, lunchBreakEndHour)) {
            const lunchBreakHours = lunchBreakEndHour - startDate.getHours();
            startDate.setHours(lunchBreakEndHour, 0, 0, 0);
            endDate.setHours(endDate.getHours() + lunchBreakHours, endDate.getMinutes(), 0, 0);
          }

          const { formatedStartDate, formatedEndDate } = this.formatDate(startDate, endDate)
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
      this.isLoading = false;
    },
    formatDate(startDate, endDate) {
      const timeZone = 'Europe/Paris'
      const zonedStartDate = utcToZonedTime(startDate, timeZone)
      const zonedEndtDate = utcToZonedTime(endDate, timeZone)
      const formatedStartDate = format(zonedStartDate, "yyyy-MM-dd'T'HH:mm:ss")
      const formatedEndDate = format(zonedEndtDate, "yyyy-MM-dd'T'HH:mm:ss")
      return { formatedStartDate, formatedEndDate }
    },
    isEventBetweenDates(dateDebut, dateFin, heureDebut, heureFin) {
      const dateHeureDebut = new Date(dateDebut);
      const dateHeureFin = new Date(dateFin);

      // Utilisez les entiers pour les heures de début et de fin
      dateHeureDebut.setHours(heureDebut, 0, 0);
      dateHeureFin.setHours(heureFin, 0, 0);

      // Vérification des heures
      return dateHeureDebut < dateFin && dateDebut < dateHeureFin;
    },

    getCurrentWeekDays() {
      const currentDate = new Date();
      const currentDayOfWeek = currentDate.getDay(); // Jour de la semaine actuel (0 = Dimanche, 1 = Lundi, ...)

      // Si c'est un dimanche (currentDayOfWeek === 0), ajustez la date pour obtenir la semaine actuelle
      if (currentDayOfWeek === 0) {
        currentDate.setDate(currentDate.getDate() - 6); // Remonter de 6 jours pour obtenir le lundi de la semaine actuelle
      } else {
        currentDate.setDate(currentDate.getDate() - currentDayOfWeek + 1); // Réglez la date sur le lundi de la semaine actuelle
      }

      const weekDays = [];
      for (let i = 1; i < 8; i++) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i);
        weekDays.push({
          dayOfWeek: i, // 0 pour Lundi, 1 pour mardi, ...
          date: day.toISOString().split('T')[0], // Date au format 'YYYY-MM-DD'
        });
      }
      return weekDays;
    }

  },


  mounted: async function () {
    this.getCurrentWeekDays();
    await this.loadJobEvents();
    await this.loadClassEvents();

    this.calendar.update({ events: this.combinedEvents });
  },
}

</script>
<style> @import '../assets/maeltheme.css';
</style>
