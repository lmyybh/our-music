<script setup lang="ts">
const props = defineProps({
  progress: {
    type: Number,
    default: 12
  },
  preText: {
    type: String,
    default: '00:00'
  },
  postText: {
    type: String,
    default: '04:03'
  },
  showText: {
    type: Boolean,
    default: true
  },
  showPointer: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="progessbar-container">
    <span v-if="showText">{{preText}}</span>
    <div class="progressbar">
        <div class="line" :style="`width: ${progress >= 100 ? 100:progress}%;`"></div>
        <div v-if="showPointer" class="pointer" :style="`left: ${progress >= 100 ? 100:progress}%;`"></div>
    </div>
    <span v-if="showText">{{postText}}</span>
  </div>
</template>

<style lang="scss">
.progessbar-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.progressbar {
    flex-grow: 1;
    background-color: #c2c2c4;
    border-radius: 13px;
    margin: 0 15px;
}
.progressbar .line {
    background-color:#e83c3c;
    /* width: 0%; */
    height: 5px;
    border-radius: 10px;
}
.progressbar .pointer {
    position: absolute;
    /* left: 0%; */
    background-color: #e83c3c;
    border: 3.5px solid #ffffff;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    bottom: -4px;
    box-shadow: 1px 1px 1px #c6c6c6,
    -1px 1px 1px #c6c6c6,
    1px -1px 1px #c6c6c6,
    -1px -1px 1px #c6c6c6;
}
</style>
