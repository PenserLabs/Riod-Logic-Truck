<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>RIOD</span>
        <span class="font-weight-light">LOGIC</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        icon
        v-if="$store.state.auth"
        @click="logout"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn
        flat
        icon
        to="/"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout');
      localStorage.removeItem('riodToken');
      this.$router.go();
    } 
  }
}
</script>
