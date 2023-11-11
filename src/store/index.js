import Vue from 'vue'
import Vuex from 'vuex'
// 解析token
import { jwtDecode } from "jwt-decode";
Vue.use(Vuex)
const store = new Vuex.Store({
    // 数据
    state: {
        unDoneTodoList: [],
        doneTodoList: [],
        delTodoList: [],
        token: localStorage.getItem("token") || "",
        username: localStorage.getItem("username"),
        avatarpath: localStorage.getItem("avatarpath"),
    },
    // 修改数据的唯一手段
    mutations: {
        saveToken(state, token) {
            // 因为vuex非持久化存储，所以一式两份，初始化时从本地读取
            localStorage.setItem("token", token);
            state.token = localStorage.getItem("tokne");
            localStorage.setItem("username", jwtDecode(token).username);
            state.username = localStorage.getItem("username")
        },
        saveAvatarpath(state, avatarpath) {
            // 空avatarpath说明是没设置头像的用户，我们返回默认图片即可
            if (!avatarpath) {
                localStorage.setItem("avatarpath", "../assets/defultAvatar.png");
                state.avatarpath = localStorage.getItem("avatarpath");
            } else {
                // 后端设置静态资源提供访问，我们直接访问本地端口+文件名
                localStorage.setItem("avatarpath", "http://localhost:3001/" + avatarpath.replace('avatar\\', ''));
                state.avatarpath = localStorage.getItem("avatarpath");
            }
        },
        clearToken(state) {
            // 清空相关信息
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("avatarpath")
            state.token = null;
            state.username = null;
            state.avatarpath = null;
        },
        // 添加未完成目标
        addTodo(state, todo) {
            state.unDoneTodoList.push(todo);
        },
        // 删除目标
        delTodo(state, removeId) {
            // 遍历unDoneTodoList，过滤掉此id对应项
            state.unDoneTodoList = state.unDoneTodoList.filter(item => {
                // 将此项isDel改为true表示删除,并且添加到删除列表
                if (item.id == removeId) {
                    item.isDel = true;
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
            console.log(1);
            // console.log(dragIndex, targetIndex);
            // splice(从第几项,删除几项,再添加什么)他会返回被删除的元素数组
            // 从拖拽项开始删除1个元素不添加任何元素，结果[0]表示再获取到这个拖拽项
            let dragTodo = state.unDoneTodoList.splice(dragIndex, 1)[0];
            // 从目标项删除0项，并且添加保存的拖拽项
            state.unDoneTodoList.splice(targetIndex, 0, dragTodo);
        },
        // 完成
        doneChoose(state) {
            // 将选中项添加进完成列表，且将未选中项过滤出来
            state.unDoneTodoList = state.unDoneTodoList.filter((item) => {
                if (item.isChoose == true) {
                    item.isDone = true;
                    state.doneTodoList.push(item);
                }
                return item.isChoose != true;
            })
        },
        // 删除选中
        delChoose(state) {
            // 将选中项添加进删除列表，且将未选中项过滤出来
            state.unDoneTodoList = state.unDoneTodoList.filter((item) => {
                if (item.isChoose == true) {
                    item.isDel = true;
                    state.delTodoList.push(item);
                }
                return item.isChoose != true;
            })
        },
    },
    // 提交mutations申请修改数据（可以包含任意异步操作）（组件中通过store.dispatch('')或者mapActions 触发actions）
    actions: {
    }
})
export default store;