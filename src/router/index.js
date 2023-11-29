import VueRouter from 'vue-router';
import Vue from 'vue';
Vue.use(VueRouter);
import UserRegister from '../views/UserRegister';
import UserLogin from '../views/UserLogin';
import TodoList from '../views/TodoList';
// 路由映射关系
const routes = [
  { name: "home", path: "/home", component: TodoList },
  { name: "register", path: "/register", component: UserRegister },
  { name: "login", path: "/login", component: UserLogin },
  { path: "/", component: TodoList },
]
const router = new VueRouter({
  routes: routes
})
// 全局前置路由守卫（路由发生跳转时就会监测到）
// router.beforeEach((to, from, next) => {
//   if (to.name == from.name) { return next(false) }
//   // 获取本地token
//   const token = localStorage.getItem("token")
//   if (token) {
//     if (to.name === 'login' || to.name === 'register') {
//       alert("请先退出登录！")
//       // 如果存在 token，不允许跳转到 login 和 register 路由
//       next({ name: 'home' }); // 重定向到首页或其他合适的路由
//     } else {
//       // 允许其他路由跳转
//       next();
//     }
//   } else {
//     if (to.name === 'login' || to.name === 'register') {
//       alert("请先登录！")
//       // 如果不存在 token，只允许跳转到 login 和 register 路由
//       next();
//     } else {
//       // 其他路由重定向到 login 路由
//       next({ name: 'login' });
//     }
//   }
// })
export default router

