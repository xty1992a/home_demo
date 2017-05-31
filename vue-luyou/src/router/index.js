import Vue from 'vue'
import Router from 'vue-router'
import main from '../components/main.vue'
import datePicker from '../components/date_picker.vue'
import ball from '../components/ball.vue'
import scroller from '../components/scroller/scroller.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/date',
      name: 'date',
      component: datePicker
    },
    {
      path: '/ball',
      name: 'ball',
      component: ball
    },
    {
      path: '/scroller',
      name: 'scroller',
      component: scroller
    }
  ]
})
