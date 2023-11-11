<template>
    <div>
       
        <div class="header" v-if="username">
            <p>你好,{{ username }}</p>
            <div class="avatar">
                <input type="file" ref="fileInput" name="avatar" style="display: none" @change="handleFileChange">
                <img :src="avatarPath" alt="选择文件" id="avatarImage" @click="openFileInput">
            </div>
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
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState({
            username: state => state.username,
            // 后端设置静态资源提供访问，直接访问本地端口+文件名
            avatarPath: state => {
                // 因为动态绑定图片相对路径不可用，需要require来加载图片
                if (state.avatarpath == "../assets/defultAvatar.png") {
                    return require("../assets/defultAvatar.png")
                } else {
                    return state.avatarpath
                }
            },
        })
    },
    methods: {
        openFileInput() {
            this.$refs.fileInput.click(); // 触发文件选择框的点击事件
        },
        handleFileChange(event) {
            const file = event.target.files[0]; // 获取用户选择的文件
            // 实例化一个空FromData对象，它可以作为包含文件的表单数据上传给后端
            const fromData = new FormData();
            // 将文件添加进fromData，并命名位avatar，后端根据此名接收文件
            fromData.append("avatar", file);
            this.$axios.post("/changeAvatar", fromData).then((result) => {
                console.log(result.data);
                if (result.data.status !== 0) return alert(result.data.message);
                // 保存新的头像地址
                this.$store.commit("saveAvatarpath", result.data.avatarpath)
            }).catch((err) => {
                console.error(err);
            });
        },
    }
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
    border: 2px solid hsl(48, 5%, 19%);
    background-color: #52c5d2;
}

.header {
    position: absolute;
    right: 0;
    display: flex;
    line-height: 62px;
    font-size: 20px;
}

.avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px 20px 0 10px;
    padding: 4px;
    border: 2px solid #87d6f5;
}

</style>