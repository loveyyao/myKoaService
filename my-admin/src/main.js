import Vue from 'vue'
import ElementUi from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUi)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
