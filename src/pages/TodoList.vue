
<template>
  <div>
     <el-button type="danger" class="logoutBtn" @click="logout">退出登录</el-button>
    <div class="createTodo">
      <input type="text" placeholder="新增小目标..." class="createInp" v-model="inpText" @keydown.enter="addUnDoneTodo" />
      <el-button type="primary" class="createBtn" @click="addUnDoneTodo">提交</el-button>
    </div>
    <TodoShow>
    </TodoShow>
  </div>
</template>
<script>
import Vue from "vue";
import { Button } from "element-ui";
import TodoShow from '../components/TodoShow.vue';
import { nanoid } from 'nanoid';
import { Message } from 'element-ui';
// Message不能全局引入,否则出错
Vue.prototype.$message = Message;
Vue.use(Button);
export default {
  components: { TodoShow },
  data() {
    return {
      inpText: "",
    }
  },
  methods: {
    // 点击提交新增按钮
    addUnDoneTodo() {
      if (this.inpText === "") { alert("小崽子请先输入！！！"); return }
      const id = nanoid();
      let todo = { id: id, text: this.inpText, isEdit: false, isChoose: false, isDone: false, isDel: false }
      this.$store.commit("addTodo", todo);
      this.inpText = "";
    },
    // 退出登录
    logout() {
      this.$store.commit("clearToken")
      this.$router.push("login")
       // 提示用户操作成功
      this.$message({
        message:"退出成功，请重新登录",
        type: 'success'
      });
    }
  }
};
</script>

<style scoped>
.createTodo {
  display: flex;
  width: 660px;
  margin: 0 auto;
}

.createInp {
  width: 86%;
  height: 41px;
  padding-left: 10px;
  border: 2px solid #4f4f4f;
  border-top-right-radius: 0%;
  border-bottom-right-radius: 0%;
  font-size: 20px;
}

.createInp::-webkit-input-placeholder {
  font-size: 18px;
}

.createBtn {
  height: 44.84px;
  border: 2px solid #4f4f4f;
  background-color: #72b9fc;
  border-left: 0;
  border-top-left-radius: 0%;
  border-bottom-left-radius: 0%;
  color: #33322e;
  font-size: 20px;
}

.createBtn:hover {
  border: 2px solid #4f4f4f;
  border-left: 0;
}
.logoutBtn{
    position: absolute;
    left: 10px;
    top: 10px;
}
</style>