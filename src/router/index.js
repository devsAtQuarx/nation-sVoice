import Vue from 'vue'
import Router from 'vue-router'
//import home from '@/components/Home'

Vue.use(Router)


const home = resolve => {
  require.ensure(['@/components/Home'],()=>{
      resolve(require('@/components/Home'))
  })
}

export default new Router({
  routes: [
    { path: '/', name: 'home', component: home }
  ]
})
