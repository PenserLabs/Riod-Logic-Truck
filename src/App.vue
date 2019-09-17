<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <v-toolbar-side-icon><v-img :src="require('@/assets/freezr.png')" contain height="30"></v-img></v-toolbar-side-icon>
        <span>FREEZR</span>
        <!-- <span class="font-weight-light"></span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn
        flat
        icon
        to="/"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn
        flat
        icon
        v-if="$store.state.auth"
        @click="logout"
      >
        <v-icon>mdi-logout</v-icon>
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
      localStorage.removeItem('riodAdminToken');
      this.$router.go();
    } 
  }
}
</script>
