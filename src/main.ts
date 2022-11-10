import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'
import 'element-plus/theme-chalk/el-message.css'


const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
