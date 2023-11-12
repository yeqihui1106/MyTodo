import Vue from 'vue'
import App from './App.vue'
import store from './store';
import router from './router/index';
import axios from 'axios';
// 创建一个自定义的Axios实例
Vue.prototype.$axios = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`, // 添加令牌到请求头
    // 'Content-Type': 'application/json' // 设置其他所需的请求头
  }
});
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store: store,
  router: router,
}).$mount('#app')