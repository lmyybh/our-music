<script setup lang="ts">
  import {useStore} from 'vuex'
  import HeaderView from './views/HeaderView.vue'
  import AsideView from './views/AsideView.vue'
  import FooterView from './views/FooterView.vue'
  import MainView from './views/MainView.vue'
  import PlayingListView from './views/PlayingListView.vue'

  const store = useStore()
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
</style>