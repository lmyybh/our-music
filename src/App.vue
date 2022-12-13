<script setup lang="ts">
  import {ref, computed} from 'vue'
  import {useStore} from 'vuex'
  import HeaderView from './views/HeaderView.vue'
  import AsideView from './views/AsideView.vue'
  import FooterView from './views/FooterView.vue'
  import MainView from './views/MainView.vue'
  import PlayingListView from './views/PlayingListView.vue'
  import {getCookieReq} from './assets/utils/api'
  
  const store = useStore()

  const username = ref('')
  const password = ref('')
  
  const loginDialogVisible = computed(()=>{
    return !store.state.user.isLogined;
  })

  async function login() {
    await store.dispatch("user/login", {username: username.value, password: password.value})
    if (store.state.user.isLogined) {
      username.value = ''
      password.value = ''
    }
  }

  let socket

  init()

  async function init() {
    await getCookieReq()
    //connect()
  }
  
  // function connect() {
  //   socket = new WebSocket("ws://localhost:52121/playlist/socket")
  //   socket.onopen = socketOpen
  //   socket.onerror = socketError
  //   socket.onmessage = socketMessage
  //   socket.onclose = socketClose
  // }

  // function socketOpen() {
  //   console.log('open')
  //   socket.send("123")
  // }

  // function socketError() {
  //   console.log('error')
  // }

  // function socketMessage(msg) {
  //   console.log('message', msg)
  // }

  // function socketClose() {
  //   console.log('close')
  // }
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
    class="login-dialog"
    v-model="loginDialogVisible"
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