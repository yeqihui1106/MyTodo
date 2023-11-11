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
                        还没有账号？<el-link @click="goToRegister">注册</el-link>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import Vue from 'vue';
import { Card, Form, FormItem, Input, Button, Link, } from 'element-ui';
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
                    }).then((result) => {
                        if (result.data.status==1) {
                            this.$message.error(result.data.message);
                        } else {
                            console.log(result.data);
                            this.$store.commit("saveToken",result.data.token)
                            this.$store.commit("saveAvatarpath",result.data.avatarpath)
                            this.$message({
                                message: '登录成功，前往首页ing',
                                type: 'success'
                            });
                            this.$router.push("/home");
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                } else {
                    // 表单验证不通过
                    return false;
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
    margin-top: 50px;
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