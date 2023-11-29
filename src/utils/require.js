import axios from 'axios';

// 创建axios实例
const $axios = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`, // 添加令牌到请求头
  }
})

// 添加请求拦截器
$axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem("token");
  if (token) {
    // 设置请求头携带token
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
$axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default $axios;