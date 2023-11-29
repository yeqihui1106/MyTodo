
<template>
  <div>
    <div class="createTodo">
      <input type="text" placeholder="新增小目标..." class="createInp" v-model="inpText" @keydown.enter="addUnDoneTodo" />
      <el-button type="primary" class="createBtn" @click="addUnDoneTodo">提交</el-button>
    </div>
    <div class="w">
      <el-button type="danger" @click="logout" class="logoutBtn">退出登录</el-button>
      <!-- 弹出确认操作框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span v-text="clickWhat == '标记完成' ? '确认完成了吗!给你点赞👍' : '这就放弃了?你个小废物👎'"></span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示完成或者放弃列表 -->
      <el-drawer :title="showWhat == 'done' ? '请欣赏你的光辉历史' : '请看清自己多废物'" :visible.sync="drawer" :with-header="true"
        size="50%" :before-close="handleClose">
        <el-table
          :data="currenShowList.filter(item => !search || item.title.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column label="日期" :prop="showWhat == 'done' ? 'donedate' : 'giveupdate'">
          </el-table-column>
          <el-table-column label="描述" prop="title">
          </el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="{}">
              <el-input v-model="search" size="small" placeholder="输入描述关键字" />
            </template>
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="foreverDelete(scope.row)">永久删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>

      <el-card class="box-card todoShow" shadow="never" @mouseover.native="inCard($event)"
        @mouseleave.native="outCard($event)">
        <div class="quickActions">
          <el-button type="primary" plain class="quick" @click="clickDone">标记完成</el-button>
          <el-button type="primary" plain class="quick" @click="clickGiveup">标记放弃</el-button>
          <el-button type="primary" plain class="seeDone quick" @click="showDone">查看已完成</el-button>
          <el-button type="primary" plain class="seeGiveup quick" @click="showGiveup">查看回收站</el-button>
        </div>
        <div slot="header" class="clearfix showTitle">
          <span>今日事今日毕，勿将今事待明日! 🤏🤏</span>
          <el-button style="float: right; padding:10px;margin-left: 10px;" type="primary" plain
            @click="chooseAll">全选</el-button>
          <el-button style="float: right; padding: 10px" type="primary" plain @click="reversChoose">反选</el-button>
        </div>
        <div v-for="(f, index) in firstShowStr" :key="f" class="text item showInfo" v-show="unDoneTodoList.length == 0">
          {{ firstShowStr[index] }}
        </div>
        <!-- 设置可拖拽以及拖拽相关事件 -->
        <div v-for="(todo, index) in unDoneTodoList" :key="todo.todo_id"
          :class="['text', 'item', 'mainInfo', { 'acticve': activId == todo.todo_id }]" draggable="true"
          @dragstart="dragstart($event, todo)" @dragover="dragover($event, todo)" @drop="drop($event, todo)"
          @dragend="dragend(todo)" @dragleave="dragleave($event, todo)">
          <div class="row" @dblclick="handleDBrow(todo, index)">
            <div class="checkTodo" @click="chooseTodo($event, todo)" v-text="todo.isChoose ? '✔' : ''"></div>
            <p class=" infoText">{{ todo.title }}</p>
            <div class="giveupTodo" @click="clickXGiveup(todo.todo_id)">✘</div>
          </div>
          <div class="row" v-show="todo.isEdit">
            <div class="edit">
              <input type="text" v-model="todo.title" ref="editInput" class="editInp" @keydown.enter="submitEdit(todo)">
              <el-button type="primary" class="finishEditBtn" size="small " @click="submitEdit(todo)" plain>
                完成<i class="el-icon-upload el-icon--right"></i>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Button } from "element-ui";
Vue.use(Button);

import { mapState } from 'vuex';
import { Card, Dialog, Message, Drawer, Table, TableColumn, Input, MessageBox, } from "element-ui";
// Message不能全局引入,否则出错
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Card);
Vue.use(Dialog);
Vue.use(Drawer);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
export default {
  data() {
    return {
      inpText: "",
      activId: null,
      // 首次进入展示的列表
      firstShowStr: [
        "添加你的第一个代办事项！📝",
        "使用方法💡：",
        "✔️ 所有提交操作支持 Enter 回车键提交~",
        "✔️ 拖拽 Todo 上下移动可排序~",
        "✔️ 双击已有的 Todo 可进行编辑~",
        "✔️ 右侧的小窗口是快捷操作哦~",
        "🔒 所有的 Todo 数据存储在浏览器本地~",
      ],
      // 表示当前是否有添加了任务
      haveTodo: false,
      // 拖拽数据和目标数据
      dragTodo: "",
      targetTodo: "",
      // el弹出框的显示
      dialogVisible: false,
      // 记录点击的是完成还是放弃
      clickWhat: "",
      giveupId: "",
      // Drawer组件控制抽屉显示的
      drawer: false,
      // Drawer组件表格搜的内容
      search: null,
      // 展示完成列表还是放弃列表
      showWhat: null,
    }
  },
  computed: {
    ...mapState({
      unDoneTodoList: state => state.unDoneTodoList,
      doneTodoList: state => state.doneTodoList,
      giveupTodoList: state => state.giveupTodoList,
    }),
    currenShowList() {
      // 再点击展示操作时修改showWhat控制切换当前展示列表
      return this.showWhat === "done" ? this.doneTodoList : this.giveupTodoList;
    }
  },
  mounted() {
    // 派发actions并 出错则提示用户
    this.$store.dispatch("getTodo").catch((err) => {
      this.$message({
        message: `1${err.message}`,
        type: 'error'
      });
    });
  },
  methods: {
    // 新增todo
    addUnDoneTodo() {
      if (this.inpText === "") return alert("小崽子请先输入！！！");
      let todo = { title: this.inpText };
      this.$store.dispatch("addTodo", todo).then((result) => {
        this.$message({
          message: result,
          type: 'success'
        });
        this.inpText = "";
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        });
      });
    },

    // 放弃此todo
    giveupTodo(id) {
      this.$store.dispatch('giveupTodo', id).then((result) => {
        this.$message({
          message: result,
          type: 'success'
        });
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        });
      });
    },

    // 展示编辑框
    handleDBrow(todo, index) {
      todo.isEdit = !todo.isEdit;
      this.$nextTick(() => {
        this.$refs.editInput[index].focus()
      })
    },
    // 提交编辑
    submitEdit(todo) {
      this.$store.dispatch("submitEdit", todo).then((result) => {
        this.$message({
          message: result,
          type: 'success'
        });
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        });
      });
    },

    // 勾选todo
    chooseTodo(e, todo) { this.$store.commit("changeChoose", todo.todo_id) },
    // 全部勾选
    chooseAll() { this.$store.commit("chooseAll") },
    // 反选
    reversChoose() { this.$store.commit("reversChoose") },

    // 判断有无todo或者有无勾选todo
    haveChooseTodo() {
      let i = 0;
      this.unDoneTodoList.forEach(item => {
        item.isChoose == true ? i++ : i = i + 0;
      });
      if (this.unDoneTodoList.length === 0) {
        alert("暂无小目标!!!");
        return false;
      }
      if (i === 0) {
        alert("请先勾选你的小目标!!!");
        return false;
      }
    },
    // 点击标记完成,设置弹框提醒
    clickDone() {
      if (this.haveChooseTodo() === false) return false;
      // 记录点击的是完成还是放弃
      this.clickWhat = "标记完成";
      this.dialogVisible = true;
    },
    // 点击放弃选中,设置弹框提醒
    clickGiveup() {
      if (this.haveChooseTodo() === false) return false;
      this.clickWhat = "标记放弃";
      this.dialogVisible = true;
    },
    // 单击X放弃,设置弹框提醒
    clickXGiveup(id) {
      // 记录是点击✘，放弃一项
      this.clickWhat = "此项放弃";
      this.dialogVisible = true;
      this.giveupId = id;
    },
    // 确定操作提示框,根据点击不同按钮发起不同请求
    confirm() {
      if (this.clickWhat == "标记完成") {
        // 由标记完成触发的弹框
        this.doneChooseTodo()
      } else if (this.clickWhat == "标记放弃") {
        // 由标记放弃触发的弹框
        this.giveupChooseTodo();
      } else {
        // 由✘触发的弹框
        this.giveupTodo(this.giveupId);
      }
      this.dialogVisible = false;
      this.clickWhat = null;
    },
    // 取消操作
    cancel() {
      this.dialogVisible = false;
      this.clickWhat = null;
      return false;
    },

    // 标记完成
    doneChooseTodo() {
      this.$store.dispatch("doneChoose").then((result) => {
        this.$message({
          message: result,
          type: 'success'
        });
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        });
      });
    },

    // 标记放弃
    giveupChooseTodo() {
      this.$store.dispatch("giveupChoose").then((result) => {
        this.$message({
          message: result,
          type: 'success'
        });
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        });
      });
    },

    // 点击查看已完成抽屉
    showDone() {
      this.showWhat = "done";
      this.drawer = true;
    },
    // 点击查看回收站抽屉
    showGiveup() {
      this.showWhat = "giveup";
      this.drawer = true;
    },
    // 关闭抽屉的回调
    handleClose(done) {
      this.search = null;
      done();
    },
    // 永久删除
    foreverDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 传入相关信息进行删除
        this.$store.dispatch("foreverDelete", row.todo_id).then((result) => {
          this.$message({
            message: result,
            type: 'success',
          });
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error',
          });
        });

      });
    },

    // 进入卡片(样式设置)
    inCard(e) {
      // 因为快捷操作元素是子元素会冒泡此事件，排除掉
      // 元素1.contains(元素2)可以判断元素2是否为元素1的后代元素
      if (document.querySelector(".quickActions").contains(e.target)) return false;
      document.querySelector(".todoShow").style.boxShadow = "5px 5px 10px black";
    },
    // 离开卡片(样式设置)
    outCard(e) {
      // 判断事件触发元素是不是quickActions元素里的元素，是的话排除掉
      if (document.querySelector(".quickActions").contains(e.target)) return false;
      document.querySelector(".todoShow").style.boxShadow = "none";
    },

    // 拖拽开始时触发（存储拖拽的元素的id）
    dragstart(e, todo) { e.dataTransfer.setData("text/plain", todo.todo_id) },
    // dragover拖拽时在可放置目标移动时高频触发（dragover事件默认无法将元素放置到其他元素中，如果需要设置允许放置，必须阻止对元素的默认处理方式）
    dragover(e, todo) {
      // dragover由目标元素触发，接收就是目标todo数据
      // 当需要类名的目标元素id 等于 元素的id时就激活样式名
      // :class="[{'acticve': activId == todo.todo_id }] 动态绑定acticve类名，当右边成立时（所以我们将目标todo设成需要激活的id）
      e.preventDefault();
      // 因为此事件高频触发，所以我们做一下判断提高性能
      if (this.activId != todo.todo_id) return this.activId = todo.todo_id;
      return false;
    },
    // 事件在拖拽元素离开一个可放置目标元素的范围时触发
    dragleave(e) {
      e.preventDefault();
      // 清空需要激活类名的的id
      this.activId = null;
    },
    // 当被拖拽到一个可放置的目标元素上松手时由目标元素触发
    drop(e, targetTodo) {
      // console.log(e.target);  // 拖拽时在哪个目标松手就是哪个元素
      const dragTodoId = e.dataTransfer.getData("text/plain");
      // 获取拖拽和目标todo并存储
      this.dragTodo = this.unDoneTodoList.find(todo => todo.todo_id == dragTodoId);
      this.targetTodo = this.unDoneTodoList.find(todo => todo.todo_id === targetTodo.todo_id);
    },
    // 当拖动操作结束时触发（请求vuex更改排序）
    dragend() { this.$store.commit("sort", { dragTodo: this.dragTodo, targetTodo: this.targetTodo }) },

    // 退出登录
    logout() {
      if (confirm('确定退出吗？？？？')) {
        this.$store.dispatch("clearToken");
        this.$router.push("/login");
        this.$message({
          type: 'success',
          message: '退出成功,请重新登录!'
        });
      }
    },
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


.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}

.showTitle {
  font-size: 20px;
  font-weight: 700;
}

.showInfo {
  font-size: 16px;
  margin-left: 20px;
}

.todoShow {
  position: relative;
  width: 100%;
  margin-top: 20px;
  border: 2px solid #33322e;
  overflow: visible;
}

.quickActions {
  position: absolute;
  right: -111px;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 97px;
  height: 142px;
  border: 2px solid #b3d8ff;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #94cafd;
}

.quickActions .quick {
  width: 97px;
  height: 35.5px;
  margin: 0 auto;
  /* 此处不知道为什么text-align: center按钮的文字不居中,可能和ui组件库有关系 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.quickActions .quick {
  border-radius: 0;
}

.quickActions .quick:first-child {
  border-radius: 7.8px 7.8px 0 0;
}

.quickActions .quick:last-child {
  border-radius: 0 0 7.8px 7.8px;
}

.mainInfo {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 560px;
  margin: 0 auto;
  margin-bottom: 10px;
  line-height: 65px;
  background-color: #94cafd;
  border: 2px solid #33322e;
  border-radius: 15px;
}

.mainInfo:hover {
  box-shadow: 3px 2px 10px #87b9e7;
}

.acticve {
  box-shadow: 3px 2px 10px #4186c6;
}

.infoText {
  width: 450px;
  user-select: none;
}

.checkTodo {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 30px;
  margin: 0px 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #33322e;
  user-select: none;
}

.checkTodo:hover {
  cursor: pointer;
  background-color: #f6a89e;
}

.giveupTodo {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 26px;
  font-size: 30px;
  background-color: #fff;
  border: 2px solid #33322e;
  border-radius: 10px;
  user-select: none;
}

.giveupTodo:hover {
  background-color: #f6a89e;
  cursor: pointer;
}

.row {
  display: flex;
  align-items: center;
  height: 65px;
  padding: 0 12px;
}

.row:nth-child(2) {
  width: 536px;
  background-color: #fff;
  border-radius: 0 0 11px 11px;
}

.edit {
  display: flex;
  align-items: center;
  height: 65px;
}

.editInp {
  width: 450px;
  height: 65px;
  margin-left: 54px;
  border: 0;
  font-size: 14px;
  outline: none;
}

.finishEditBtn {
  margin-left: -20px;
  padding: 8px 5px;
  text-align: center;
}

.finishEditBtn:hover {
  border: 2px solid #94cafd;
}


.logoutBtn {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>