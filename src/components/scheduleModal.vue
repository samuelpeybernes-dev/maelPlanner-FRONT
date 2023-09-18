<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" width="600">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Open Dialog
                </v-btn>
            </template>
            <v-card>
                <v-card-text>
                    <v-card-title>
                        <span class="text-h6">Titre de l'événement :</span>
                    </v-card-title>
                    <v-container>
                        <v-text-field label="Titre" required></v-text-field>
                    </v-container>
                    <v-card-title>
                        <span class="text-h6">Couleur de l'événement :</span>
                    </v-card-title>
                    <v-container>
                        <v-color-picker v-model="selectedColor" mode="hex" width="auto" hide-canvas hide-inputs hide-sliders
                            show-swatches></v-color-picker>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-accent-4" variant="text" @click="dialog = false">
                        Annuler
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
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

    },
    data() {
        return {
            dialog: false,
            selectedColor: '#1976d2',
        };
    },
    methods: {
        test() {
            console.log("🚀 ~ file: scheduleModal.vue:50 ~ data ~ selectedColor:", this.selectedColor)
            console.log(colors)
        },
    },
    mounted: async function () {
     this.test();
  },
}

</script>

  