<template>
  <div id="app">
    <Calendar :events="scheduleJobs"/>
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
      const storedData = localStorage.getItem('scheduleJobs');
      return storedData ? JSON.parse(storedData) : store.scheduleJob;
    });
 
    onMounted(async () => {   
      await store.fetchScheduleJob();
      localStorage.setItem('scheduleJobs', JSON.stringify(store.scheduleJob));
      });   
      
      

      return {
      scheduleJobs,
      
    };
  }
   
}


</script>
