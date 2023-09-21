<template>
    <div class="d-flex justify-space-around">
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Activator slot
                </v-btn>
            </template>
            <v-list>
                <v-list-item>
                    <v-list-item-title><button v-on:Click="generate">Generer les cours</button></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
  
<script>
export default {
    props: {

    },

    data() {

        return {
            
        };
    },
    methods: {
        async generate() {
            this.$emit('generated');
        }
    },

}

</script>

  