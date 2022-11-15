import { ElMessage } from 'element-plus'

const fields = ['songname', 'singer', 'songmid', 'songurl', 'albumname', 'interval', 'pay_play']

function initialMusicsMap() {
    let musics = new Map()
    musics.set("empty", { songurl: '' })
    return musics
}

function getUrl(musics, index) {
    let keys = Array.from(musics.keys())
    return musics.get(keys[index]).songurl
}

function findNextSongIndex(musics, currentIndex) {
    let keys = Array.from(musics.keys())
    for (let i = currentIndex; i < keys.length; i++) {
        if (musics.get(keys[i]).songurl) {
            return i
        }
    }
    ElMessage.info('从当前位置到播放列表末尾，不存在可播放的歌曲')
    return 0
}

export default {
    namespaced: true,
    state: () => {
        return {
            musics: initialMusicsMap(),
            // [
            //     {
            //         songname: '泡沫',
            //         singer: 'G.E.M. 邓紫棋',
            //         songmid: '001X0PDf0W4lBq',
            //         songurl: 'http://isure.stream.qqmusic.qq.com/C400000HjG8v1DTWRO.m4a?guid=2796982635&vkey=1AF671D294B676D845D6D5E258904EDD6C5C6666D319B9CC257B247E0B7FB462AC37D3784CECFB762973363A61514CEC6900DF646B693544&uin=&fromtag=120032',
            //         albumname: 'Xposed',
            //         interval: 258,
            //         pay_play: false
            //     }
            // ],
            currentIdx: 0,
            wantToPlay: true,
            showPlayingList: false,
            toReload: false,
        }
    },
    getters: {
        currentUrl: (state) => {
            if (state.currentIdx < 0 || state.currentIdx >= state.musics.size) {
                return ''
            }

            let keys = Array.from(state.musics.keys())
            return state.musics.get(keys[state.currentIdx]).songurl
        },
        currentInfo: (state) => {
            if (state.currentIdx <= 0 || state.currentIdx >= state.musics.size) {
                return
            }

            let keys = Array.from(state.musics.keys())
            return state.musics.get(keys[state.currentIdx])
        },
        currentSongmid: (state) => {
            if (state.currentIdx <= 0 || state.currentIdx >= state.musics.size) {
                return ''
            }
            return Array.from(state.musics.keys())[state.currentIdx]
        },
        numMusics: (state) => {
            return state.musics.size - 1
        }
    },
    mutations: {
        replaceMusics(state, listData) {
            state.musics = initialMusicsMap()
            listData.forEach(data => {
                let music = {}
                fields.forEach((field) => {
                    music[field] = data[field]
                })
                state.musics.set(data.songmid, music)
            })
        },
        addSong(state, info) {
            state.musics.set(info.songmid, info)
        },
        cutSong(state, offset) {
            state.wantToPlay = true
            let idx = state.currentIdx + offset
            if (idx < 0) {
                idx = 0
            } else if (idx >= state.musics.size) {
                idx = state.musics.size - 1
            }

            idx = findNextSongIndex(state.musics, idx)
            if (idx == 0) {
                state.wantToPlay = false
            }

            state.currentIdx = idx
        },
        selectSong(state, index) {
            if (index < 0) {
                index = 0
            } else if (index >= state.musics.size) {
                index = state.musics.size - 1
            }

            let idx = findNextSongIndex(state.musics, index)
            if (idx != index) {
                ElMessage.info('当前歌曲不可播放，正在寻找下一首歌曲')
            }

            if (idx == 0) {
                state.wantToPlay = false
            }
            state.currentIdx = idx

        },
        toPlay(state) {
            state.wantToPlay = true
        },
        toPause(state) {
            state.wantToPlay = false
        },
        switchList(state) {
            state.showPlayingList = !state.showPlayingList
        },
        needReload(state) {
            state.toReload = true
        },
        notNeedReload(state) {
            state.toReload = false
        }
    }
}