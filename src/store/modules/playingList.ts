import MusicList from '../utils/music'
import { ElMessage } from 'element-plus'
import { getMusicsInfoReq } from '../../request/sdk/kuwo/music'

const MAX_NUM = 100

export default {
    namespaced: true,
    state: () => {
        return {
            musics: new MusicList(),
            currentIdx: 0,
            wantToPlay: true,
            showPlayingList: false,
            toReload: false,
            isPlaying: false,
            progressValue: 0,
            progressValueToChange: -1, // 用于标识需要把进度条调到哪里, 复数表示不用调
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
        },
        songmidsStr: (state: any) => {
            const mids = state.musics.list.slice(1, MAX_NUM + 1)
            return mids.join(',')
        }
    },

    mutations: {
        clearList(state: any) {
            state.currentIdx = 0
            state.musics.clear()
        },
        addSong(state: any, data: any) {
            state.musics.append(data)
        },
        removeSong(state: any, songmid: string) {
            if (state.musics.has(songmid)) {
                let idx = state.musics.find(songmid)
                state.musics.remove(songmid)
                if (idx < state.currentIdx) {
                    state.currentIdx -= 1
                } else {
                    this.commit("playingList/selectSong", state.currentIdx)
                }
            }
        },
        insertSong(state: any, data: any) {
            const { index, songdata } = data
            state.musics.insert(index, songdata)
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
            state.currentIdx = idx
        },
        selectSong(state: any, index: number) {
            state.currentIdx = index
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
        },
        setIsPlaying(state: any, value: boolean) {
            state.isPlaying = value
        },
        setProgressValue(state: any, value: number) {
            state.progressValue = value
        },
        needChangeProgress(state: any, value: number) {
            state.progressValueToChange = value
        },
        notNeedChangeProgress(state: any) {
            state.progressValueToChange = -1
        }
    },
    actions: {
        async requestSongs({ commit, state }: any, songlists: Array<any>) {
            const allSongmids = songlists.map((song) => {
                return song.songmid
            })
            
            let reqSongs = new Map();
            for (let i = 0; i < songlists.length; i++) {
                reqSongs.set(songlists[i].songmid, songlists[i])
            }
            commit('replaceSongs', { allSongmids, reqSongs })
        },
        async insertSongs({ dispatch, state }: any, data: any) {
            const { songlists, index } = data;
            let currentSongs = state.musics.getAllSongs()

            let toInsertSongs = songlists.filter((info: any) => {
                return !state.musics.has(info.songmid)
            })

            let songs: any = []
            songs.push(...currentSongs.slice(0, index + 1))
            songs.push(...toInsertSongs)
            songs.push(...currentSongs.slice(index + 1, currentSongs.length))

            await dispatch("requestSongs", songs)
        },
        async requestSongsBySongmids({ commit, state }: any, allSongmids: Array<string>) {
            const toReqSongmids = state.musics.findNotInMapSongmids(allSongmids)
            let reqSongs = new Map();
            if (toReqSongmids.length > 0) {
                const songinfos: any = await getMusicsInfoReq(toReqSongmids)
                if (!songinfos || Object.keys(songinfos).length <= 0) {
                    ElMessage.error('获取未添加歌曲信息失败')
                    return
                } else if (Object.keys(songinfos).length < toReqSongmids.length) {
                    ElMessage.error('部分歌曲信息获取失败')
                }

                let reqSongs = new Map();
                for (let mid of allSongmids) {
                    let data: any
                    if (mid in songinfos) {
                        data = songinfos[mid]
                    } else if (state.musics.has(mid)) {
                        data = state.musics.getInfoBySongmid(mid)
                    } else {
                        continue
                    }
                    reqSongs.set(mid, data)
                }
                commit('replaceSongs', { allSongmids, reqSongs })

            } else {
                // 不存在需要新获取的歌曲时，直接按照顺序改变
                commit('replaceSongs', { allSongmids, reqSongs })
            }
        },
        async playSong({ commit, state }: any, data: any) {
            const songmid: string = data.songmid;
            if (!state.musics.has(songmid)) {
                commit('addSong', data)
            }
            commit('selectSong', state.musics.find(songmid))
            commit('toPlay')
        },
        // TODO: 未实现下一首歌的逻辑
        // async nextToPlay({ commit, state }: any, data: any) {
        //     const songmid: string = data.songmid;

        //     // 如果正在播放，忽略
        //     if (state.musics.getInfo(state.currentIdx).songmid == songmid) {
        //         return
        //     }

        //     if (!state.musics.has(songmid)) {
        //         commit('insertSong', { index: state.currentIdx + 1, songdata: data })
        //     } else {
        //         // 交换下一首歌
        //         const idx = state.music.find(songmid)
        //         state.musics.list[idx] = state.musics.list[state.currentIdx + 1]
        //     }
            
        //     commit('selectSong', Math.max(1, state.musics.find(songmid) - 1))
        // }
    }
}