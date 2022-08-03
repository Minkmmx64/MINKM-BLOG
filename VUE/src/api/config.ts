import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { NODE_BASE_URL } from './ApiConfig';
import { ElMessage } from "element-plus";
const Instance = axios.create({
    baseURL: NODE_BASE_URL,
    timeout: 1000000,
});

//不需要权限的 增 改 删操作
const AdmissionAction = [
    '/chat/upload/img/head',
    '/blog/post/article',
    '/user/regist',
    '/blog/article/comment',
    '/blog/comment/parise',
    'chat/upload/img/head',
    'blog/post/article',
    'user/regist',
    'blog/article/comment',
    'blog/comment/parise',
    '/blog/leave/msg',
    'blog/leave/msg',
    '/user/info',
    'user/info'
];
Instance.interceptors.request.use((config: AxiosRequestConfig) => {
    if (!config.headers) config.headers = {};
    /**
     * 该操作需要权限，添加请求头
    */
    if ((config.method === "delete" || config.method === "put" || config.method === "post") && (AdmissionAction.indexOf(config.url) === -1)) {
        config.headers.Admission = 'Admission';
    } else config.headers.Admission = 'noAdmission';

    config.headers.AuthToken = sessionStorage.getItem('u_token') === null ? '' : sessionStorage.getItem('u_token');
    return config;
});

Instance.interceptors.response.use((config: AxiosResponse) => {
    if (config.data.state === 403 || config.data.state === 500) {
        ElMessage.error(config.data.msg);
    }
    return config;
});

export function getAxios(): AxiosInstance {
    return Instance;
}