<template>
    <v-row justify="center">
        <v-dialog v-model="this.dialog" persistent width="600">
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
                    <v-card-text class="pb-0">
                        <v-text-field density="compact" variant="solo" label="Search templates"
                            append-inner-icon="mdi-magnify" single-line hide-details @update:modelValue="searchColor($event)"
                            :model-value="search"></v-text-field>
                    </v-card-text>
                    <v-container>
                        <v-color-picker :swatches="filteredColors" v-model="scheduleModal.selectedColor" mode="hex"
                            width="auto" hide-canvas hide-inputs show-swatches></v-color-picker>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-accent-4" variant="text" v-on:click="cancel">
                        Annuler
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" v-on:click="validate">
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
            default: false,
        },
    },

    data() {
        const scheduleModal = {
            title: "Décathlon",
            selectedColor: '#b3f1ab',
            dialogLocal: false,
            validated: false,
        }

        return {
            scheduleModal,
            search: "",
            filteredColors: this.formatColors(colors),
        };
    },
    methods: {
        async validate() {
            this.scheduleModal.validated = true;
            this.scheduleModal.dialogLocal = false;
            this.$emit('validated', this.scheduleModal);
        },
        async cancel() {
            this.scheduleModal.dialogLocal = false;
            this.$emit('canceled', this.scheduleModal);
        },
        searchColor(event) {
            if (event.length-1 === 0)
                this.filteredColors = this.formatColors(colors)
            else
                this.filteredColors = this.filteredColorsFunc(colors, event)
        },
        formatColors(colors) {
            const keys = Object.keys(colors);
            const colorsArray = [];
            keys.forEach((key) => {
                const childKeys = Object.keys(colors[key]);
                const childColors = [];
                childKeys.forEach((childKey) => {
                    childColors.push(colors[key][childKey]);
                });
                colorsArray.push(childColors);
            });
            return colorsArray;
        },

        filteredColorsFunc(colors, search) {
            const keys = Object.keys(colors);
            const colorsArray = [];

            keys.forEach((key) => {
                const childKeys = Object.keys(colors[key]);
                childKeys.forEach((childKey) => {
                    colorsArray.push({ parent: key, name: key + " " + childKey, color: colors[key][childKey] });
                });
            });
            const colorsFiltered = colorsArray.filter(color => color.name.toLowerCase().includes(search.toLowerCase()));

            const newColors = [];
            keys.forEach(key => {
                const child = colorsFiltered.filter(color => color.parent === key);
                if (child.length > 0)
                    newColors.push(child.map(color => color.color));
            })
            return newColors;
        }
    },

}

</script>

  