const fields = ['songname', 'singer', 'songmid', 'songurl', 'albumname', 'interval', 'pay_play']

export default {
    namespaced: true,
    state: () => {
        return {
            musics: new Map(),
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
    },
    mutations: {
        replaceMusics(state, listData) {
            state.musics.clear()
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
                state.currentIdx = 0
            } else if (idx >= state.musics.size) {
                state.currentIdx = state.musics.size - 1
            } else {
                state.currentIdx = idx
            }
        },
        selectSong(state, index) {
            if (index < 0 || index >= state.musics.size) {
                return
            }
            state.currentIdx = index
            console.log(state.musics, state.currentIdx)
        },
        toPlay(state) {
            state.wantToPlay = true
        },
        toPause(state) {
            state.wantToPlay = false
        }
    }
}