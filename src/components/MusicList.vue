<script setup>
  import {ref, onMounted, watch, getCurrentInstance} from 'vue'
  import {useStore} from 'vuex'
  import {ElMessage} from 'element-plus'
  
  import {formatInterval} from '../assets/utils/utils.js'
  import {songReq} from '../assets/utils/api.js'
  
  const props = defineProps({
    data: {
      type: Array,
      default: [],
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    showAlbum: {
      type: Boolean,
      default: true,
    },
    widths: {
      type: Object,
      default: {
        index: 60,
        singer: 180,
        album: 200,
        interval: 80
      }
    },
    selectRowIndex: {
      type: Number,
      default: -1
    }
  })

  const store = useStore()
  const { proxy } = getCurrentInstance()

  onMounted(()=>{
    if (props.selectRowIndex >= 0 && props.selectRowIndex < props.data.length) {
      setCurrent(props.data[props.selectRowIndex])
    }
  })

  watch(() => props.selectRowIndex, (newIndex) => {
      setCurrent(props.data[newIndex])
  })

  function setCurrent(row) {
    proxy.$refs.table.setCurrentRow(row)
  }  

  function getAllSongmids(data) {
    let songmids = []
    for (let i = 0; i < data.length; i++) {
      songmids[i] = data[i].songmid
    }
    return songmids
  }

  function rowClick() {
    // 当外部指定 selectRowIndex 时，阻止单击改变选中项
    if (props.selectRowIndex >= 0 && props.selectRowIndex < props.data.length) {
      setCurrent(props.data[props.selectRowIndex])
    }
  }

  function rowDblClick(info) {
    store.dispatch('playingList/requestSongs', props.data)
    .then(()=>{
      store.commit('playingList/selectSong', info.id)
      store.commit('playingList/needReload')
      store.commit('playingList/toPlay')
    })
  }
</script>

<template>
  <div class="music-list">
    <el-table 
      ref="table"
      :data="data"
      :show-header="showHeader"
      highlight-current-row 
      stripe 
      style="width: 100%; height: 100%;"
      @row-click="rowClick"
      @row-dblclick="rowDblClick"
    >
      <el-table-column v-if="showIndex" type="index" :width="widths.index" /> 
      <el-table-column label="音乐标题" >
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <span>{{ scope.row.songname }}</span>
            <el-icon v-if="scope.row.pay_play" :size="18" color="#ec4141" style="margin-left: 5px;">
              <svg t="1667916347535" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2586" width="200" height="200"><path d="M897 47 122 47c-28.667 0-53.167 10-73.5 30S18 121.333 18 150l0 724c0 28.667 10.167 53 30.5 73s44.833 30 73.5 30l775 0c28.667 0 53-10 73-30s30-44.333 30-73L1000 150c0-18.667-4.5-36-13.5-52S965 69.5 949 60.5 915.667 47 897 47zM949 874c0 9.333-2.333 18-7 26s-11 14.333-19 19-16.667 7-26 7L122 926c-14.667 0-27-5.167-37-15.5S70 888 70 874L70 150c0-9.333 2.333-18 7-26s11-14.167 19-18.5 16.667-6.5 26-6.5l775 0c9.333 0 18 2.167 26 6.5s14.333 10.5 19 18.5 7 16.667 7 26L949 874zM256 678 138 377c-1.333-5.333-2-11.667-2-19 1.333-24 14.667-37.333 40-40 16 1.333 28 10.333 36 27l85 224 82-224c10-18 22.667-27 38-27 25.333 2.667 39.333 16 42 40-1.333 7.333-2.667 13.667-4 19L337 678c-10 18.667-23.333 28-40 28C277 706 263.333 696.667 256 678zM480 668 480 360c0-26.667 13.333-40.667 40-42 25.333 1.333 38.667 15.333 40 42l0 308c-1.333 25.333-14.667 38-40 38C493.333 706 480 693.333 480 668zM609 668 609 365c0-26.667 13.333-40.667 40-42l97 0c85.333 5.333 131 48 137 128-6 80-51 123-135 129l-59 0 0 88c-2 25.333-15.333 38-40 38C622.333 706 609 693.333 609 668zM689 394l0 114 54 0c34-1.333 52.333-20.333 55-57-2.667-35.333-21-54.333-55-57L689 394z" p-id="2587"></path></svg>
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="singer" label="歌手" :width="widths.singer" />
      <el-table-column v-if="showAlbum" prop="albumname" label="专辑" :width="widths.album" />
      <el-table-column label="时长" :width="widths.interval">
        <template #default="scope">
          <span>{{ formatInterval(scope.row.interval) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss">
.music-list {
  height: 100%;
}
.music-list .el-table .cell {
  white-space: nowrap;
}
</style>