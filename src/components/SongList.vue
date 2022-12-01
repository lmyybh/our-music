<script setup>
  import { useRouter } from 'vue-router'
  import {getListenNumString} from '../assets/utils/utils'
  const props = defineProps({
    data: {
      type: Object,
      default: {},
    },
  })

  const router = useRouter()

  function clickSongList() {
    router.push({ 
      name: 'songlist', 
      params: { id: props.data.dissid } 
    })
  }
</script>

<template>
  <div class="song-list">
    <div class="song-list-div" @click="clickSongList">
      <div class="song-list-cover" :style="`background-image: url(${data.imgurl});`">
        <div style="display: flex; align-items: center; color: white;">
          <el-icon :size="14" style="font-weight: bold;">
            <svg t="1669284617290" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2667" width="200" height="200"><path d="M213.333333 896V128a42.666667 42.666667 0 0 1 65.706667-35.882667l597.333333 384a42.666667 42.666667 0 0 1 0 71.765334l-597.333333 384A42.666667 42.666667 0 0 1 213.333333 896z m85.333334-78.165333L774.4 512 298.666667 206.165333v611.669334z" p-id="2668"></path></svg>
          </el-icon>
          <span style="font-weight: 400;">{{getListenNumString(data.listennum)}}</span>
        </div>
        <el-button circle class="song-list-button" color="#e6e8e8cc">
          <el-icon color="#e83c3c" :size="23">
            <svg t="1667808064489" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4958" width="200" height="200"><path d="M755.2 544L390.4 874.666667c-17.066667 14.933333-44.8 14.933333-59.733333-2.133334-6.4-8.533333-10.666667-19.2-10.666667-29.866666v-661.333334c0-23.466667 19.2-42.666667 42.666667-42.666666 10.666667 0 21.333333 4.266667 27.733333 10.666666l362.666667 330.666667c17.066667 14.933333 19.2 42.666667 2.133333 59.733333 2.133333 2.133333 0 2.133333 0 4.266667z" p-id="4959"></path></svg>
          </el-icon>
        </el-button>
      </div>
      <span class="title-span">{{data.dissname}}</span>
    </div>
  </div>
</template>

<style lang="scss">
.song-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song-list-div {
  width: 170px;
  height: 230px;
}

.song-list-cover {
  width: 170px; 
  height: 170px; 
  background-size:100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 5px;
}

.num-listen {
  position: relative;
  top: -170px;
  left: 100px;
  display: flex;
  align-items: center;
  color: white;
}

.title-span {
  height: 60px;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: medium;
  line-height: 150%;
}

.song-list-div .song-list-button {
  display: none;
  width: 30px;
  height: 30px;
}

.song-list-div:hover{
  cursor: pointer;

  .song-list-button {
    display: inline-flex;
  }

  .title-span {
    color: black;
  }
}

</style>