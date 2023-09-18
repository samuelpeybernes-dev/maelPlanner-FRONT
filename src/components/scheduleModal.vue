<template>
    <v-row justify="center">
        <v-dialog v-model="dialogLocal" width="600">
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
                    <v-btn color="red-accent-4" variant="text" @click="dialogLocal = false">
                        Annuler
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogLocal = false">
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
        dialogProp: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        const scheduleModal = {
            title: '',
            selectedColor: '#f2f2f2f2',
        }
        return {
            dialogLocal: this.dialogProp,
            scheduleModal,

        };
    },

}

</script>

  