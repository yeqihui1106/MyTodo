import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs';
// 解析token
import { jwtDecode } from "jwt-decode";
Vue.use(Vuex)
const store = new Vuex.Store({
    // 数据
    state: {
        unDoneTodoList: [],
        doneTodoList: [],
        giveupTodoList: [],
        token: localStorage.getItem("token"),
        username: localStorage.getItem("username"),
        avatar_path: localStorage.getItem("avatar_path"),
    },
    // 修改数据的唯一手段
    mutations: {
        // 保存token
        saveToken(state, token) {
            localStorage.setItem("token", token);
            localStorage.setItem("username", jwtDecode(token).username);
            state.token = localStorage.getItem("token");
            state.username = localStorage.getItem("username");
            // 没设置过头像用默认头像
            if (!jwtDecode(token).avatar_path) {
                console.log(jwtDecode(token));
                localStorage.setItem("avatar_path", "../assets/defaultAvatar.png");
                state.avatar_path = localStorage.getItem("avatar_path");
            } else {
                console.log(jwtDecode(token).avatar_path);
                localStorage.setItem("avatar_path", "http://localhost:5000/" + jwtDecode(token).avatar_path.replace("avatar\\", ""));
                state.avatar_path = localStorage.getItem("avatar_path");
            }
        },

        // 更换头像路径
        changeAvatarPath(state, avatar_path) {
            localStorage.setItem("avatar_path", "http://localhost:5000/" + avatar_path.replace("avatar\\", ""));
            state.avatar_path = localStorage.getItem("avatar_path");
        },
        // 清空token信息
        CLEARTOKEN(state) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("avatar_path");
            state.token = null
            state.username = null
            state.avatar_path = null
        },

        // 获取todo
        GETTODO(state, { unDoneTodoList, doneTodoList, giveupTodoList }) {
            state.unDoneTodoList = unDoneTodoList;
            state.doneTodoList = doneTodoList;
            state.giveupTodoList = giveupTodoList;
            return "获取成功!"
        },

        // 更改选中状态
        changeChoose(state, chooseId) {
            // 直接遍历出此项然后取反
            state.unDoneTodoList.forEach(item => {
                item.todo_id == chooseId ? item.isChoose = !item.isChoose : null;
            });
        },

        // 提交编辑
        SUBMITEDIT(state, todo) {
            this.$axios.post("/editTodo", { title: todo.title, todo_id: todo.todo_id }).then((result) => {
                if (result.data.status == 0) {
                    this.commit("GETTODO")
                } else {
                    alert(result.data.message)
                }
            }).catch((err) => {
                return alert(err)
            });
        },

        // 全部勾选
        chooseAll(state) {
            state.unDoneTodoList.forEach(item => {
                item.isChoose = true;
            });
        },

        // 反选状态
        reversChoose(state) {
            state.unDoneTodoList.forEach(item => {
                item.isChoose = !item.isChoose;
            });
        },

        // 排序（现在前端更改数据顺序，再重排数据库sortIndex字段，将整个数组传给后端对应更改）
        sort(state, { dragTodo, targetTodo }) {
            // findIndex()分别拿到拖拽数据和目标数据在数组中的索引
            const dragIndex = state.unDoneTodoList.findIndex(item => item.todo_id === dragTodo.todo_id);
            const targetIndex = state.unDoneTodoList.findIndex(item => item.todo_id === targetTodo.todo_id);
            // 先将拖拽数据删除，再将拖拽数据插入到目标数据后面
            state.unDoneTodoList.splice(dragIndex, 1);
            state.unDoneTodoList.splice(targetIndex, 0, dragTodo);
            // 遍历数组，重排sortIndex（因为我们是降序展示，所以我们应该排序值--）
            let i = state.unDoneTodoList.length;
            state.unDoneTodoList.forEach(item => {
                item.sortIndex = i;
                i--;
            })
            // 请求排序
            this.$axios.post("/changeSort", { todolist: state.unDoneTodoList }).then((result) => {
                if (result.data.status != 0) return alert(result.data.message);
                this.dispatch("getTodo");
            }).catch((err) => {
                return alert(err);
            });
        },
    },
    // 提交mutations申请修改数据（可以包含任意异步操作）（组件中通过store.dispatch('')或者mapActions 触发actions）
    actions: {
        // 清空toke信息
        clearToken({ commit }) { commit("CLEARTOKEN") },

        // 请求todo数据
        getTodo({ commit }) {
            return this.$axios.get("/getTodo").then((result) => {
                // console.log(result.data);    数组包含对象[{createdate, giveupdate, donedate, status, title, todo_id, user_id}]
                if (result.data.status == 0) {
                    // 过滤出未完成、已完成、已放弃列表
                    const unDoneTodoList = result.data.todolist.filter(item => item.status === "0")
                    const doneTodoList = result.data.todolist.filter(item => item.status === "1")
                    const giveupTodoList = result.data.todolist.filter(item => item.status === "2")
                    // 增加记录是否处于编辑或选中状态的属性
                    unDoneTodoList.forEach((item) => {
                        // 要设置响应式，vue不检测深层结构的属性
                        Vue.set(item, 'isEdit', false);
                        Vue.set(item, 'isChoose', false);
                        item.createdate = dayjs(item.createdate).format("YYYY-MM-DD HH:mm:ss");
                    })
                    // 格式化所需时间格式
                    doneTodoList.forEach((item) => {
                        item.donedate = dayjs(item.donedate).format("YYYY-MM-DD HH:mm:ss");
                    })
                    giveupTodoList.forEach((item) => {
                        item.giveupdate = dayjs(item.giveupdate).format("YYYY-MM-DD HH:mm:ss");
                    })
                    // 将数据传给mutations
                    return commit("GETTODO", { unDoneTodoList, doneTodoList, giveupTodoList });
                } else {
                    // 返回错误信息
                    return new Error(result.data.message)
                }
            }).catch((err) => {
                return err
            });
        },

        // 添加todo
        addTodo({ dispatch }, todo) {
            return this.$axios.post("/addTodo", { title: todo.title }).then((result) => {
                if (result.data.status != 0) return new Error(result.data.message);
                // 再次获取新的列表
                dispatch("getTodo");
                return result.data.message;
            }).catch((err) => {
                return err;
            });
        },

        // 放弃todo
        giveupTodo({ dispatch }, giveupId) {
            return this.$axios.post("/giveupTodo", { todo_id: giveupId }).then((result) => {
                if (result.data.status != 0) return new Error(result.data.message);
                dispatch("getTodo");
                return result.data.message;
            }).catch((err) => {
                return err;
            });
        },

        // 提交编辑todo
        submitEdit({ dispatch }, todo) {
            return this.$axios.post("/editTodo", { title: todo.title, todo_id: todo.todo_id }).then((result) => {
                if (result.data.status != 0) return new Error(result.data.message);
                // 获取新的数据
                dispatch("getTodo");
                return result.data.message;
            }).catch((err) => {
                return err;
            });
        },

        // 完成选中项
        doneChoose({ state, dispatch }) {
            // 表示要发给后端的列表
            let todolist = []
            state.unDoneTodoList.forEach(item => {
                if (item.isChoose == true) todolist.push(item)
            })
            // 请求完成
            return this.$axios.post("/doneTodo", { todolist: todolist }).then((result) => {
                if (result.data.status != 0) return new Error(result.data.message);
                dispatch("getTodo");
                return result.data.message

            }).catch((err) => {
                return err
            });
        },

        // 放弃选中项
        async giveupChoose({ state, dispatch }) {
            // 此处不可forEach应该map，不然promiseArr是空的,如果使用filter的话里面的就不是axios返回的promise对象，应该用map
            // filter返回筛选出数组的项
            // map返回每项执行操作后的返回结果（axios请求的返回结果就是promise对象）
            const promiseArr = state.unDoneTodoList.map((item) => {
                if (item.isChoose == true) {
                    return this.$axios.post("/giveupTodo", { todo_id: item.todo_id }).then((result) => {
                        if (result.data.status != 0) return new Error(result.data.message);
                        return result.data.message
                    }).catch((err) => {
                        return err;
                    })
                }
            });
            // Promise.all等待所有请求结束
            return await Promise.all(promiseArr).then((result) => {
                // 全部请求成功，获取新的数据
                dispatch("getTodo");
                return result[result.length - 1]
            }).catch((err) => {
                // 至少有一个请求失败出错
                return err
            });
        },

        // 永久删除
        foreverDelete({ dispatch }, id) {
            return this.$axios.post("/foreverDeleteTodo", { todo_id: id }).then((result) => {
                if (result.data.status != 0) return new Error(result.data.message)
                dispatch("getTodo");
                return result.data.message;
            }).catch((err) => {
                return err;
            });
        },
    }
})
export default store;