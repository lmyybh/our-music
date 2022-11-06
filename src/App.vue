<script setup lang="ts">
  import {ref} from 'vue'
  import { Search } from '@element-plus/icons-vue'
  const searchInput = ref('')
</script>

<template>
  <div id="main">
    <el-container class="container">
      <el-header height="50px" class="header">
        <el-row :gutter="10" align="middle" justify="space-around" style="height: 100%;">
          <el-col :span="6">
            <div>
              <el-icon size="20" color="white">
                <i-ep-headset />
              </el-icon>
              <span class="title"> Our Music </span>
            </div>
          </el-col>
          <el-col :span="5" :offset="8">
            <div>
              <el-input
                v-model="searchInput"
                size="small"
                placeholder="搜索音乐"
                :suffix-icon="Search"
                style="background: #db1212;"
              />
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
      </el-header>
      <el-container class="down-container">
        <el-aside width="220px" class="aside">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
      <el-footer height="50px" class="footer">footer</el-footer>
    </el-container>
  </div>
</template>


<style lang="scss">
#main {
  width: 1000px;
  height: 100vh;
  margin: auto;
  padding: 3rem 0;
}
.container {
  height: 100%;
}
.header {
  background-color: #c62f2f;
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
}
.title {
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
.down-container {
  border-left: 1px solid #d6d6d6;
  border-right: 1px solid #d6d6d6;
}
.aside {
  background-color: #f5f5f7;
  border-right: 1px solid #d6d6d6;
}
.footer {
  background-color: #f6f6f8;
  border: 1px solid #d6d6d6;
}
</style>