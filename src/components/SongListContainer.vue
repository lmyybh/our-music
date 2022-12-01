<script setup>
  import {ref, watch, computed, onMounted} from 'vue'
  import SongList from './SongList.vue'
  import {getSonglistsReq} from '../assets/utils/api'

  const props = defineProps({
    col: {
      type: Number,
      default: 4
    },
    title: {
      type: String,
      default: '热门歌单'
    },
    pageSize: {
      type: Number,
      default: 20
    },
    pageNo: {
      type: Number,
      default: 1
    },
    sort: {
      type: Number,
      default: 5
    },
    category: {
      type: Number,
      default: 10000000
    }
  })

  const loading = ref(false)
  const listData = ref([])

  getSongLists()

  // 转换为字符串，方便同时监听到变化
  const propsState = computed(()=>{
    return [props.pageSize, props.pageNo, props.sort, props.category].join()
  })

  watch(()=>propsState.value, (newState)=>{
    getSongLists()
  })

  async function getSongLists(){
    loading.value = true
    listData.value = await getSonglistsReq(props.pageSize, props.pageNo, props.sort, props.category)
    loading.value = false
  }

  const row = computed(()=>{
    return Math.ceil(listData.value.length / props.col)
  })

  function getData(r, c) {
    const index = (r - 1) * props.col + c - 1
    return listData[index]
  }
</script>

<template>
  <div class="song-list-container">
    <span class="container-title">{{title}}</span>
    <div style="margin-top:10px;" v-loading="loading">
      <el-row v-for="r in row" class="container-row" justify="space-between">
        <el-col v-for="c in Math.min(col, listData.length - (r-1)*col)" :span="6">
          <SongList :data="listData[(r - 1) * col + c - 1]" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss">
.container-title {
  font-size: 25px;
  font-weight: bold;
}
.container-row {
  margin-bottom: 10px;
}
</style>