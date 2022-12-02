<script setup>
  import {ref, watch} from 'vue'
  import { useRoute } from 'vue-router'
  import {useStore} from 'vuex'
  import { ElMessage } from 'element-plus'
  import {getSonglistInfoReq} from '../assets/utils/api'
  import {getListenNumString} from '../assets/utils/utils'
  import MusicList from '../components/MusicList.vue'

  const loading = ref(false)
  const infoData = ref(null)
  const tabelData = ref(null)
  const route = useRoute()
  const store = useStore()

  getSonglistInfo(route.params.id)
  
  watch(
    () => route.params,
    newParams => {
      getSonglistInfo(newParams.id)
    }
  )

  async function getSonglistInfo(id){
    loading.value = true
    const data = await getSonglistInfoReq(id)

    if (Object.keys(data).length>0) {
      infoData.value = data.info
      convertToTabelData(data.songlist)
    } else {
      ElMessage.error('请求错误')
    }
    loading.value = false
  }

  function convertToTabelData(songlist) {
    for (let i=0; i < songlist.length; i++) {
      songlist[i].id = i + 1 // 由于默认0位置是空链接，所以后移一位
    }
    tabelData.value = songlist
  }

  function getTimeString(stamp) {
    const date = new Date(stamp * 1000)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    return Y + M + D
  }

  function formatDescription(desc) {
    const toReomveStr = [/<br>/g, /&lt;br&gt;/g, /&#160;/g]
    let str = desc
    for (let s of toReomveStr) {
      str = str.replace(s, '')
    }
    return str
  }

  function playAll() {
    store.dispatch('playingList/requestSongs', tabelData.value)
    .then(()=>{
      store.commit('playingList/selectSong', 1)
      store.commit('playingList/needReload')
      store.commit('playingList/toPlay')
    })
  }

  function addToPlayingList() {
    store.dispatch(
      'playingList/insertSongs', 
      {
        songlists: tabelData.value, 
        index: store.state.playingList.currentIdx - 1
      }
    ).then(()=>{
      console.log(store.state.playingList.currentIdx)
    })
  }
</script>

<template>
  <div class="song-list-view">
    <div v-if="!loading && infoData != null" class="song-list-content">
      <div class="song-list-info">
        <img class="cover-image" :src="infoData.logo" />
        <div class="detail-info">
          <div>
            <div style="display: flex; align-items: center;">
              <div class="song-list-icon">歌单</div>
              <span class="songlist-title">{{infoData.dissname}}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <el-icon :size="18">
                <svg t="1669295062530" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2663" width="200" height="200"><path d="M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5-34.5-34.5-74.7-61.6-119.5-80.6-0.4-0.2-0.8-0.3-1.2-0.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-0.4 0.2-0.8 0.3-1.2 0.5-44.8 18.9-85 46-119.5 80.6-34.5 34.5-61.6 74.7-80.6 119.5C146.9 807.5 137 854 136 901.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c0.1 4.4 3.6 7.8 8 7.8h60c4.5 0 8.1-3.7 8-8.2-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" p-id="2664"></path></svg>
              </el-icon>
              <span style="color: #507daf;">{{infoData.nickname}}</span>
              <span style="margin-left: 10px;">{{getTimeString(infoData.ctime)}} 创建</span>
            </div>
          </div>
          <div>
            <el-button-group>
              <el-button type="primary" round color="#e83c3c" style="padding-left: 10px;" @click="playAll">
                <el-icon :size="18" style="margin-right: 2px;">
                  <svg t="1667808064489" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4958" width="200" height="200"><path d="M755.2 544L390.4 874.666667c-17.066667 14.933333-44.8 14.933333-59.733333-2.133334-6.4-8.533333-10.666667-19.2-10.666667-29.866666v-661.333334c0-23.466667 19.2-42.666667 42.666667-42.666666 10.666667 0 21.333333 4.266667 27.733333 10.666666l362.666667 330.666667c17.066667 14.933333 19.2 42.666667 2.133333 59.733333 2.133333 2.133333 0 2.133333 0 4.266667z" p-id="4959"></path></svg>
                </el-icon>
                播放全部
              </el-button>
              <el-button type="primary" round color="#e83c3c" style="padding: 8px;" @click="addToPlayingList">
                <el-icon :size="17"><i-ep-plus /></el-icon>
              </el-button>
            </el-button-group>
          </div>
          <div>
            <div>
              <span class="info-item">标签 : </span>
              <span v-for="tag in infoData.tags" style="margin-right: 5px; color:#507daf">{{tag.name}}</span>
            </div>
            <div>
              <span class="info-item">歌曲 : <span class="info-content">{{infoData.songnum}}</span></span>
              <span style="margin-left: 10px;" class="info-item">播放 : <span class="info-content">{{getListenNumString(infoData.visitnum)}}</span></span>
            </div>
            <el-popover :content="formatDescription(infoData.desc)" placement="bottom-start" width="500">
              <template #reference>
                <span class="info-item overflow-hidden">简介 : <span class="info-content">{{formatDescription(infoData.desc)}}</span></span>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
      <MusicList :data="tabelData" />
    </div>
    <div v-else v-loading="loading" element-loading-text="载入中" style="display: flex; justify-content: center; margin-top: 200px;">
      <el-alert v-show="!loading" center title="歌单信息加载失败" type="error" style="width: 300px;" />
    </div>
  </div>
</template>

<style lang="scss">
.song-list-info {
  width: 100%;
  display: flex;
  padding: 20px 10px;
}

.cover-image {
  width: 200px;
  height: 200px;
  border-radius: 3%;
}

.detail-info {
  margin-left: 20px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.song-list-icon {
  color: #ee4141;
  width:40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border: 1px solid;
  border-radius: 2px;
  font-size: 14px;
  margin-right: 5px;
}

.songlist-title {
  font-size: 25px;
  font-weight: bolder;
}

.info-item {
  color:#373737;
}

.info-content {
  color: #676767;
}

.overflow-hidden {
  height: 50px;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>