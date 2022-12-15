import { createApp } from 'vue'
import GoEasy from 'goeasy'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'
import 'element-plus/theme-chalk/el-message.css'


const app = createApp(App)
app.config.globalProperties.goEasy = GoEasy.getInstance({
    host: 'hangzhou.goeasy.io', //应用所在的区域地址: [hangzhou.goeasy.io |singapore.goeasy.io]
    appkey: import.meta.env.VITE_GOEASY_APPKEY, //替换为您的应用appkey
    modules: ['pubsub']
})

app.use(router)
app.use(store)

app.mount('#app')
