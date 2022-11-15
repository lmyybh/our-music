<script setup lang="ts">
  import {ref, watch} from 'vue'
  import { useRoute } from 'vue-router'
  import MusicList from '../components/MusicList.vue'
  import {searchReq} from '../assets/utils/api.js'

  const route = useRoute()
  const tabelData = ref(null)
  const loading = ref(false)
  search(route.params.key, route.params.pageNo)
  
  watch(
    () => route.params,
    newParams => {
      search(newParams.key, newParams.pageNo)
    }
  )

  async function search(key, pageNo = 1, pageSize = 100){
    loading.value = true
    const res = await searchReq(key, pageNo, pageSize)
    convertToTabelData(res)
    loading.value = false
  }

  function convertToTabelData(searchData) {
    let data = []
    for (let i=0; i < searchData.length; i++) {
        data[i] = {
            id: i+1, // 由于默认0位置是空链接，所以后移一位
            songmid: searchData[i].songmid,
            songname: searchData[i].songname,
            singer: searchData[i].singer[0].name,
            albumname: searchData[i].albumname,
            interval: searchData[i].interval,
            pay_play: searchData[i].pay.pay_play == 1
        }
    }
    tabelData.value = data
  }
</script>

<template>
<div class="search-view">
    <h2 class="search-title">{{'搜索 ' + route.params.key}}</h2>
    <MusicList v-if="!loading" :data="tabelData" />
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