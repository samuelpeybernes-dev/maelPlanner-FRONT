<template>
  <v-row justify="center">
    <v-dialog
      style="z-index: 200000"
      v-model="this.openProfil"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark v-on:click="cancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Profil</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" v-on:click="validate"> Enregistrer </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list lines="two" subheader>
          <v-list-subheader>Réglages </v-list-subheader>
          <v-list-item title="Nombres d'heures maximum par jour"></v-list-item>
          <v-list-item
            title="Password"
            subtitle="Require password for purchase or use password to restrict purchase"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list lines="two" subheader>
          <v-list-subheader>General</v-list-subheader>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    openProfil: Boolean,
  },
  data() {
    return {
      dialogLocal: false,
    };
  },

  methods: {
    async validate() {
      this.dialogLocal = false;
      this.$emit("validated", this.dialogLocal);
    },
    async cancel() {
      this.dialogLocal = false;
      this.$emit("canceled", this.dialogLocal);
    },
  },
};
</script>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
