<script setup>
  import {ref, computed} from 'vue'

  const props = defineProps({
    progress: {
      type: Number,
      default: 0,
    },
    preText: {
      type: String,
      default: '00:00',
    },
    postText: {
      type: String,
      default: '05:00',
    },
    showText: {
      type: Boolean,
      default: true,
    },
    showPointer: {
      type: Boolean,
      default: true,
    }
  })

  const emit = defineEmits(['clickBar', 'startDrag', 'endDrag'])

  const bar = ref(null)
  
  function getElementPosition(element) {
    let top = element.offsetTop //这是获取元素距父元素顶部的距离
    let left = element.offsetLeft
    var current = element.offsetParent //这是获取父元素
    while (current !== null) {
      //当它上面有元素时就继续执行
      top += current.offsetTop //这是获取父元素距它的父元素顶部的距离累加起来
      left += current.offsetLeft
      current = current.offsetParent //继续找父元素
    }
    return {
      left,
      top,
    }
  }

  function getBarPosition(clientX, element) {
    let clientWidth = element.clientWidth
    let x = getElementPosition(element)['left']
    let offsetX = clientX - x
    let pos = offsetX / clientWidth
    if (pos < 0) {
      pos = 0
    }
    if (pos > 1) {
      pos = 1
    }
    return pos
  }

  function clickProgressBar(e) {
    let pos = getBarPosition(e.clientX, bar.value)
    emit('startDrag')
    emit('clickBar', pos)

    document.onmousemove = function(ev) {
      pos = getBarPosition(ev.clientX, bar.value)
      emit('clickBar', pos)
    }

    document.onmouseup = function(){
      document.onmousemove = ''
      document.onmouseup = ''
      emit('endDrag')
      emit('clickBar', pos)
    }
  }
</script>

<template>
  <div class="progessbar-container">
    <span v-if="props.showText">{{props.preText}}</span>
    <div ref="bar" class="progressbar" @mousedown="clickProgressBar">
        <div class="line" :style="`width: ${props.progress >= 100 ? 100 : props.progress}%;`"></div>
        <div v-if="props.showPointer" class="pointer" :style="`left: ${props.progress >= 100 ? 100 : props.progress}%;`"></div>
    </div>
    <span v-if="props.showText">{{props.postText}}</span>
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
    cursor: pointer;
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
