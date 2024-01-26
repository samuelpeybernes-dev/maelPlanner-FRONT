<template>
    <div>

        <v-list class="d-flex items-baseline justify-space-around">
            <v-card class="w-[50%]">
                <v-card-text>
                    <v-card-title>
                        <span class="text-h6">Titre de la matière :</span>
                    </v-card-title>
                    <v-container>
                        <v-text-field v-model="subjects.text" label="Titre" required></v-text-field>
                    </v-container>
                    <v-card-title>
                        <span class="text-h6">Nombres d'heure par semaine :</span>
                    </v-card-title>
                    <v-text-field v-model="subjects.weekHours" type="number" style="width: 80px" density="compact"
                        hide-details variant="outlined">
                    </v-text-field>
                    <v-card-title>
                        <span class="text-h6">Couleur :</span>
                    </v-card-title>

                    <v-container>
                        <v-color-picker v-model="subjects.backColor" mode="hex" width="auto" hide-canvas hide-inputs
                            show-swatches></v-color-picker>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="addSubject" color="blue-darken-1" variant="text">
                        Ajouter
                    </v-btn>
                </v-card-actions>
            </v-card>
            <div class="d-flex flex-wrap gap-2.5">
                <v-card class="w-25 h-25 flex-grow-1 " v-for="subject in this.store.hoursSubject" :key="subject._id"
                    :color="subject.backColor">
                    <v-toolbar :color="subject.backColor" height="40">
                        <v-btn icon dark @click="deleteSubject(subject._id)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>

                        <v-spacer></v-spacer>
                        <v-btn v-if="editingSubjectId !== subject._id" icon dark @click="startEditing(subject._id)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn v-else icon dark @click="updateSubject">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-item v-if="editingSubjectId !== subject._id">
                        <div>
                            <div class="text-overline mb-1">
                                {{ subject.text }}
                            </div>
                            <div class="text-h6 mb-1">
                                {{ subject.weekHours }}h
                            </div>
                        </div>
                    </v-card-item>
                    <v-card-item v-else>
                        <div>
                            <div class="text-overline mb-1">
                                <input type="text" v-model="subject.text">
                                
                            </div>
                            <div class="text-h6 mb-1">
                                <input type="number" v-model="subject.weekHours">
                                <v-color-picker v-model="subject.backColor" hide-canvas hide-inputs></v-color-picker>
                                <v-container>
                                    <v-menu v-model="menuColor" :close-on-content-click="false" :nudge-right="40"
                                        transition="scale-transition" offset-y min-width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                         
                                                <v-btn v-model="color" label="Color Picker" prepend-icon="mdi-palette"
                                                 v-bind="attrs" v-on:click="on" :color="color">
                                                    Ajouter
                                                </v-btn>
                                        </template>
                                        <v-color-picker v-model="color" class="ma-2" hide-inputs>

                                        </v-color-picker>
                                    </v-menu>

                                </v-container>
                            </div>
                        </div>
                    </v-card-item>
                </v-card>
            </div>

        </v-list>
    </div>
</template>

<script >
import { hoursSubject } from '../store/hoursSubject';

export default {
    setup() {
        return {
            store: hoursSubject(),
        }
    },
    data() {
        return {
            subjects: {},
            editingSubjectId: null,
            menuColor: false,
      color: '',
        }
    },

    async beforeCreate() {
        await this.store.fetchHoursSubject();

    },

    methods: {
        async addSubject() {
            await this.store.postHoursSubject(this.subjects);
        },

        async deleteSubject(subjectId) {
            await this.store.deleteHoursSubject(subjectId);
        },

        startEditing(subjectId) {
            this.editingSubjectId = subjectId;
        },
        async updateSubject() {
            this.editingSubjectId = null;
            await this.store.postHoursSubject(this.subjects);

        }
    }
}
</script>


