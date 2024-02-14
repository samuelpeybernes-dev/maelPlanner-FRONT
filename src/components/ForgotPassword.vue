<template>
    <div class="my-40">
        <v-img class="mx-auto my-1" max-width="100" src="/calendar-96.ico"></v-img>
        <h2
            class="mb-5 text-center md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-800 via-fuchsia-400 to-pink-600 font-extrabold">
            Ton adresse email ?</h2>
        <v-form ref="form">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">

                <div class="text-subtitle-1 text-medium-emphasis">Email</div>

                <v-text-field density="compact" placeholder="Adresse email" prepend-inner-icon="mdi-email-outline"
                    variant="outlined" v-model="email" :rules="emailRules"></v-text-field>

                <v-btn @click="validate" block class="mb-8" color="blue" size="large" variant="tonal">
                    Envoi du mail de récupération
                </v-btn>
                <v-alert v-model="alert" color="error" icon="$error" title="Oups 🤔"
                    text="Il semblerait qu'il y ait une erreur"></v-alert>
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
        return {
            visible: false,
            email: "",
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
        };
    },
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                const res = await this.user.resetPasswordRequest(this.email)
                if (res?.code === "ERR_BAD_REQUEST") this.alert = true
                else this.$router.push('/login')
            }
        },

    },
};
</script>

