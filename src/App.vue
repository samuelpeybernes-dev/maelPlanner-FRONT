<template>
  <div id="app">
    <Calendar :store="store"/>
  </div>
</template>

<script >
import Calendar from './components/Calendar.vue'
import { scheduleJob } from './store/scheduleJob';

export default {
  components: {
      Calendar,
    },
    
    setup() {
      return {
        store : scheduleJob(),
      };
    }
   
}


</script>
