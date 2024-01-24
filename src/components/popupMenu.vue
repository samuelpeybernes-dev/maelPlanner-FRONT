<template>
  <div class="d-flex justify-space-around">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="#c026d3" icon="mdi-plus" v-bind="props"></v-btn>
      </template>
      <v-list class="text-center">
        <v-list-item class="px-0">
          <v-btn height="50px" width="100%" v-on:click="generate">Generer les cours</v-btn>
        </v-list-item>
        <v-list-item class="px-0" v-show="showPrevious">
          <v-btn height="50px" width="100%" v-on:click="getPreviousScheduleClass">Précédent</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    showPrevious: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    async generate() {
      this.$emit("generated");
    },
    async getPreviousScheduleClass() {
      this.$emit("getPreviousScheduleClass");
    },
  },
};
</script>
