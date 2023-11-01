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
  <scheduleModal v-on:validated="addJob" v-on:canceled="cancelJob" :dialog="scheduleModal.dialogLocal"></scheduleModal>
  <div class="fixed bottom-4 right-4">
    <v-btn class="m-0.5" color="purple" icon="mdi-arrow-left" v-on:click="navigatePrevious"></v-btn>
    <v-btn class="m-0.5" color="purple" icon="mdi-calendar-today" v-on:click="navigateToday"></v-btn>
    <v-btn class="m-0.5" color="purple" icon="mdi-arrow-right" v-on:click="navigateNext"></v-btn>
    <popupMenu class="m-0.5" v-on:generated="addRandomScheduleClass"></popupMenu>
  </div>
</template>

<script>
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import getCurrentWeekDays from '../tools/utils/dates/getCurrentWeekDays.js'
import scheduleModal from './scheduleModal.vue'
import popupMenu from './popupMenu.vue'
import { scheduleJob } from '../store/scheduleJob';
import { scheduleClass } from '../store/scheduleClass';
import { hoursSubject } from '../store/hoursSubject';
export default {
  components: {
    DayPilotCalendar,
    scheduleModal,
    popupMenu,
  },
  setup() {
    return {
      store: scheduleJob(),
      classStore: scheduleClass(),
      hoursStore: hoursSubject(),
    };
  },
  computed: {
    calendar: function () {
      return this.$refs.calendar.control
    },
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Calendar',
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
        startDate: DayPilot.Date.today().firstDayOfWeek(1),
      },
      combinedEvents: [],
      scheduleModal: {
        title: "",
        selectedColor: '',
        dialogLocal: false,
        validated: false,
      },
      selectedTimeRangeArgs: null,
    };
  },
  methods: {
    navigatePrevious() {
      this.config.startDate = this.config.startDate.addDays(-7);
    },

    navigateNext() {
      this.config.startDate = this.config.startDate.addDays(7);
    },

    navigateToday() {
      this.config.startDate = DayPilot.Date.today();
    },
    cancelJob(scheduleModal) {
      const dp = this.selectedTimeRangeArgs.control;
      this.scheduleModal.dialogLocal = scheduleModal.dialogLocal;
      dp.clearSelection();
    },
    async addJob(scheduleModal) {
      this.scheduleModal.validated = scheduleModal.validated;
      if (scheduleModal.validated) {
        const modal = scheduleModal;
        const args = this.selectedTimeRangeArgs;
        const dp = args.control;
        const hours = format(new Date(args.start), 'HH:mm') + "-" + format(new Date(args.end), 'HH:mm');
        const newEvent = new DayPilot.Event({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.title,
          job: true,
          backColor: modal.selectedColor,
          borderColor: modal.selectedColor,
        });
        newEvent.client.html(modal.title + "<br><span style='font-weight: normal; font-size: 16px;'>" + hours + "</span>");

        dp.clearSelection();
        dp.events.add(newEvent);
        this.scheduleModal.dialogLocal = scheduleModal.dialogLocal;
        await this.store.postScheduleJob(newEvent.data);
      }
    },
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
      this.scheduleModal.dialogLocal = true;
      this.selectedTimeRangeArgs = args;

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
      const hours = format(new Date(args.newStart), 'HH:mm') + "-" + format(new Date(args.newEnd), 'HH:mm');
      const updatedEvent = new DayPilot.Event({
        start: args.newStart,
        end: args.newEnd,
        id: args.e.id(),
        text: args.e.text(),
        backColor: args.e.data.backColor,
        borderColor: args.e.data.borderColor,
        job: args.e.data.job,
        subject_id: args.e.data.subject_id,
      });
      updatedEvent.client.html(args.e.text() + "<br><span style='font-weight: normal; font-size: 16px;'>" + hours + "</span>");
      if (!args.e.data.job) {
        await this.classStore.postScheduleClass([updatedEvent.data]);

        this.updateCombinedEvents(this.classStore.scheduleClass);
        console.log('Event moved: ' + args.e.text());
      } else {
        await this.store.postScheduleJob(updatedEvent.data);
        this.updateCombinedEvents(this.store.scheduleJob);
        console.log('Event moved: ' + args.e.text());
      }
    },
    async onEventResized(args) {
      const hours = format(new Date(args.newStart), 'HH:mm') + "-" + format(new Date(args.newEnd), 'HH:mm');
      const updatedEvent = new DayPilot.Event({
        start: args.newStart,
        end: args.newEnd,
        id: args.e.id(),
        text: args.e.text(),
        backColor: args.e.data.backColor,
        borderColor: args.e.data.borderColor,
        job: args.e.data.job,
      });
      updatedEvent.client.html(args.e.text() + "<br><span style='font-weight: normal; font-size: 16px;'>" + hours + "</span>");
      if (!args.e.data.job) {
        console.log('Cannot resize: ' + args.e.text());
      } else {
        await this.store.postScheduleJob(updatedEvent.data);
        this.updateCombinedEvents(this.store.scheduleJob);
        console.log('Event resized: ' + args.e.text());
      }
    },
    async loadEvents() {
      await this.store.fetchScheduleJob();
      this.combinedEvents.push(...this.store.scheduleJob);

      await this.classStore.fetchScheduleClass();
      this.combinedEvents.push(...this.classStore.scheduleClass);
    },
    async addRandomScheduleClass() {
      const startWeek = new Date(this.config.startDate);
      const endWeek = new Date(this.config.startDate.addDays(6));
      endWeek.setHours(23, 0, 0, 0);
      const { formatedStartDate: start, formatedEndDate: end } = this.formatDate(startWeek, endWeek);
      await this.classStore.deleteScheduleClass(start, end);

      const maxEventHoursPerDay = 8;
      const maxEventHoursPerSubject = 2; // Limite de 2 heures par événement
      const minEventHoursPerSubject = 1; // Minimum de 1 heure par événement
      const minEventHoursFor30MinWeekHours = 0.5; // Minimum de 30 minutes si weekHours est de 30 minutes
      const lunchBreakStartHour = 12;
      const lunchBreakEndHour = 13;
      let previousSubject = null;
      this.isLoading = true;
      const newEvents = [];
      const weekDays = getCurrentWeekDays(this.config.startDate);
      // On récupere les heures disponibles pour chaque matière
      await this.hoursStore.fetchHoursSubject();

      // Pour chaque jour de la semaine
      for (const day of weekDays) {
        let remainingEventHours = maxEventHoursPerDay;
        let startDate = new Date(day.date);
        let subject = null;
        // On s'assure que le premier événement commence à 9h
        startDate.setHours(9, 0, 0, 0);

        // Tant qu'il reste des heures d'événement à ajouter
        while (remainingEventHours > 0) {

          // Détermine la matière aléatoire à utiliser
          const randomSubjectResult = this.getRandomSubject(previousSubject);
          if (randomSubjectResult !== null && randomSubjectResult.subject !== null) {
            subject = randomSubjectResult.subject;
            const { previousSubject: updatedPreviousSubject } = randomSubjectResult;
            previousSubject = updatedPreviousSubject;
          } else {
            break;
          }

          // Détermine la durée aléatoire d'un événement
          var { eventDuration, endDate } = this.getRandomHours(subject, remainingEventHours, maxEventHoursPerSubject, minEventHoursPerSubject, minEventHoursFor30MinWeekHours, startDate)

          // Vérifiez si un événement d'une heure peut être ajouté entre 11h et 12h
          if (startDate.getHours() === (lunchBreakStartHour - 1) && eventDuration > 1) {
            eventDuration = 1;
            endDate.setHours(startDate.getHours() + 1, startDate.getMinutes(), 0, 0);
          }


          // Empeche l'ajout d'un événement à la pause déjeuner
          if (this.isEventBetweenDates(startDate, endDate, lunchBreakStartHour, lunchBreakEndHour)) {
            const lunchBreakHours = lunchBreakEndHour - startDate.getHours();
            const lunchBreakMinutes = startDate.getMinutes();
            startDate.setHours(lunchBreakEndHour, 0, 0, 0);
            endDate.setHours(endDate.getHours() + lunchBreakHours, endDate.getMinutes() - lunchBreakMinutes, 0, 0);
          }
          let isOverlap = false;
          const { formatedStartDate, formatedEndDate } = this.formatDate(startDate, endDate);
          for (const jobEvent of this.store.scheduleJob) {
            if (this.isEventOverlap({ start: formatedStartDate, end: formatedEndDate }, jobEvent)) {
              isOverlap = true;
              break;
            }
          }

          if (!isOverlap) {
            // Aucun chevauchement trouvé, ajoutez l'événement de classe
            const hours = format(new Date(startDate), 'HH:mm') + "-" + format(new Date(endDate), 'HH:mm');
            const newEvent = new DayPilot.Event({
              id: DayPilot.guid(),
              start: formatedStartDate,
              end: formatedEndDate,
              text: subject.text,
              backColor: subject.backColor,
              borderColor: subject.borderColor,
              subject_id: subject._id,
            });
            newEvent.client.html(subject.text + "<br><span style='font-weight: normal; font-size: 16px;'>" + hours + "</span>");
            newEvents.push(Object.assign({}, newEvent.data));
            // Mettez à jour les heures restantes pour cette matière
            subject.weekHours -= eventDuration;
            // Mettez à jour les heures restantes pour la journée
            remainingEventHours -= eventDuration;
          } else {
            remainingEventHours -= eventDuration;
          }
          startDate = new Date(endDate);
        }
      }
      this.combinedEvents = [];

      await this.classStore.postScheduleClass(newEvents);
      await this.loadEvents();
      this.calendar.update({ events: this.combinedEvents });
      this.isLoading = false;

    },
    isEventOverlap(event1, event2) {
      const start1 = new Date(event1.start);
      const end1 = new Date(event1.end);
      const start2 = new Date(event2.start);
      const end2 = new Date(event2.end);

      // Vérifiez si event1 commence après que event2 ne se termine
      // ou si event1 se termine avant que event2 ne commence, ce qui signifie qu'ils ne se chevauchent pas
      if (start1 >= end2 || end1 <= start2) {
        return false;
      }

      // S'ils se chevauchent, retournez vrai
      return true;
    },
    getRandomHours(subject, remainingEventHours, maxEventHoursPerSubject, minEventHoursPerSubject, minEventHoursFor30MinWeekHours, startDate) {
      let eventDuration
      let halfHour
      const maxEventHours = Math.min(
        remainingEventHours,
        subject.weekHours,
        maxEventHoursPerSubject
      );
      if (subject.weekHours === 0.5) {
        eventDuration = 1
        halfHour = 30
      } else {
        eventDuration = Math.max(minEventHoursPerSubject, maxEventHours)
        halfHour = 0
      }
      // Calcul de endDate en ajoutant eventDuration à startDate
      const endDate = new Date(startDate)
      endDate.setHours(startDate.getHours() + (subject.weekHours === 0.5 ? 0 : eventDuration), startDate.getMinutes() + halfHour, 0, 0)
      return { eventDuration, endDate }
    },
    getRandomSubject(previousSubject) {
      const availableSubjects = this.hoursStore.hoursSubject.filter(
        (subject) => subject.weekHours > 0 && subject !== previousSubject
      );
      if (availableSubjects.length === 0) {
        // Toutes les matières sont déjà utilisées, mais nous continuons avec la matière actuelle s'il y en a une.
        if (previousSubject !== null && previousSubject.weekHours > 0) {
          return { subject: previousSubject, previousSubject };
        } else {
          return null; // Toutes les matières sont épuisées.
        }
      }
      const subject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];

      // Mettez à jour la matière de l'événement précédent
      previousSubject = subject;

      return { subject, previousSubject };
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
    updateCombinedEvents(sourceList) {
      this.combinedEvents = this.combinedEvents.filter((existingItem) => {
        return !sourceList.some((newItem) => newItem.id === existingItem.id);
      });
      this.combinedEvents.push(...sourceList);
      this.calendar.update({ events: this.combinedEvents });
    },

  },


  mounted: async function () {
    this.isLoading = true;
    await this.loadEvents();
    this.calendar.update({ events: this.combinedEvents });
    this.isLoading = false;
  },
}

</script>
<style> @import '../assets/maeltheme.css';
</style>
