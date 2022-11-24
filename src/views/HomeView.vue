<script setup lang="ts">
  import {ref} from 'vue'
  import SongListContainer from '../components/SongListContainer.vue'

  const categories = [
    {title: '热门歌单', category: 10000000},
    {title: '华语歌单', category: 165},
    {title: '粤语歌单', category: 166},
    {title: '流行歌单', category: 6},
    {title: 'KTV热歌', category: 141},
  ]
</script>

<template>
<div class="home-view">
  <div v-for="info of categories">
    <SongListContainer :title="info.title" :category="info.category" />
  </div>
</div>
</template>

<style lang="scss">
.home-view {
  padding: 20px 5px;
}
</style>