<script setup lang="ts">
  import MusicList from '../components/MusicList.vue'
</script>

<template>
  <div class="main-view">
      <RouterView />
  </div>
</template>

<style lang="scss">
.main-view {
  height: 100%;
  padding: 0 10px;
}
</style>