//引入axios
import axios from 'axios'
//引入qs
import qs from 'qs'

//axios定义
axios.defaults.baseURL = '/api/';
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.timeout = 3000;
//axios.defaults.withCredentials = true;

// http response 拦截器
axios.interceptors.response.use(data => {
    //==============  所有请求完成后都要执行的操作  ==================
    if (data.status && data.status == 200 && data.data && data.data.status == 'error') {
        return;
    }
    return data;
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
