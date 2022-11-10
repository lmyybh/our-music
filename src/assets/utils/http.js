//引入axios
import axios from 'axios'
import { ElMessage } from 'element-plus'

//axios定义
axios.defaults.baseURL = '/api/';
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.timeout = 3000;
//axios.defaults.withCredentials = true;

// http response 拦截器
axios.interceptors.response.use(response => {
    //==============  所有请求完成后都要执行的操作  ==================
    if (response.status && response.status == 200 && response.data && response.data.result == 200) {
        ElMessage.error(response.data.errMsg);
        return Promise.resolve({});
    }
    return response;
}, err => {
    return Promise.reject(err.response ? err.response.data : err);
});

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
