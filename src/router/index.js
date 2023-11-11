import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import TodoList from '../pages/TodoList';

export default new VueRouter({
    // 路由映射关系
    routes: [
        { path: "/home", component: TodoList },
        { path: "/register", component: UserRegister },
        { path: "/login", component: UserLogin },
        { path: "*", component: TodoList },
    ]
})