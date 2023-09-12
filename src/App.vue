<template>
  <div id="app">
    <Calendar :store="store" :classStore="classStore"/>
  </div>
</template>

<script >
import Calendar from './components/Calendar.vue'
import { scheduleJob } from './store/scheduleJob';
import { scheduleClass } from './store/scheduleClass';

export default {
  components: {
      Calendar,
    },
    
    setup() {
      return {
        store : scheduleJob(),
        classStore : scheduleClass(),
      };
    }
   
}


</script>
