<template>
  <v-container fluid>
    <v-img height="670" :src="require('../assets/img2.jpg')">
    <v-container>
      <v-layout row wrap>
      <v-flex xs6 sm4 md3 v-for="n in 7" v-bind:key="n">
        <v-card class="ma-2 pa-4 text-xs-center">
          <v-btn 
            :to="'/truck/'+n"
            flat
            color="primary"
          >
            <v-icon class="mr-2">mdi-truck</v-icon>
            {{ n }}
          </v-btn>
        </v-card>
      </v-flex> 
    </v-layout>
    </v-container>
    </v-img>  
  </v-container>
</template>

<script>
  export default {
    
  }
</script>
