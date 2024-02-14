<template>
  <div class="my-40">
    <v-img class="mx-auto my-1" max-width="100" src="/calendar-96.ico"></v-img>
    <h2
      class="mb-5 text-center md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-800 via-fuchsia-400 to-pink-600 font-extrabold">
      Mael Planner</h2>
    <v-form ref="form">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>

        <v-text-field density="compact" placeholder="Adresse email" prepend-inner-icon="mdi-email-outline"
          variant="outlined" v-model="userData.email" :rules="emailRules"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Mot de passe
        </div>

        <v-text-field :rules="pswRules" v-model="userData.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
          placeholder="Entre ton mot de passe" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>
        <v-card-text class="p-0 pb-1">
          <router-link class="text-grey text-decoration-none" to="/forgotPassword">Mot de passe oublié ?</router-link>
        </v-card-text>
        <v-btn @click="validate" block class="mb-8" color="blue" size="large" variant="tonal">
          Se connecter
        </v-btn>
        <v-alert v-model="alert" color="error" icon="$error" title="Essaie de te rappeler 🙄"
          text="Mauvais email ou mot de passe"></v-alert>
        <v-card-text class="text-center">
          <router-link class="text-blue text-decoration-none" to="/register">S'inscrire<v-icon
              icon="mdi-chevron-right"></v-icon></router-link>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { user } from '../store/user';
export default {
  setup() {
    return {
      user: user()
    };
  },
  data() {
    const userData = {
      email: '',
      password: '',
    }

    return {
      visible: false,
      userData,
      alert: false,
      emailRules: [
        value => {
          if (value) return true

          return "L'email est requis."
        },
        value => {
          if (/.+@.+\..+/.test(value)) return true

          return "L'email n'est pas valide."
        },
      ],
      pswRules: [
        value => {
          if (value) return true

          return 'Mot de passe est requis.'
        },
      ],
    };
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        await this.user.postLogin(this.userData)
        this.goToCalendar()
      }
    },
    goToCalendar() {
      if (this.user.user.auth) {
        this.$router.push({ name: "Calendar" })
      } else {
        this.alert = true
      }
    },
  },
}
</script>