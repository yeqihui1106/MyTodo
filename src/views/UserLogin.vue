<template>
    <div class="login">
        <el-card class="login-card">
            <div class="login-header">
                <h3>登录</h3>
            </div>
            <div class="login-body">
                <el-form ref="loginForm" :model="loginInfo" :rules="rules" label-position="top">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="loginInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">登录</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        还没有账号？<el-link @click="goToRegister" style="color: #409eff;">注册</el-link>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import Vue from 'vue';
import { Card, Form, FormItem, Input, Button, Link, Message, MessageBox } from 'element-ui';
// Message不能全局引入,否则出错
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Card);
Vue.use(Form);
Vue.use(Input);
Vue.use(Button);
Vue.use(Link);
Vue.use(FormItem);
export default {
    data() {
        return {
            loginInfo: {
                username: '',
                password: ''
            },
            // 表单规则
            rules: {
                username: [
                    // required字段必填，trigger失去焦点验证规则
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    // required字段必填，trigger失去焦点验证规则
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    // 表单验证通过，提交登录请求
                    this.$axios.post("/login", {
                        username: this.loginInfo.username,
                        password: this.loginInfo.password,
                    }).then((response) => {
                        if (response.data.status == 0) {
                            // 保存token到vuex，但是vuex非持久化
                            // this.$store.commit("saveToken", { token: response.data.token, avatar_path: response.data.avatar_path });
                            this.$store.commit("saveToken", response.data.token);
                            this.$message({
                                message: '登录成功',
                                type: 'success'
                            });
                            return this.$router.push("/home");
                        } else {
                            return this.$message({
                                message: `${response.data.message}`,
                                type: 'error'
                            });
                        }
                    }).catch((err) => {
                        this.$message({
                            message: err.message,
                            type: 'error'
                        });
                    })
                } else {
                    // 表单验证不通过
                    return false
                }
            });
        },
        resetForm() {
            // 清空表单
            this.$refs.loginForm.resetFields();
        },
        goToRegister() {
            // 跳转到注册页面
            this.$router.push('/register');
        }
    }
};
</script>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100vh; */
    background-color: #f5f7fa;
}

.login-card {
    width: 500px;
}

.login-header {
    padding: 20px;
    text-align: center;
    background-color: #ffffff;
    border-bottom: 1px solid #ebeef5;
}

.login-body {
    padding: 20px;
    background-color: #ffffff;
}
</style>