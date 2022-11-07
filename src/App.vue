<script setup lang="ts">
  import Header from './views/Header.vue'
</script>

<template>
  <div id="main">
    <el-container class="container">
      <el-header height="50px" style="background-color: #c62f2f;">
        <Header />
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