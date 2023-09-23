
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './index.css'
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
})

createApp(App)
  .use(vuetify)
  .use(createPinia())
  .mount('#app')

