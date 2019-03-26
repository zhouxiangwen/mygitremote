import Vue from 'vue'
import Router from 'vue-router'
import HelloFromVux from '@/components/HelloFromVux'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: 'Login',
      name: 'Login',
      component: Login
    }
  ]
})
