<template>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                    Menu as Popover
                </v-btn>
            </template>

            <v-card>
               <v-list>
                    <v-list-item>
                        <v-list-item-action>
                            <v-switch v-model="message" color="purple"></v-switch>
                        </v-list-item-action>
                        <v-list-item-title>Enable messages</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-action>
                            <v-switch v-model="hints" color="purple"></v-switch>
                        </v-list-item-action>
                        <v-list-item-title>Enable hints</v-list-item-title>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="menu = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" text @click="menu = false">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>
  
<script>
export default {
    props: {

    },

    data() {

        return {
            menu: true,

        };
    },
    methods: {

    },

}

</script>

  