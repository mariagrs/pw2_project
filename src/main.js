import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

axios.defaults.withCredentials = true // this line here !

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
