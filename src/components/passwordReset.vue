<template>
    <div class="my-40">
        <v-img class="mx-auto my-1" max-width="100" src="/calendar-96.ico"></v-img>
        <h2
            class="mb-5 text-center md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-800 via-fuchsia-400 to-pink-600 font-extrabold">
            Nouveau mot de passe</h2>
        <v-form ref="form">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                    Mot de passe
                </div>

                <v-text-field :rules="pswRules" v-model="userData.password"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Entre ton mot de passe" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" @click:append-inner="visible = !visible"></v-text-field>

                <v-btn @click="validate" block class="mb-8" color="blue" size="large" variant="tonal">
                    Changer le mot de passe
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
        const userData = {
            password: '',
            userId: this.$route.query.id,
            token: this.$route.query.token
        }
        return {
            visible: false,
            userData,
            alert: false,
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
                const res = await this.user.resetPassword(this.userData)
                if (res?.code === "ERR_BAD_REQUEST") this.alert = true
                else this.$router.push({ name: "Login" })
            }
        },

    },
};
</script>

