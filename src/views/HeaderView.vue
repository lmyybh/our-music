<script setup lang="ts">
    import {ref} from 'vue'
    import { useRouter } from 'vue-router'
    
    const searchKey = ref('')
    const router = useRouter()

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
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  />
                  <span>
                    未登录
                    <el-icon style="margin-left: 0;">
                      <i-ep-arrow-down />
                    </el-icon>
                  </span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>登录</el-dropdown-item>
                    <el-dropdown-item>注销</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
  </div>
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
</style>