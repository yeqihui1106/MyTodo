import Vue from 'vue'
import Vuex from 'vuex'
// 引入时间库设置中国zh-cn
import moment from 'moment';
moment.locale('zh-cn');
// 解析token
import { jwtDecode } from "jwt-decode";
Vue.use(Vuex)
const store = new Vuex.Store({
    // 数据
    state: {
        unDoneTodoList: [],
        doneTodoList: [],
        delTodoList: [],
        token: localStorage.getItem("token"),
        username: localStorage.getItem("username"),
        avatar_path: localStorage.getItem("avatar_path"),
    },
    // 修改数据的唯一手段
    mutations: {
        // 保存token
        saveToken(state, { token, avatar_path }) {

            localStorage.setItem("token", token);
            localStorage.setItem("username", jwtDecode(token).username);
            state.token = localStorage.getItem("token");
            state.username = localStorage.getItem("username");
            // 没设置过头像用默认头像
            if (!avatar_path) {
                localStorage.setItem("avatar_path", "../assets/defaultAvatar.png");
                state.avatar_path = localStorage.getItem("avatar_path");
            } else {
                localStorage.setItem("avatar_path", "http://localhost:5000/" + avatar_path.replace("avatar\\", ""));
                state.avatar_path = localStorage.getItem("avatar_path");
            }
        },
        changeAvatarPath(state, avatar_path) {
            localStorage.setItem("avatar_path", "http://localhost:5000/" + avatar_path.replace("avatar\\", ""));
            state.avatar_path = localStorage.getItem("avatar_path");
        },
        clearToken(state) {
            state.token = null
            state.username = null
            state.avatar_path = null
        },
        // 添加未完成目标
        addTodo(state, todo) {
            state.unDoneTodoList.push(todo);
        },
        // 删除目标
        delTodo(state, removeId) {
            let delTime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            // 遍历unDoneTodoList，过滤掉此id对应项
            state.unDoneTodoList = state.unDoneTodoList.filter(item => {
                // 将此项isDel改为true表示删除,并且添加到删除列表
                if (item.id == removeId) {
                    item.isDel = true;
                    item.time = delTime;
                    state.delTodoList.push(item);
                }
                return item.id !== removeId
            });
        },
        // 勾选状态
        changeChoose(state, chooseId) {
            // 直接遍历出此项然后取反
            state.unDoneTodoList.forEach(item => {
                item.id == chooseId ? item.isChoose = !item.isChoose : null;
            });
        },
        // 编辑状态
        changeEdit(state, editId) {
            // 直接遍历出此项然后取反
            state.unDoneTodoList.forEach(item => {
                item.id == editId ? item.isEdit = !item.isEdit : null;
            });
        },
        // 全选
        chooseAll(state) {
            state.unDoneTodoList.forEach(item => {
                item.isChoose = true;
            });
        },
        // 反选
        reversChoose(state) {
            state.unDoneTodoList.forEach(item => {
                item.isChoose = !item.isChoose;
            });
        },
        // 排序
        sort(state, { dragIndex, targetIndex }) {
            // splice(从第几项,删除几项,再添加什么)他会返回被删除的元素数组
            // 从拖拽项开始删除1个元素不添加任何元素，结果[0]表示再获取到这个拖拽项
            let dragTodo = state.unDoneTodoList.splice(dragIndex, 1)[0];
            // 从目标项删除0项，并且添加保存的拖拽项
            state.unDoneTodoList.splice(targetIndex, 0, dragTodo);
        },
        // 完成
        doneChoose(state) {
            let doneTime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            // 将选中项添加进完成列表，且将未选中项过滤出来
            state.unDoneTodoList = state.unDoneTodoList.filter((item) => {
                if (item.isChoose == true) {
                    item.isDone = true;
                    state.doneTodoList.push(item);
                }
                return item.isChoose != true;
            })
            // 此时再遍历完成列表修改状态未默认值 (因为上面如果修改isChoose我们过滤方法就无法将未完成列表正确过滤出来)
            state.doneTodoList.forEach((item) => {
                // 将其余状态修改成默认值再添加进完成列表
                item.isChoose = false;
                item.isDel = false;
                item.isEdit = false;
                item.time = doneTime;
            })
        },
        // 删除选中
        delChoose(state) {
            let delTime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            // 将选中项添加进删除列表，且将未选中项过滤出来
            state.unDoneTodoList = state.unDoneTodoList.filter((item) => {
                if (item.isChoose == true) {
                    item.isDel = true;
                    state.delTodoList.push(item);
                }
                return item.isChoose != true;
            })
            // 此时再遍历删除列表修改状态未默认值 (因为上面如果修改isChoose我们过滤方法就无法将未完成列表正确过滤出来)
            state.delTodoList.forEach((item) => {
                // 将其余状态修改成默认值再添加进完成列表
                item.isChoose = false;
                item.isDone = false;
                item.isEdit = false;
                item.time = delTime;
            })
        },
        // 永久删除
        permanentlyDelete(state, { showWhat, id }) {
            // 接收到相关信息
            if (showWhat === 'done') {
                // 过滤出别的项
                state.doneTodoList = state.doneTodoList.filter(item => item.id != id);
            } else if (showWhat === 'del') {
                // 过滤出别的项
                state.delTodoList = state.delTodoList.filter(item => item.id != id);
            }
        },
    },
    // 提交mutations申请修改数据（可以包含任意异步操作）（组件中通过store.dispatch('')或者mapActions 触发actions）
    actions: {
    }
})
export default store;