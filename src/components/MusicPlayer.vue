<script setup>
    import {ref, onMounted, watch, computed} from 'vue'
    import {useStore} from 'vuex'
    import {ElMessage} from 'element-plus'
    import ProgressBar from "./ProgressBar.vue"
    import {formatInterval} from '../assets/utils/utils'

    const props = defineProps({
        audioSrc: {
            type: String,
            default: '',
        }
    })

    let audio = new Audio()
    let isDraging = false
    
    const store = useStore()
    
    const wantToPlay = computed(()=>{
        return store.state.playingList.wantToPlay
    })
    
    const canPlayThrough = ref(false)
    const isPlaying = ref(false)
    const progress = ref(0)
    const preText = ref('00:00')
    const postText = ref('00:00')
    const volumeProgress = ref(audio.volume*100)

    onMounted(() => {
        changeAudio(props.audioSrc)
        
        audio.addEventListener('emptied', ()=>{
            progress.value = 0
            preText.value = formatInterval(0)
        })
        audio.addEventListener('ended', ()=>{
            store.commit("playingList/cutSong", 1)
        })
        audio.addEventListener('canplaythrough', ()=>{
            postText.value = formatInterval(audio.duration)
            canPlayThrough.value = true

            if (isDraging || !wantToPlay.value) {
                pause()
            } else {
                play()
            }
        })
        audio.addEventListener('timeupdate', ()=>{
            if (isNaN(audio.currentTime) || isNaN(audio.duration)) {
                return
            }
            progress.value = audio.currentTime * 100 / audio.duration
            preText.value = formatInterval(audio.currentTime)
        })
        audio.addEventListener('playing', ()=>{
            isPlaying.value = true
        })
        audio.addEventListener('waiting', ()=>{
            isPlaying.value = false
        })
        audio.addEventListener('volumechange', ()=>{
            volumeProgress.value = audio.volume * 100
        })
    })

    watch(() => props.audioSrc, (newSrc) => {
        changeAudio(newSrc)
    })

    watch(() => store.state.playingList.toReload, (newState) => {
        if (newState) {
            changeAudio('')
            store.commit('playingList/notNeedReload')
            changeAudio(props.audioSrc)
        }
    })

    const progressValueToChange = computed(()=>{
        return canPlayThrough.value ? store.state.playingList.progressValueToChange : -1
    })

    watch(progressValueToChange, (newValue) => {
        console.log('progressValueToChange', newValue)
        if (newValue > 0) {
            console.log('canPlayThrough', canPlayThrough.value)
            changeTime(newValue / 100)
            store.commit('playingList/notNeedChangeProgress')
        }
    })

    watch(isPlaying, (newState) => {
        store.commit('playingList/setIsPlaying', newState)
    })

    watch(progress, (newValue) => {
        store.commit('playingList/setProgressValue', newValue)
    })

    watch(wantToPlay, (newState) => {
        if (newState) {
            play()
        } else {
            pause()
        }
    })

    function changeAudio(src) {
        canPlayThrough.value = false
        audio.src = src
        audio.load()
        if (src === '') {
            isPlaying.value = false
            progress.value = 0
            preText.value = formatInterval(0)
            postText.value = formatInterval(0)
            return
        }
    }

    function clickPlay() {
        if (isPlaying.value) {
            pause()
            store.commit('playingList/toPause')
        } else {
            store.commit('playingList/toPlay')
            play()
        }
    }

    function play() {
        if (!audio.paused) {
            return
        }

        if (!canPlayThrough.value) {
            if (store.getters['playingList/numMusics'] == 0) {
                ElMessage.info('播放列表没有歌曲，快去点歌吧')
            } else {
                ElMessage.error('当前歌曲播放出现未知错误')
            }
            return
        }
        audio.play()
        isPlaying.value = true
    }

    function pause() {
        if (audio.paused) {
            return
        }
        audio.pause()
        isPlaying.value = false
    }

    function startDrag() {
        isDraging = true
    }

    function endDrag() {
        isDraging = false
    }

    function changeTime(pos) {
        progress.value = pos * 100
        audio.currentTime = audio.duration * pos
    }

    function changeVolume(pos) {
        audio.volume = pos
    }

    function clickVolumeIcon() {
        if (audio.volume > 0) {
            audio.volume = 0
        } else {
            audio.volume = 0.5
        }
    }
</script>

<template>
    <div class="music-player">
        <el-row align="middle" style="height: 100%;">
            <el-col :span="5">
                <el-button color="#e83c3c" circle @click="store.commit('playingList/cutSong', -1)" style="width:26px;height:26px;">
                    <el-icon :size="8">
                        <svg t="1667812984284" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2084" width="200" height="200"><path d="M96.173558 3.44649h191.906985a31.984498 31.984498 0 0 1 31.984497 31.79259v386.852497L904.453794 10.579032l11.194574-7.90017A31.85656 31.85656 0 0 1 959.754991 32.072615v960.270569a31.888544 31.888544 0 0 1-44.106623 29.361768l-11.162589-7.836202L320.06504 602.324221v386.852497a31.984498 31.984498 0 0 1-31.984497 31.792591H96.173558a31.984498 31.984498 0 0 1-31.984498-31.792591V35.23908a31.984498 31.984498 0 0 1 31.984498-31.79259z" p-id="2085"></path></svg>
                    </el-icon>
                </el-button>
                <el-button color="#e83c3c" circle @click="clickPlay" style="width:32px;height:32px;margin-left: 20px;">
                    <el-icon :size="22" v-if="isPlaying">
                        <svg t="1667825513370" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2531" width="200" height="200"><path d="M341.333333 256h113.066667c8.533333 0 14.933333 2.133333 19.2 8.533333s8.533333 12.8 8.533333 19.2v454.4c0 8.533333-2.133333 14.933333-8.533333 19.2s-12.8 8.533333-19.2 8.533334h-113.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334s-8.533333-12.8-8.533333-19.2v-454.4c0-8.533333 2.133333-14.933333 8.533333-19.2s10.666667-8.533333 19.2-8.533333z m228.266667 0h113.066667c8.533333 0 14.933333 2.133333 19.2 8.533333s8.533333 12.8 8.533333 19.2v454.4c0 8.533333-2.133333 14.933333-8.533333 19.2s-12.8 8.533333-19.2 8.533334h-113.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334s-8.533333-12.8-8.533333-19.2v-454.4c0-8.533333 2.133333-14.933333 8.533333-19.2s10.666667-8.533333 19.2-8.533333z" p-id="2532"></path></svg>
                    </el-icon>
                    <el-icon :size="18" v-else>
                        <svg t="1667808064489" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4958" width="200" height="200"><path d="M755.2 544L390.4 874.666667c-17.066667 14.933333-44.8 14.933333-59.733333-2.133334-6.4-8.533333-10.666667-19.2-10.666667-29.866666v-661.333334c0-23.466667 19.2-42.666667 42.666667-42.666666 10.666667 0 21.333333 4.266667 27.733333 10.666666l362.666667 330.666667c17.066667 14.933333 19.2 42.666667 2.133333 59.733333 2.133333 2.133333 0 2.133333 0 4.266667z" p-id="4959"></path></svg>
                    </el-icon>
                </el-button>
                <el-button color="#e83c3c" circle @click="store.commit('playingList/cutSong', 1)" style="width:26px;height:26px;margin-left: 20px;">
                    <el-icon :size="8">
                        <svg t="1667807876460" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3295" width="200" height="200"><path d="M927.803661 3.406845h-191.916935a31.986156 31.986156 0 0 0-31.986156 31.79424v386.872556L119.449527 10.539758 108.286359 2.639178A31.858211 31.858211 0 0 0 64.17745 32.034455v960.320361a31.890198 31.890198 0 0 0 44.108909 29.363292l11.131182-7.836609L703.90057 602.31563v386.872557a31.986156 31.986156 0 0 0 31.986156 31.794239h191.916935a31.986156 31.986156 0 0 0 31.986156-31.794239V35.201085a31.986156 31.986156 0 0 0-31.986156-31.79424z" p-id="3296"></path></svg>
                    </el-icon>
                </el-button>
            </el-col>
            <el-col :span="16">
                <ProgressBar :progress="progress" :preText="preText" :postText="postText" @start-drag="startDrag" @click-bar="changeTime" @end-drag="endDrag" />
            </el-col>
            <el-col :span="3" class="flex-row volume">
                <el-icon color="#666666" style="margin-left: 15px;cursor: pointer;" @click="clickVolumeIcon">
                    <svg v-if="volumeProgress==0" t="1668094491961" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3782" width="200" height="200"><path d="M0.002433 672V352a53.393333 53.393333 0 0 1 53.333334-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.335767 106.666667v189.413333L41.435767 724A53.42 53.42 0 0 1 0.002433 672z m633.753334-452.42a21.333333 21.333333 0 0 0-30.173334 0l-597.333333 597.333333a21.333333 21.333333 0 0 0 30.173333 30.173334L158.1691 725.333333h67.666667l207.08 207.086667A21.333333 21.333333 0 0 0 469.335767 917.333333V414.166667l164.42-164.413334a21.333333 21.333333 0 0 0 0-30.173333z" fill="#5C5C66" p-id="3783"></path></svg>
                    <svg v-else-if="volumeProgress<=50" t="1668094513436" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3924" width="200" height="200"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m176.753334 299.726666a21.333333 21.333333 0 0 0-33.486667 26.433334 127.366667 127.366667 0 0 1 0 158.346666 21.333333 21.333333 0 0 0 33.493333 26.433334 170.733333 170.733333 0 0 0 0-211.213334z" fill="#5C5C66" p-id="3925"></path></svg>
                    <svg v-else t="1668094535795" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4066" width="200" height="200"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m146.793334 296.2a21.333333 21.333333 0 0 0-3.526667 29.96 127.366667 127.366667 0 0 1 0 158.346666 21.333333 21.333333 0 0 0 33.493333 26.433334 170.733333 170.733333 0 0 0 0-211.213334 21.333333 21.333333 0 0 0-29.966666-3.526666z m212.213333-19.3A339.393333 339.393333 0 0 0 753.333333 270.666667a346.585333 346.585333 0 0 0-22.046666-20.213334 21.333333 21.333333 0 1 0-27.446667 32.666667c6.666667 5.586667 13.146667 11.553333 19.333333 17.726667C779.6 357.22 810.666667 432.22 810.666667 512s-31.066667 154.78-87.48 211.186667c-6.173333 6.173333-12.666667 12.14-19.333334 17.726666a21.333333 21.333333 0 1 0 27.446667 32.666667 346.585333 346.585333 0 0 0 22.046667-20.213333 341.706667 341.706667 0 0 0 74.98-369.793334z" fill="#5C5C66" p-id="4067"></path></svg>
                </el-icon>
                <ProgressBar :progress="volumeProgress" :showText="false" :showPointer="false" @start-drag="" @click-bar="changeVolume" @end-drag="" />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss">
.el-button:focus {
    background-color:#e83c3c;
}
.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.volume {
    .progressbar {
        margin: 0 0 0 5px;
    }
}
</style>