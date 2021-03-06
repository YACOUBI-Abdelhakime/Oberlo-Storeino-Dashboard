import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/main.css'

Vue.config.productionTip = false
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
