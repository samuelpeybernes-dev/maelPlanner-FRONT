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
                        <v-btn v-bind="false" variant="text" v-on:click="validate"> Enregistrer </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-tabs v-model="tab" bg-color="#c026d3">
                    <v-tab value="one">Compte</v-tab>
                    <v-tab value="two">Matières</v-tab>
                    <v-tab value="three">Réglages</v-tab>
                </v-tabs>

                <v-window v-model="tab">

                    <v-window-item value="one">
                        <v-list lines="one" subheader>
                            <v-list-subheader>Compte</v-list-subheader>
                            <v-list-item title="Prénom">{{
                                this.store.user.firstName
                            }}</v-list-item>
                            <v-list-item title="Nom">{{
                                this.store.user.name
                            }}</v-list-item>
                            <v-list-item title="Email">{{
                                this.store.user.email
                            }}</v-list-item>
                            
                            <v-btn v-if="!isPasswordRequest" class="ml-3" color="grey" v-on:click="resetPassword">
                                Changer le mot de passe
                            </v-btn>
                            <div class="d-inline-block pl-[16px]" v-else >
                                Mail de reinitialisation envoyé
                                <v-icon icon="mdi-check-circle" color="green"></v-icon>
                            </div>

                            <v-btn class="ml-3" color="red" v-on:click="logout">
                                Déconnexion
                            </v-btn>
                        </v-list>
                    </v-window-item>

                    <v-window-item value="two">
                        <v-list lines="two" subheader>
                            <classSelector></classSelector>
                        </v-list>
                    </v-window-item>

                    <v-window-item value="three">
                        <v-list lines="three" subheader>
                            <v-list-subheader>Réglages </v-list-subheader>
                            <v-list-item title="Heure de début de la journée"> <v-text-field
                                    v-model="customElement.startHour" type="number" style="width: 80px" density="compact"
                                    hide-details variant="outlined"></v-text-field></v-list-item>
                            <v-list-item title="Nombres d'heures maximum par jour"> <v-text-field
                                    v-model="customElement.maxEventHoursPerDay" type="number" style="width: 80px"
                                    density="compact" hide-details variant="outlined"></v-text-field></v-list-item>
                            <v-list-item title="Heure de début de la pause"> <v-text-field
                                    v-model="customElement.lunchBreakStartHour" type="number" style="width: 80px"
                                    density="compact" hide-details variant="outlined"></v-text-field></v-list-item>
                            <v-list-item title="Heure de fin de la pause"> <v-text-field
                                    v-model="customElement.lunchBreakEndHour" type="number" style="width: 80px"
                                    density="compact" hide-details variant="outlined"></v-text-field></v-list-item>
                        </v-list>
                    </v-window-item>

                </v-window>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { user } from "../store/user";
import classSelector from "./classSelector.vue";
export default {
    components: {
        classSelector,
    },
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
            startHour: 8,
            lunchBreakStartHour: 12,
            lunchBreakEndHour: 13,
            maxEventHoursPerDay: 8,
        }
        return {
            dialogLocal: false,
            customElement,
            tab: null,
            isPasswordRequest: false,
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
            await this.store.fetchUserProfil();
            if (this.store.user.startHour != null) {
                this.customElement = this.store.user;
            }
        },
        async updateProfil() {
            await this.store.postUserProfil(this.customElement)
        },
        async logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("_id");
            this.$router.push('/login')
        },
        async resetPassword() {
            this.isPasswordRequest = true;
            this.store.resetPasswordRequest(this.store.user.email);
        },
    },
    async beforeCreate() {
        await this.store.fetchUserProfil();
        if (this.store.user.startHour != null) {
            this.customElement = this.store.user;
        }
    },
};
</script>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.2s ease-in-out;
}
</style>
