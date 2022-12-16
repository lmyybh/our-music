<script setup lang="ts">
  import {ref, computed} from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'
  import {parseCookiesStr} from '@/assets/utils/utils'
  import {setCookiesReq, getCookiesReq} from '@/assets/utils/api'
  
  const searchKey = ref('')
  const cookiesDialogVisible = ref(false)
  const cookies = ref('')
  const router = useRouter()
  const store = useStore()

  const username = computed(()=>{
      const name = store.state.user.username
      return name == "" ? "未登录" : name
  })

  function search() {
    router.push({ 
      name: 'search', 
      params: { key: searchKey.value, pageNo: 1 } 
    })
  }

  function clickAppIcon() {
    router.push({
      name: 'home'
    })
  }

  async function setCookies() {
    if (cookies.value == "") {
      ElMessage.warning("cookies值不能为空")
      return
    }
    let cookiesStr = parseCookiesStr(cookies.value)
    if (cookiesStr == "") {
      ElMessage.warning("未获取到cookies值")
      return
    }
    const state = await setCookiesReq(cookiesStr);
    if (state) {
      cookies.value = ""
      cookiesDialogVisible.value = false
      ElMessage.success("cookies设置成功")
      const res = await getCookiesReq();
      if (res) {
        store.dispatch("user/getUserSonglists")
      }
    } else {
      ElMessage.error("cookies设置失败")
    }
  }
</script>


<template>
  <div class="header">
      <el-row :gutter="10" align="middle" justify="space-around" style="height: 100%;">
          <el-col :span="6" >
            <div class="flex-row">
              <el-icon size="20" color="white">
                <svg t="1667811966609" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10185" width="200" height="200"><path d="M980.433455 4.635927a18.8416 18.8416 0 0 0-14.689746-4.486982l-577.163636 74.677528A18.618182 18.618182 0 0 0 372.363636 93.277091v663.049309C338.366836 715.459491 284.355491 688.872727 223.418182 688.872727c-102.660655 0-186.181818 75.1616-186.181818 167.563637s83.521164 167.563636 186.181818 167.563636 186.181818-75.1616 186.181818-167.563636c0-4.319418-0.353745-8.564364-0.726109-12.790691 0.242036-1.210182 0.726109-2.308655 0.726109-3.574691V300.087855l539.927273-69.874037v339.912146C915.530473 529.277673 861.519127 502.690909 800.581818 502.690909c-102.660655 0-186.181818 75.1616-186.181818 167.563636s83.521164 167.563636 186.181818 167.563637c101.729745 0 184.562036-73.839709 186.051491-165.087418 0-0.242036 0.130327-0.446836 0.130327-0.688873V18.618182a18.580945 18.580945 0 0 0-6.330181-13.982255z" p-id="10186"></path></svg>
              </el-icon>
              <span class="title" @click="clickAppIcon"> Our Music </span>
            </div>
          </el-col>
          <el-col :span="5" :offset="8">
            <div class="flex-row search-box">
              <input :clearable="false" type="search" placeholder="search" v-model="searchKey" @keyup.enter.native="search">
              <el-icon :size="12" @click="search" style="cursor: pointer;"><i-ep-search /></el-icon>
            </div>
          </el-col>
          <el-col :span="3">
            <div>
              <el-dropdown>
                <div class="user">
                  <el-avatar
                  :size="30"
                    src="https://pic1.zhimg.com/v2-4e330036cbeb7eeda02a6c62f7db52bc_b.jpg"
                  />
                  <span>
                    {{username}}
                    <el-icon style="margin-left: 0;">
                      <i-ep-arrow-down />
                    </el-icon>
                  </span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="()=>{cookiesDialogVisible=true}">Cookies</el-dropdown-item>
                    <el-dropdown-item @click="store.dispatch('user/logout')">注销</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
  </div>

  <el-dialog
    class="cookies-dialog"
    v-model="cookiesDialogVisible"
    title="设置 QQApi Cookies"
    align-center
  >
    <div class="cookies-form">
      <textarea class="info-input" placeholder="cookies" v-model="cookies" ></textarea>
      <button @click="setCookies">提交</button>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.header {
    height: 100%;
}
.search-box {
  height: 25px;
  background-color: white;
  padding: 2px 10px;
  border-radius: 15px;
  justify-content: space-between;

  input {
    width: 90%;
    height: 100%;
    outline: none;
    border: none;
  }

  input::-webkit-search-cancel-button {
    display: none;
  }
}
.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.title {
  cursor: pointer;
  margin-left: 5px;
  font-size: large;
  font-weight: 500;
  color: white;
}
.el-input {
  --el-input-border-radius: 15px;
}
.user {
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
    color: white;
    font-size: small;
  }
}
.cookies-dialog {
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

.cookies-form {
  textarea,
  button {
    width: 80%;
    margin-left: 10%;
    margin-bottom: 25px;
    height: 40px;
    border-radius: 5px;
    outline: 0;
    -moz-outline-style: none;
  }

  textarea {
    overflow: hidden;
    height: 150px;
    border: 1px solid #bbb;
    padding: 10px;
    font-size: 16px;
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