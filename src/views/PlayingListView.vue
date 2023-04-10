<script setup>
  import {ref, computed, getCurrentInstance} from 'vue'
  import {useStore} from 'vuex'
  import cookies from 'vue-cookies'
  import MusicList from '../components/MusicList.vue'
  
  const store = useStore()
  const { proxy } = getCurrentInstance()

  const currentIndex = computed(() => {
    return store.state.playingList.currentIdx - 1
  })
  
  const tabelData = computed(()=>{
    return store.getters['playingList/allSongs']
  })

  const unableRows = ref([]) // 暂时无法判断歌曲是否可以播放

  const loginedUsername = computed(()=>{
      return store.state.user.username
  })

  const playinglistSongmidsStr = computed(() => {
    return store.getters['playingList/songmidsStr']
  })

  function publish(channel, message) {
    //发送
    proxy.goEasy.pubsub.publish({
      channel: channel,
      message: message,
      onSuccess:function(){
          console.log("消息发布成功。")
      },
      onFailed: function (error) {
          console.log("消息发送失败，错误编码："+error.code+" 错误信息："+error.content);
      }
    })
  }

  function synchronous() {
    if (loginedUsername.value != "") {
      const data = {
        "op": 'songmids',
        "token": cookies.get("token"),
        "mids": playinglistSongmidsStr.value,
        "id": store.state.playingList.currentIdx,
        "playing": store.state.playingList.isPlaying,
        "progress": store.state.playingList.progressValue
      }
      publish(loginedUsername.value, JSON.stringify(data))
    }
  }

  function rightClickList({row, event}) {
    let items = [
      {'name': '播放', 'callback': ()=>{store.dispatch("playingList/playSong", row)}},
      {'name': '从列表中删除', 'callback': ()=>{store.commit("playingList/removeSong", row.songmid)}},
    ]
    store.commit("menu/changeItems", items)
  }
</script>

<template>
  <div class="playlist-view">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2 class="playlist-title">{{'当前列表'}}</h2>
      <el-icon :size="24" @click="synchronous" color="#e74c3c" style="cursor: pointer;"><i-ep-refresh /></el-icon>
    </div>
    <div class="playlist-info">
      <span style="font-size:small; color: #cfcfcf;">{{'总'+ tabelData.length +'首'}}</span>
      <span class="clear-button" @click="store.commit('playingList/clearList')">清空列表</span>
    </div>
    <MusicList 
      class="playlist-list" 
      :data="tabelData" 
      :selectRowIndex="currentIndex"
      :unableRowIndexs="unableRows"
      :showHeader="false" 
      :showIndex="false"
      :showAlbum="false"
      @right-click="rightClickList"
      :widths="{index: 0, singer: 100, album: 0, interval: 80}"
     />
  </div>
</template>

<style lang="scss">
.playlist-view {
  height: 100%;
  padding: 20px 5px 0 5px;
  display: flex;
  flex-direction: column;
}
.playlist-title {
  font-weight: bolder;
  height: 50px; 
  line-height: 50px;
}
.playlist-info {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;

  .clear-button {
    color: #507daf;
    cursor: pointer;
  }

  .clear-button:hover {
    color: #0b58b0;
  }
}
.playlist-list {
  height: 0;
  flex: 1;
}
</style>