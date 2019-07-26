import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import JsonExcel from 'vue-json-excel'

axios.defaults.baseURL = 'https://riod-temp-logs.herokuapp.com'

Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
