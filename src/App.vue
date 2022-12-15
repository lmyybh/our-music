<script setup lang="ts">
  import {ref, computed, watch, getCurrentInstance} from 'vue'
  import {useStore} from 'vuex'
  import { ElMessage } from 'element-plus'
  import cookies from 'vue-cookies'
  import HeaderView from './views/HeaderView.vue'
  import AsideView from './views/AsideView.vue'
  import FooterView from './views/FooterView.vue'
  import MainView from './views/MainView.vue'
  import PlayingListView from './views/PlayingListView.vue'
  import {getCookiesReq} from './assets/utils/api'
  
  const { proxy } = getCurrentInstance()
  const store = useStore()

  const loginDialogVisible = ref(true)
  const username = ref('')
  const password = ref('')

  const loginedUsername = computed(()=>{
      return store.state.user.username
  })
  
  const showLoginDialog = computed(() => {
    return !store.state.user.isLogined
  })

  init()
  
  // 根据登录的账号确定订阅的 channel
  watch(loginedUsername, (newUsername, oldUsername) => {
    if (newUsername == '') {
      unsubscribe(oldUsername)
    } else {
      subscribe(newUsername)
    }
  })

  async function init() {
    const res = await getCookiesReq()
    if (res) {
      store.dispatch("user/getUserSonglists")
    }
    connect()
  }

  async function login() {
    if (username.value == "" || password.value == "") {
      ElMessage.warning("用户名或密码不能为空")
    } 
    await store.dispatch("user/login", {username: username.value, password: password.value})
    if (store.state.user.isLogined) {
      username.value = ''
      password.value = ''
    }
  }
  
  function connect() {
    proxy.goEasy.connect({
      onSuccess: function () {  //连接成功
        console.log("GoEasy connect successfully.") //连接成功
      },
      onFailed: function (error) { //连接失败
        console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content)
      },
      onProgress:function(attempts) { //连接或自动重连中
        console.log("GoEasy is connecting", attempts)
      }
    })
  }

  function disconnect() {
    proxy.goEasy.disconnect({
        onSuccess: function(){
            console.log("GoEasy disconnect successfully.")
        },
        onFailed: function(error){
            console.log("Failed to disconnect GoEasy, code:"+error.code+ ",error:"+error.content);
        }
    });
  }

  function subscribe(channel) {
    //订阅消息
    proxy.goEasy.pubsub.subscribe({
      channel: channel,//替换为您自己的channel
      onMessage: function (message) { //收到消息
        const data = JSON.parse(message.content)
        if (data.token == cookies.get("token")) {
          return
        }
        console.log(data)
        switch(data.op) {
          case "songmids":
            if (data.mids.length <= 0) {
              store.commit('playingList/clearList')
              return
            }
            const songmids = data.mids.split(',')
            store.dispatch('playingList/requestSongsBySongmids', songmids)
            .then(()=>{
              store.commit('playingList/selectSong', data.id)
              store.commit('playingList/needChangeProgress', data.progress)
              if (data.playing) {
                store.commit('playingList/toPlay')
              } else {
                store.commit('playingList/toPause')
              }
            })
            break
          default:
            break
        }
      },
      onSuccess: function () {
        console.log(`Channel: ${channel} 订阅成功。`)
      },
      onFailed: function (error) {
        console.log(`Channel: ${channel} 订阅失败, 错误编码：` + error.code + " 错误信息：" + error.content)
      }
    })
  }

  function unsubscribe(channel) {
    // 取消订阅
    proxy.goEasy.pubsub.unsubscribe({
      channel: channel,
      onSuccess: function () {
        console.log(`Channel: ${channel} 订阅取消成功。`)
      },
      onFailed: function (error) {
        console.log(`取消 Channel: ${channel} 订阅失败，错误编码：` + error.code + " 错误信息：" + error.content)
      }
    })
  }

  
</script>

<template>
  <div id="main">
    <el-container class="container">
      <el-header height="50px" style="background-color: #c62f2f;">
        <HeaderView />
      </el-header>
      <el-container class="down-container">
        <el-aside width="220px" class="aside">
          <AsideView />
        </el-aside>
        <el-main>
          <el-scrollbar>
            <MainView />
          </el-scrollbar>
          <div class="playlist" v-show="store.state.playingList.showPlayingList">
            <PlayingListView />
          </div>
        </el-main>
      </el-container>
      <el-footer height="50px" class="footer">
        <FooterView />
      </el-footer>
    </el-container>
  </div>

  <el-dialog
    v-if="showLoginDialog"
    v-model="loginDialogVisible"
    class="login-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    title="用户登录"
    align-center
  >
    <div class="login-form">
      <input class="info-input" type="text" placeholder="用户名" v-model="username">
      <input class="info-input" type="password" placeholder="密码" v-model="password">
      <button @click="login">登录</button>
    </div>
  </el-dialog>
</template>


<style lang="scss">
#main {
  width: 1000px;
  height: 100vh;
  margin: auto;
  padding: 3rem 0;
  user-select: none;
}
.container {
  height: 100%;
}
.down-container {
  height: 80%;
  border-left: 1px solid #d6d6d6;
  border-right: 1px solid #d6d6d6;
}
.aside {
  background-color: #f5f5f7;
  border-right: 1px solid #d6d6d6;
}
.el-main {
  padding: 0;
}
.footer {
  background-color: #f6f6f8;
  border: 1px solid #d6d6d6;
}
.playlist {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  z-index: 5;
  box-shadow: -3px 0px 0px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 5px;
  background-color: white;
}
.login-dialog {
  width: 350px;
  border-radius: 5px;

  .el-dialog__header {
    text-align: center;
    margin: 0;
    
    .el-dialog__title {
      font-weight: 550;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }
}

.login-form {
  input[type="text"],
  input[type="password"],
  button {
    width: 80%;
    margin-left: 10%;
    margin-bottom: 25px;
    height: 40px;
    border-radius: 5px;
    outline: 0;
    -moz-outline-style: none;
  }

  input[type="text"],
  input[type="password"] {
    border: 1px solid #bbb;
    padding: 0 0 0 10px;
    font-size: 14px;
    &:focus {
      border: 1px solid #3498db;
    }
  }

  button {
    background: #e74c3c;
    border:none;
    color: white;
    font-size: 18px;
    font-weight: 200;
    cursor: pointer;
    transition: box-shadow .4s ease;
    
    &:hover {
      box-shadow: 1px 1px 5px #555;  
    }
      
    &:active {
        box-shadow: 1px 1px 7px #222;  
    }
    
  }
}

</style>