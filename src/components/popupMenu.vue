<template>
    <div class="d-flex justify-space-around">
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="purple" icon="mdi-plus" v-bind="props"></v-btn>
            </template>
            <v-list>
                <v-list-item>
                    <button v-on:click="generate">Generer les cours</button>
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

  