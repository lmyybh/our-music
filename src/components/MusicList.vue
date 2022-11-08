<script setup>
  import {ref, computed} from 'vue'
  import {formatInterval} from '../assets/utils/utils.js'
  
  const props = defineProps({
    data: {
      type: Array,
      default: [],
    }
  })
</script>

<template>
  <div class="music-list">
    <el-table 
      :data="props.data"
      stripe 
      highlight-current-row 
      style="width: 100%; height: 100%;"
    >
      <el-table-column type="index" width="60" /> 
      <el-table-column prop="name" label="音乐标题"  />
      <el-table-column prop="singer" label="歌手" width="180" />
      <el-table-column prop="albumname" label="专辑" width="200" />
      <el-table-column label="时长" width="80">
        <template #default="scope">
            <span>{{ formatInterval(scope.row.interval) }}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss">
</style>