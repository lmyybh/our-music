import MusicList from '../utils/music'
import { ElMessage } from 'element-plus'
import { songsUrlsReq } from '../../assets/utils/api.js'

export default {
    namespaced: true,
    state: () => {
        return {
            musics: new MusicList(),
            currentIdx: 0,
            wantToPlay: true,
            showPlayingList: false,
            toReload: false,
        }
    },
    getters: {
        currentInfo: (state: any) => {
            return state.musics.getInfo(state.currentIdx)
        },
        currentUrl: (state: any) => {
            return state.musics.getInfo(state.currentIdx).songurl
        },
        currentSongmid: (state: any) => {
            return state.musics.getInfo(state.currentIdx).songmid
        },
        numMusics: (state: any) => {
            return state.musics.length() - 1
        },
        allSongs: (state: any) => {
            const songs = state.musics.getAllSongs()
            return songs
        }
    },

    mutations: {
        clearList(state: any) {
            state.musics.clear()
        },
        addSong(state: any, data: any) {
            state.musics.append(data)
        },
        replaceMusics(state: any, songmids: Array<string>, data: any) {
            state.musics.replaceAll(songmids, data)
        },
        cutSong(state: any, offset: number) {
            state.wantToPlay = true
            let idx = state.currentIdx + offset
            if (idx < 0) {
                idx = 0
            } else if (idx >= state.musics.length()) {
                idx = state.musics.length() - 1
            }

            idx = state.musics.findNextMusicIndex(idx);
            if (idx == 0) {
                ElMessage.info('从当前位置到播放列表末尾，不存在可播放的歌曲')
                state.wantToPlay = false
            }

            state.currentIdx = idx
        },
        selectSong(state: any, index: number) {
            let idx = state.musics.findNextMusicIndex(index);
            if (idx != index) {
                ElMessage.info('当前歌曲不可播放，正在寻找下一首歌曲')
            }
            if (idx == 0) {
                ElMessage.info('从当前位置到播放列表末尾，不存在可播放的歌曲')
                state.wantToPlay = false
            }
            state.currentIdx = idx
        },
        replaceSongs(state: any, data: any) {
            const { allSongmids, reqSongs } = data
            state.musics.replaceAll(allSongmids, reqSongs)
        },
        toPlay(state: any) {
            state.wantToPlay = true
        },
        toPause(state: any) {
            state.wantToPlay = false
        },
        switchList(state: any) {
            state.showPlayingList = !state.showPlayingList
        },
        needReload(state: any) {
            state.toReload = true
        },
        notNeedReload(state: any) {
            state.toReload = false
        }
    },
    actions: {
        // async requestSongs({ commit, state }: any, songmids: Array<string>) {
        //     const toReqSongmids = state.musics.findNotInMapSongmids(allSongmids)
        // }

        async requestSongs({ commit, state }: any, songsList: Array<any>) {
            const allSongmids = songsList.map((song) => {
                return song.songmid
            })
            const toReqSongmids = state.musics.findNotInMapSongmids(allSongmids)
            let reqSongs = new Map();
            // 存在需要新获取的歌曲时，获取信息
            if (toReqSongmids.length > 0) {
                const songurls = await songsUrlsReq(toReqSongmids)
                if (!songurls || Object.keys(songurls).length <= 0) {
                    ElMessage.error('获取歌曲链接失败')
                    return
                } else {
                    let reqSongs = new Map();
                    for (let i = 0; i < songsList.length; i++) {
                        let data = songsList[i]
                        data.songurl = songurls[allSongmids[i]]
                        reqSongs.set(allSongmids[i], data)
                    }
                    commit('replaceSongs', { allSongmids, reqSongs })
                }
            } else {
                // 不存在需要新获取的歌曲时，直接按照顺序改变
                commit('replaceSongs', { allSongmids, reqSongs })
            }
        }
    }
}