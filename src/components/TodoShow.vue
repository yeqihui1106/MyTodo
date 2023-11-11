<template>
  <div class="w">
    <!-- 确认弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span v-text="clickWhat == '完成' ? '确认完成了吗!给你点赞👍' : '这就删除了?你个小废物👎'"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="box-card todoShow" shadow="never" @mouseover.native="inCard($event)"
      @mouseleave.native="outCard($event)">
      <div class="quickActions">
        <el-button type="primary" plain class="quick" @click="clickDone">完成标记</el-button>
        <el-button type="primary" plain class="quick" @click="clickDel">删除标记</el-button>
        <el-button type="primary" plain class="seeDone quick">查看已完成</el-button>
        <el-button type="primary" plain class="seeDel quick">查看回收站</el-button>
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
      <div v-for="todo in unDoneTodoList" :key="todo.id" class="text item mainInfo" draggable="true"
        @dragstart="dragstart($event)" @dragover="dragover($event)" @dragend="dragend()">
        <div class="row" @dblclick="changeEdit(todo.id)">
          <div class="checkTodo" @click="chooseTodo($event, todo)" v-text="todo.isChoose ? '✔' : ''"></div>
          <p class=" infoText">{{ todo.text }}</p>
          <div class="deleteTodo" @click="clickXDel(todo.id)">✘</div>
        </div>
        <div class="row" v-show="todo.isEdit">
          <div class="edit">
            <input type="text" v-model="todo.text" class="editInp" @keydown.enter="changeEdit(todo)">
            <el-button type="primary" class="finishEditBtn" size="small " @click="changeEdit(todo.id)" plain>
              完成<i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from "vue";
import { Card } from "element-ui";
import { Dialog } from 'element-ui';
import { Message } from 'element-ui';
import {mapState} from 'vuex';
// Vue.use(Message);
// Message不能全局引入,否则出错
Vue.prototype.$message = Message;
Vue.use(Card);
Vue.use(Dialog);
export default {
  // props: ["unDoneTodoList"],
  data() {
    return {
      // 首次进入展示的列表
      firstShowStr: [
        "添加你的第一个代办事项！📝",
        "食用方法💡：",
        "✔️ 所有提交操作支持 Enter 回车键提交~",
        "✔️ 拖拽 Todo 上下移动可排序~",
        "✔️ 双击已有的 Todo 可进行编辑~",
        "✔️ 右侧的小窗口是快捷操作哦~",
        "🔒 所有的 Todo 数据存储在浏览器本地~",
      ],
      // 表示当前是否有添加了任务
      haveTodo: false,
      // 拖拽元素和目标元素
      dragElement: "",
      targetElement: "",
      dragIndex: "",
      targetIndex: "",
      // el弹出框的显示
      dialogVisible: false,
      // 记录点击的是完成还是删除
      clickWhat: "",
      removeId: "",
    };
  },
  computed: {
    ...mapState({
      unDoneTodoList: state => state.unDoneTodoList,
    })
  },
  methods: {
    // 进入卡片
    inCard(e) {
      // 因为快捷操作元素是子元素会冒泡此事件，排除掉
      // 元素1.contains(元素2)可以判断元素2是否为元素1的后代元素
      if (document.querySelector(".quickActions").contains(e.target)) return;
      document.querySelector(".todoShow").style.boxShadow = "5px 5px 10px black";
    },
    // 离开卡片
    outCard(e) {
      // 判断事件触发元素是不是quickActions元素里的元素，是的话排除掉
      if (document.querySelector(".quickActions").contains(e.target)) return;
      document.querySelector(".todoShow").style.boxShadow = "none";
    },
    // 点击勾选
    chooseTodo(e, todo) {
      this.$store.commit("changeChoose", todo.id);
    },
    // 删除此项
    removeTodo(id) {
      this.$store.commit('delTodo', id);
    },
    // 编辑
    changeEdit(id) {
      this.$store.commit("changeEdit", id);
    },
    // 全选
    chooseAll() {
      this.$store.commit("chooseAll");
    },
    // dragstart开始时触发
    dragstart(e) {
      // 存储呗拖拽的元素
      this.dragElement = e.target;
    },
    // dragover拖拽过程中高频触发
    dragover(e) {
      // dragover事件的默认行为是拒绝接受任何被拖放的元素。
      // 默认无法将元素放置到其他元素中。如果需要设置允许放置，必须阻止对元素的默认处理方式
      e.preventDefault();
      // e.target 指向实际触发事件的元素,会指向mainInfo的子元素。e.currentTarget 指向绑定事件的元素即mainInfo
      if (e.currentTarget.className != "text item mainInfo" || e.currentTarget === this.dragElement) return;
      // 存储目标元素
      this.targetElement = e.currentTarget;
      // 获取所有todo的DOM元素
      let todos = document.getElementsByClassName("mainInfo");
      // Array.prototype.indexOf获取拖拽元素和目标元素在tdoso元素集中的索引，因为ByClassName获取的元素集是类数组，call表示调用原生数组的indexOf方法
      this.dragIndex = Array.prototype.indexOf.call(todos, this.dragElement);
      this.targetIndex = Array.prototype.indexOf.call(todos, this.targetElement);
    },
    // dragend松开鼠标时触发
    dragend() {
      // 触发事件更新排序unDoneTodoList，触发视图刷新
      this.$store.commit("sort", { dragIndex: this.dragIndex, targetIndex: this.targetIndex });
      // this.$emit("updatedTodoSort", this.dragIndex, this.targetIndex);
      // 不清除索引的话，你再次拖拽时哪怕在外部松手，也会拿着之前的索引再去请求TodoList组件更新排序
      this.dragIndex = null;
      this.targetIndex = null;
    },
    // 反选
    reversChoose() {
      this.$store.commit("reversChoose");
    },
    // 判断有没有todo或者有没有勾选todo
    haveChooseTodo() {
      let i = 0;
      this.unDoneTodoList.forEach(item => {
        item.isChoose == true ? i++ : i = i + 0;
      });
      if (this.unDoneTodoList.length === 0) { alert("暂无小目标!!!"); return false }
      if (i === 0) { alert("请先勾选你的小目标!!!"); return false }
    },
    // 点击完成选中,设置弹框提醒
    clickDone() {
      if (this.haveChooseTodo() === false) return;
      // 记录点击的是完成还是删除,赋值为弹框应该提示的内容
      this.clickWhat = "选中项完成";
      this.dialogVisible = true;
    },
    // 点击删除选中,设置弹框提醒
    clickDel() {
      if (this.haveChooseTodo() === false) return;
      this.clickWhat = "选中项删除";
      this.dialogVisible = true;
    },
    // 单击X号删除,设置弹框提醒
    clickXDel(id) {
      // 此处多个空格区分点击的是删除选中还是✘
      this.clickWhat = "此项删除";
      this.dialogVisible = true;
      this.removeId = id;
    },
    // 继续确定,根据点击不同按钮发起不同请求
    confirm() {
      if (this.clickWhat == "选中项完成") {
        // 由完成选中触发的弹框
        this.doneChooseTodo()
      } else if (this.clickWhat == "选中项删除") {
        // 由删除选中触发的弹框
        this.delChooseTodo();
      } else {
        // 由✘触发的弹框
        this.removeTodo(this.removeId)
      }
      this.dialogVisible = false;
     
      this.clickWhat = null;
    },
    // 取消操作
    cancel() {
      this.dialogVisible = false;
    },
    // 完成选中
    doneChooseTodo() {
      this.$store.commit("doneChoose");
    },
    // 删除选中
    delChooseTodo() {
      this.$store.commit("delChoose");
    }
  },
};
</script>

<style>
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
  right: -120px;
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

.deleteTodo {
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

.deleteTodo:hover {
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
</style>