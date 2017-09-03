// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './firebase'
import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import router from './router'
import './assets/css/vuetify.min.css'
import Vuetify from 'vuetify'
import {store} from './store'
import VueResource from 'vue-resource'

Vue.use(VueFire)
Vue.use(Vuetify)
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
