<script setup lang="ts">
  import {ref, watch} from 'vue'
  import { useRoute } from 'vue-router'
  import {useStore} from 'vuex'
  import MusicList from '../components/MusicList.vue'
  import {searchMusicsReq} from '../request/sdk/kuwo/search'

  const route = useRoute()
  const store = useStore()
  const tabelData = ref(null)
  const loading = ref(false)
  search(route.params.key, route.params.pageNo)
  
  watch(
    () => route.params,
    newParams => {
      search(newParams.key, newParams.pageNo)
    }
  )

  async function search(key, pn = 1, rn = 50){
    loading.value = true
    const searchData = await searchMusicsReq(key, rn, pn)
    tabelData.value = getMusicData(searchData)
    loading.value = false
  }

  function getMusicData(data) {
    let songlist = data.list;
    for (let i=0; i < songlist.length; i++) {
      songlist[i].id = i + 1 // 由于默认0位置是空链接，所以后移一位
      songlist[i].songmid = songlist[i].rid + ''
      songlist[i].mid = songlist[i].rid + ''
    }
    return songlist
  }

  function rightClickList({row, event}) {
    let items = [
      {'name': '播放', 'callback': ()=>{store.dispatch("playingList/playSong", row)}},
      //{'name': '下一首播放', 'callback': ()=>{store.dispatch("playingList/nextToPlay", row)}}
    ]
    store.commit("menu/changeItems", items)
  }
</script>

<template>
<div class="search-view">
    <h2 class="search-title">{{'搜索 ' + route.params.key}}</h2>
    <MusicList v-if="!loading" :data="tabelData" @right-click="rightClickList" />
    <div v-else v-loading="loading" element-loading-text="载入中"></div>
</div>
</template>

<style lang="scss">
.search-title {
    margin: 20px 0;
    font-weight: bolder;
}
.search-view .el-loading-spinner {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  .circular {
    width: 16px;
    height: 16px;
  }

  .path {
    stroke: #666666;
  }

  .el-loading-text {
    margin-left: 5px;
    color: #666666;
    font-size: 13px;
  }
}
</style>