<template>
  <div id="app">
    <Calendar :scheduleJobs="scheduleJobs"/>
  </div>
</template>

<script >
import Calendar from './components/Calendar.vue'
import { ref, onMounted, computed } from "vue";
import { scheduleJob } from "./store/scheduleJob";

export default {
  components: {
      Calendar,
    },
  setup(){
    const store = scheduleJob();

    const scheduleJobs = computed(() => {
      return store.scheduleJob.scheduleJob;
    });

    onMounted(() => {
      store.fetchScheduleJob();
      });

      return {
      scheduleJobs,
      
    };
  }
}


</script>
