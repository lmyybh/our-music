<script setup>
    import {ref, onMounted, watch} from 'vue'
    import ProgressBar from "./ProgressBar.vue"
    import {formatInterval} from '../assets/utils/utils.js'

    const props = defineProps({
        audioSrc: {
            type: String,
            default: '',
        }
    })
    const progress = ref(0)
    const preText = ref('00:00')
    const postText = ref('00:00')
    const isPlaying = ref(false)
    let canPlayThrough = false
    let audio = new Audio()
    let firstOpen = true
    let isDraging = false
    let playAfterDrag = false
    const volumeProgress = ref(audio.volume*100)

    onMounted(() => {
        changeAudio(props.audioSrc)
        
        audio.addEventListener('emptied', ()=>{
            progress.value = 0
            preText.value = formatInterval(0)
        })
        audio.addEventListener('canplaythrough', ()=>{
            postText.value = formatInterval(audio.duration)
            canPlayThrough = true
            
            if (firstOpen || isDraging || !playAfterDrag) {
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

    function changeAudio(src) {
        playAfterDrag = isPlaying.value
        canPlayThrough = false
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
        if (canPlayThrough && audio.paused) {
            play()
        } else {
            pause()
        }
    }

    function play() {
        if (firstOpen) {
            firstOpen = false
        }
        if (!audio.paused) {
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
        playAfterDrag = isPlaying.value
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
</script>

<template>
    <div class="music-player">
        <el-row align="middle" style="height: 100%;">
            <el-col :span="5">
                <el-button color="#e83c3c" circle @click="$emit('changeAudio', -1)" style="width:26px;height:26px;">
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
                <el-button color="#e83c3c" circle @click="$emit('changeAudio', 1)" style="width:26px;height:26px;margin-left: 20px;">
                    <el-icon :size="8">
                        <svg t="1667807876460" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3295" width="200" height="200"><path d="M927.803661 3.406845h-191.916935a31.986156 31.986156 0 0 0-31.986156 31.79424v386.872556L119.449527 10.539758 108.286359 2.639178A31.858211 31.858211 0 0 0 64.17745 32.034455v960.320361a31.890198 31.890198 0 0 0 44.108909 29.363292l11.131182-7.836609L703.90057 602.31563v386.872557a31.986156 31.986156 0 0 0 31.986156 31.794239h191.916935a31.986156 31.986156 0 0 0 31.986156-31.794239V35.201085a31.986156 31.986156 0 0 0-31.986156-31.79424z" p-id="3296"></path></svg>
                    </el-icon>
                </el-button>
            </el-col>
            <el-col :span="15">
                <ProgressBar :progress="progress" :preText="preText" :postText="postText" @start-drag="startDrag" @click-bar="changeTime" @end-drag="endDrag" />
            </el-col>
            <el-col :span="4" class="flex-row">
                <el-icon color="#666666" style="margin-left: 15px;">
                    <svg t="1667811111613" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5891" width="200" height="200"><path d="M528.254293 81.2544l-262.290773 168.413867H135.08608c-72.782507 0-131.669333 58.19392-131.669333 131.058346v262.505814c-0.07168 72.31488 58.484053 130.986667 130.792106 131.058346H265.960107l262.294186 168.2944c37.07904 16.128 65.785173-1.201493 65.785174-37.614933V118.87616c0-36.56704-29.504853-53.333333-65.785174-37.62176z m220.986027 211.534507c-12.107093-13.458773-32.83968-14.56128-46.298453-2.450774-13.458773 12.107093-14.56128 32.836267-2.454187 46.29504 0.293547 0.334507 0.600747 0.651947 0.914773 0.965974 6.161067 6.560427 16.513707 21.10464 27.265707 42.994346 18.346667 37.352107 29.50144 81.26464 29.50144 131.321174 0 50.059947-11.14112 94.112427-29.51168 131.324586-10.758827 21.886293-21.241173 36.440747-27.265707 42.994347-12.38016 13.253973-11.666773 34.02752 1.5872 46.40768 13.2608 12.373333 34.034347 11.666773 46.414507-1.594027 10.359467-11.008 24.521387-30.665387 38.273707-58.832213 22.725973-46.00832 36.1984-99.74784 36.1984-160.426667s-13.520213-114.285227-36.1984-160.423253c-13.899093-27.787947-28.061013-47.571627-38.42048-58.610347v0.034134h-0.006827z m201.301333-40.4992c-26.494293-44.827307-53.248-76.014933-72.00768-92.658347-13.540693-12.018347-34.266453-10.789547-46.288213 2.75456-12.025173 13.540693-10.79296 34.266453 2.75456 46.291627a205.482667 205.482667 0 0 1 17.578667 18.418346 407.432533 407.432533 0 0 1 41.70752 58.46016c38.161067 64.587093 60.99968 140.22656 60.99968 226.471254 0 86.24128-22.971733 161.76128-61.125974 226.5088a407.97184 407.97184 0 0 1-41.700693 58.453333 206.68416 206.68416 0 0 1-17.578667 18.479787c-13.54752 12.025173-14.772907 32.754347-2.747733 46.29504 12.018347 13.540693 32.754347 14.772907 46.29504 2.747733 18.752853-16.745813 45.44512-47.714987 71.994027-92.658347C994.22208 697.52832 1020.586667 610.63168 1020.586667 512.075093c0-98.56-26.23488-185.391787-70.034774-259.761493l-0.01024-0.023893z" p-id="5892"></path></svg>
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
</style>