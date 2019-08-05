import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    auth: false,
    admin: false
  },
  mutations: {
    login (state) {
      state.auth = true;
    },
    superLogin (state){
      state.auth = true;
      state.admin = true;
    },
    logout (state) {
      state.auth = false;
      state.admin = false;
    }
  },
  actions: {

  }
})

export default store