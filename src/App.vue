<template>
  <div id="app">
    <Calendar :store="store" :classStore="classStore" :hoursStore="hoursStore" />
  </div>
</template>

<script >
import Calendar from './components/Calendar.vue'
import { scheduleJob } from './store/scheduleJob';
import { scheduleClass } from './store/scheduleClass';
import { hoursSubject } from './store/hoursSubject';

export default {
  components: {
      Calendar,
    },
    
    setup() {
      return {
        store : scheduleJob(),
        classStore : scheduleClass(),
        hoursStore : hoursSubject(),
      };
    }
   
}


</script>
