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
router.beforeEach((to, from, next) => {
  // 获取本地token
  const token = localStorage.getItem("token")
  if (!token && to.name !== "login") {
    // 如果token不存在 且 要跳转的路由不是登录页（因为在登录页本就没有token会死循环）
    // 跳转至登录页
    next({ name: "login" });
  } else if (token && to.name == "login") {
    // 如果已经登录拥有token不能再去登录页，直接跳到首页
    next({ name: "home" });
  } else {
    // 此处拥有token且要去的不是登录页直接  放行
    next();
  }
})
export default router

