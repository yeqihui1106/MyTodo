import Vue from 'vue'
import App from './App.vue'
import store from './store';
import router from './router/index';
import axios from 'axios';
console.log(store.state.token);
Vue.prototype.$axios = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    'Authorization': `Bearer ${store.state.token}`
  }
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store: store,
  router: router,
}).$mount('#app')
