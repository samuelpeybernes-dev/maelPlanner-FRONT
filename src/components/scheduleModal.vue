<template>
    <v-row justify="center">
        <v-dialog v-model="this.dialog" width="600">
            <v-card>
                <v-card-text>
                    <v-card-title>
                        <span class="text-h6">Titre de l'événement :</span>
                    </v-card-title>
                    <v-container>
                        <v-text-field v-model="scheduleModal.title" label="Titre" required></v-text-field>
                    </v-container>
                    <v-card-title>
                        <span class="text-h6">Couleur de l'événement :</span>
                    </v-card-title>
                    <v-container>
                        <v-color-picker v-model="scheduleModal.selectedColor" mode="hex" width="auto" hide-canvas
                            hide-inputs show-swatches></v-color-picker>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-accent-4" variant="text" @click="this.scheduleModal.dialogLocal = false">
                        Annuler
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" v-on:Click="validate">
                        Ajouter
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
  
<script>
import colors from 'vuetify/lib/util/colors'
export default {
    props: {
        dialog: {
            type: Boolean,
        },
    },

    data() {
        const scheduleModal = {
            title: "Décathlon",
            selectedColor: '#f2f2f2f2',
            dialogLocal: false,
            validated: false,
        }
        
        console.log("🚀 ~ file: scheduleModal.vue:49 ~ data ~ scheduleModal:", scheduleModal)
        return {
            scheduleModal,
        };
    },
    methods: {
        async validate() {
            this.scheduleModal.validated = true;
            this.scheduleModal.dialogLocal = false;
            this.$emit('validated', this.scheduleModal);
        },
        async create() {
            this.scheduleModal.dialogLocal = true;
            this.scheduleModal.title = this.scheduleModal.title;
            this.scheduleModal.selectedColor = this.scheduleModal.selectedColor;
            this.$emit('created', this.scheduleModal);
        },
    },

}

</script>

  