<template>
    <div class="d-flex justify-space-around">

        <v-dialog style="z-index: 200000" v-model="dialogLocal" fullscreen :scrim="false"
            transition="dialog-bottom-transition">
            <template v-slot:activator="{ props }">
                <v-btn color="#c026d3" icon="mdi-account" v-bind="props"></v-btn>
            </template>
            <v-card>
                <v-toolbar dark color="#c026d3">
                    <v-btn icon dark v-on:click="cancel">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Profil</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn variant="text" v-on:click="validate"> Enregistrer </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-list lines="two" subheader>
                    <v-list-subheader>Réglages </v-list-subheader>
                    <v-list-item title="Heure de début de la journée"> <v-text-field v-model="customElement.startHour"
                            type="number" style="width: 80px" density="compact" hide-details
                            variant="outlined"></v-text-field></v-list-item>
                    <v-list-item title="Nombres d'heures maximum par jour"> <v-text-field
                            v-model="customElement.maxEventHoursPerDay" type="number" style="width: 80px" density="compact"
                            hide-details variant="outlined"></v-text-field></v-list-item>
                    <v-list-item title="Heure de début de la pause"> <v-text-field
                            v-model="customElement.lunchBreakStartHour" type="number" style="width: 80px" density="compact"
                            hide-details variant="outlined"></v-text-field></v-list-item>
                    <v-list-item title="Heure de fin de la pause"> <v-text-field v-model="customElement.lunchBreakEndHour"
                            type="number" style="width: 80px" density="compact" hide-details
                            variant="outlined"></v-text-field></v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list lines="two" subheader>
                    <v-list-subheader>General</v-list-subheader>
                    <v-list-item title="Nom">{{
                        this.store.user.name
                    }}</v-list-item>
                    <v-list-item title="Email">{{
                        this.store.user.email
                    }}</v-list-item>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { user } from "../store/user";
export default {
    setup() {
        return {
            store: user(),
        };
    },
    props: {
        openProfil: Boolean,
    },
    data() {
        const customElement = {
            startHour: 0,
            lunchBreakStartHour: 0,
            lunchBreakEndHour: 0,
            maxEventHoursPerDay: 0,
        }
        return {
            dialogLocal: false,
            customElement,
        };
    },

    methods: {
        async validate() {
            this.updateProfil();
            this.dialogLocal = false;
            this.$emit("validated", this.customElement);
        },
        async cancel() {
            this.dialogLocal = false;
            await this.store.fetchUserProfil(localStorage.getItem("token"));
            this.customElement = this.store.user;
        },
        async updateProfil() {
            await this.store.postUserProfil(localStorage.getItem("token"), this.customElement)
        }
    },
    async beforeCreate() {
        await this.store.fetchUserProfil(localStorage.getItem("token"));
        this.customElement = this.store.user;
    },
};
</script>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.2s ease-in-out;
}
</style>
