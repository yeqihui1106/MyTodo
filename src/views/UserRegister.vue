<template>
    <div class="register">
        <el-card class="register-card">
            <div class="register-header">
                <h3>注册</h3>
            </div>
            <div class="register-body">
                <el-form ref="registerForm" :model="registerInfo" :rules="rules" label-position="top">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="registerInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="registerInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input type="password" v-model="registerInfo.confirmPassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">注册</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        已有账号？<el-link @click="goToLogin" style="color: #d27a7a;">登录</el-link>
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
            registerInfo: {
                username: '',
                password: '',
                confirmPassword: ''
            },
            rules: {
                username: [
                    // required必填项，trigger: 'blur'失焦时验证规则
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.registerInfo.password) {
                                callback(new Error('两次输入的密码不一致'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    // 表单验证通过，提交注册请求
                    this.$axios.post("/register", {
                        username: this.registerInfo.username,
                        password: this.registerInfo.password,
                    }).then(response => {
                        if (response.data.status == 0) {
                            this.$message({
                                message: '注册成功，前往登录ing',
                                type: 'success'
                            });
                            this.$router.push("/login")
                        } else {
                            this.$message.error(response.data.message);
                        }
                    }).catch((err) => {
                        this.$message({
                            message: err.message,
                            type: 'error'
                        })
                    })
                } else {
                    // 表单验证不通过
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.registerForm.resetFields();
        },
        goToLogin() {
            // 跳转到登录页面
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.register {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100vh; */
    background-color: #f5f7fa;
}

.register-card {
    width: 500px;
    height: 540px
}

.register-header {
    padding: 20px;
    text-align: center;
    background-color: #ffffff;
    border-bottom: 1px solid #ebeef5;
}

.register-body {
    padding-left: 20px;
    background-color: #ffffff;
}
</style>