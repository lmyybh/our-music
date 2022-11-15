<script setup>
  import {computed} from 'vue'
  import {useStore} from 'vuex'
  import MusicList from '../components/MusicList.vue'
  
  const store = useStore()
  const currentIndex = computed(() => {
    return store.state.playingList.currentIdx - 1
  })
  
  const tabelData = computed(()=>{
    let values = Array.from(store.state.playingList.musics.values())
    let data = []
    // 跳过第一条空链接，从 1 开始循环
    for (let i = 1; i < values.length; i++) {
      let info = {id: i}
      Object.assign(info, values[i])
      data[i-1] = info
    }
    return data
  })

</script>

<template>
  <div class="playlist-view">
    <h2 class="playlist-title">{{'当前列表'}}</h2>
    <MusicList 
      class="playlist-list" 
      :data="tabelData" 
      :selectRowIndex="currentIndex"
      :showHeader="false" 
      :showIndex="false"
      :showAlbum="false"
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
}
.playlist-list {
  height: 0;
  flex: 1;
}
</style>