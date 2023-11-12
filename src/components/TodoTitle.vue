<template>
    <div>
        <div class="header" v-if="!$store.state.token">
            <p class="toLoginOrRegister">已有账号？前往<span class="logintext" @click="goLogin">登录</span>
                <span class="registertext" @click="goRegister"> 注册 </span>
            </p>
        </div>
        <div v-if="$store.state.token" class="userInfo">
            <p>你好, {{ userinfo.username }} </p>
            <div class="avatar" @click="openChooseInp"><img :src="avatar_path" alt="用户头像"></div>
            <input type="file" ref="chooseImgInp" style="display: none;" @change="handleChooseImg($event)">
        </div>
        <div class="title w">
            <div class="smallCube"></div>
            <div class="smallCube"></div>
            <h1>
                <a href=""><img src="../assets/My Todo.png" /><img /></a>
            </h1>
            <div class="swing">
                <div class="dingdian">
                    <div class="smallCube"></div>
                </div>
                <div class="swingMain">
                    <div class="yaogan"></div>
                    <div class="yuan"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Avatar, Row, Col, Upload } from 'element-ui';
import { mapState } from 'vuex';
// 解析token
import { jwtDecode } from 'jwt-decode';
Vue.use(Row)
Vue.use(Col)
Vue.use(Avatar)
Vue.use(Upload)
export default {
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
            sizeList: ["large", "medium", "small"],
        }
    },
    computed: {
        ...mapState({
            // 解析出用户信息
            userinfo: state => jwtDecode(state.token),
            avatar_path: state => {
                // vue不能动态绑定相对路径字符串,我们需要先require加载模块
                if (state.avatar_path == "../assets/defaultAvatar.png") {
                    return require("../assets/defaultAvatar.png")
                } else { return state.avatar_path }
            }
        }),
    },
    methods: {
        openChooseInp() {
            // 打开本地文件选择框
            this.$refs.chooseImgInp.click();
        },
        handleChooseImg(e) {
            // 获取用户选择的文件
            const file = e.target.files[0]
            // 实例化一个空FormData对象 它能上传包含文件的表单数据
            const formData = new FormData();
            // 将文件添加到formData对象中，并命名为avatar，后端根据这个获取该文件
            formData.append("avatar", file);
            this.$axios.post("/changeAvatar", formData).then((result) => {
                if (result.data.status != 0) {
                    alert(result.data.message);
                }
                this.$store.commit("changeAvatarPath", result.data.avatar_path);
                this.$message({
                    message: "头像更新成功！！",
                    type: 'success'
                });
            }).catch((err) => {
                console.log("上传失败", err);
            });
        },
        goLogin() {
            this.$router.push("/login");
        },
        goRegister() {
            this.$router.push("/register");
        },
    },
};
</script>

<style scoped>
.title {
    position: relative;
    text-align: center;
}

.smallCube {
    position: absolute;
    left: 40px;
    top: 60px;
    transform: rotate(45deg);
    width: 10px;
    height: 10px;
    background-color: #ffd6e9;
    border: 2px solid #33322e;
}

@keyframes smallCubeRotate {
    25% {
        transform: rotate(225deg);
    }

    50% {
        transform: rotate(225deg);
    }

    75% {
        transform: rotate(405deg);
    }

    100% {
        transform: rotate(405deg);
    }
}

.smallCube:nth-child(1) {
    animation: smallCubeRotate 8s linear infinite;
}

.smallCube:nth-child(2) {
    left: 10px;
    animation: name duration timing-function delay iteration-count direction fill-mode;
    animation: smallCubeRotate 8s linear 2s infinite;
}

.swing {
    position: absolute;
    right: 15px;
    top: 60px;
}

.dingdian {
    width: 20px;
    height: 20px;
    background-color: #d0f4f0;
    border: 2px solid #33322e;
    border-radius: 0 0 40% 40%;
}

.dingdian .smallCube {
    width: 8px;
    height: 8px;
    left: 6px;
    top: 6px;
    transform: rotate(45deg);
    animation: none;
}

@keyframes swing {
    0% {
        transform: rotate(35deg);
        transform-origin: top center;
    }

    100% {
        transform: rotate(-35deg);
        transform-origin: top center;
    }
}

.swingMain {
    margin-top: -5px;
    width: 100%;
    height: 70px;
    animation: swing 2s ease-in-out alternate infinite;
}

.yaogan {
    width: 2px;
    height: 50px;
    margin: 0 auto;
    background-color: #33322e;
}

.yuan {
    width: 15px;
    height: 15px;
    margin: 0 auto;
    border-radius: 50%;
    border: 2px solid #33322e;
    background-color: #52c5d2;
}

.header {
    /* 脱离文档流不影响下面的布局 */
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.toLoginOrRegister {
    margin-top: 10px;
    margin-left: 10px;
    color: rgb(106, 104, 104);
}

.logintext {
    color: #d27a7a;
    margin-right: 5px;
    margin-left: 2px;
    padding-bottom: 3px;
    border-bottom: 1px solid #d27a7a;
    cursor: pointer;
    user-select: none;
}

.registertext {
    color: #409eff;
    border-bottom: 1px solid #409eff;
    cursor: pointer;
    user-select: none;
}

.userInfo {
    position: absolute;
    left: 0;
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    line-height: 50px;
}

.avatar {
    margin-left: 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: relative;
}

.avatar:before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 1px solid #eee;
    border-radius: 50%;
}

.avatar img {
    width: 50px;
    height: 50px;
    /* object-fit: cover; */
    border-radius: 50%;
}
</style>