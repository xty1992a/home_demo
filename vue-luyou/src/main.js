// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

import './js/rem.js'
import './js/setTransform.js'
import './js/overscroll.js'
// import './js/Vconsole'
import moment from 'moment'
Vue.use(moment)

Vue.config.productionTip = false
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count: 1,
    msg: 'there is main',
    end_time: (new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())).getTime(),
    begin_time: (new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())).getTime()
  },
  mutations: {
    increment (state) {
      state.count++
    },
    changeMsg (state, msg) {
      state.msg = msg
    },
    changeBegin_time (state, value) {
      state.begin_time = value
    },
    changeEnd_time (state, value) {
      state.end_time = value
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

