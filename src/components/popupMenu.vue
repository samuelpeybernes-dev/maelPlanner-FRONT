<template>
    <div class="d-flex justify-space-around">
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="purple" icon="mdi-plus" v-bind="props"></v-btn>
            </template>
            <v-list class="text-center">
                <v-list-item class="px-0">
                    <v-btn height="50px" width="100%" v-on:click="openProfil = true">Profil</v-btn>
                    <v-btn height="50px" width="100%" v-on:click="generate">Generer les cours</v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
        <popupProfil :openProfil="openProfil" v-on:canceled="cancelProfil" />
    </div>
</template>
  
<script>
import popupProfil from './popupProfil.vue';
export default {
    components: {
        popupProfil,
    },
    data() {
        return {
            openProfil: false,
        }
    },

    methods: {
        async generate() {
            this.$emit('generated');
        },
        cancelProfil() {
            this.openProfil = this.dialogLocal;
        },
    },

}

</script>