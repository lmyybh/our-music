<script setup lang="ts">
  import {ref} from 'vue'
  import SongListContainer from '../components/SongListContainer.vue'

  const categories = [
    {title: '经典', id: 1265},
    {title: 'KTV', id: 361},
    {title: '情歌', id: 2200},
    {title: '流行', id: 393},
    {title: '安静', id: 67},
    {title: '古风', id: 127},
    {title: '影视', id: 180},
  ]
</script>

<template>
<div class="home-view">
  <div v-for="info of categories">
    <SongListContainer :title="info.title" :id="info.id" />
  </div>
</div>
</template>

<style lang="scss">
.home-view {
  padding: 20px 5px;
}
</style>