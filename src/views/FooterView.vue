<script setup lang="ts">
    import {ref, watch, computed} from 'vue'
    import { useStore} from 'vuex'
    import { ElMessage } from 'element-plus'
    import {CaretRight} from "@element-plus/icons-vue"
    import ProgressBar from "../components/ProgressBar.vue"
    import MusicPlayer from "../components/MusicPlayer.vue"
    import { musicsUrlsReq } from '../request/sdk/kuwo/music'

    const store = useStore()
    const audioSrc = ref('')
    
    const currentSongmid = computed(()=>{
        return store.getters['playingList/currentSongmid']
    })

    const numMusics = computed(()=>{
        return store.getters['playingList/numMusics']
    })

    watch(currentSongmid, async (newMid, oldMid) => {
        if (newMid != '') {
            const data = await musicsUrlsReq(newMid)
            if (newMid in data) {
                audioSrc.value = data[newMid]
            } else {
                ElMessage.error('获取歌曲链接失败')
                audioSrc.value = ''
                store.commit("playingList/cutSong", 1)
            }
        } else {
            audioSrc.value = ''
        }
    })
</script>

<template>
    <div class="footer-view">
        <el-row align="middle" style="height: 100%;">
            <el-col :span="23">
                <MusicPlayer :audioSrc="audioSrc" />
            </el-col>
            <el-col :span="1" class="list-icon-container">
                <el-badge :value="numMusics" :max="99" :type="`${numMusics==0?'info':'danger'}`">
                    <el-icon :size="20" color="#666666" class="list-icon" @click="store.commit('playingList/switchList')">
                        <svg t="1668179579336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2767" width="200" height="200"><path d="M832 832a32 32 0 0 1 3.744 63.776L832 896H192a32 32 0 0 1-3.744-63.776L192 832h640z m0-304a32 32 0 0 1 3.744 63.776L832 592H192a32 32 0 0 1-3.744-63.776L192 528h640zM224.256 128.544a64 64 0 0 1 26.816 5.888L256 136.96l127.488 72.832a64 64 0 0 1 4.832 108.096l-4.8 3.04L256 393.824a64 64 0 0 1-95.52-50.016l-0.224-5.568V192.544a64 64 0 0 1 64-64z m0 64v145.696l127.488-72.864-127.488-72.832zM832 224a32 32 0 0 1 3.744 63.776L832 288H496a32 32 0 0 1-3.744-63.776L496 224H832z" p-id="2768"></path></svg>
                    </el-icon>
                </el-badge>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss">
.footer-view {
    height: 100%;
}

.list-icon-container {
    padding: 5px 0 0 10px;
}
.sound-bar .progressbar{
    margin: 0 5px;
}
.list-icon:hover {
    color: #201f1f;
    cursor: pointer;
}
</style>