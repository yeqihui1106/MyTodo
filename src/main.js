import Vue from 'vue'
import App from './App.vue'
import store from './store';
import router from './router/index';
import $axios from './utils/require';
// 创建一个自定义的Axios实例
Vue.prototype.$axios = $axios
// 因为store中的this指向store实例对象，而不指向vue
store.$axios = $axios
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store: store,
  router: router,
}).$mount('#app')