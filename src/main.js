// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketio from 'vue-socket.io'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'


Vue.use(Buefy)
Vue.use(VueSocketio, 'http://localhost:5000');

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    customEmit: function (val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})