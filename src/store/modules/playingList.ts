import MusicList from '../utils/music'
import { ElMessage } from 'element-plus'
import { musicsUrlsReq, getMusicsInfoReq } from '../../request/sdk/kuwo/music'

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
            const toReqSongmids = state.musics.findNotInMapSongmids(allSongmids)
            let reqSongs = new Map();
            // 存在需要新获取的歌曲时，获取信息
            if (toReqSongmids.length > 0) {
                const songurls: any = await musicsUrlsReq(toReqSongmids)
                if (!songurls || Object.keys(songurls).length <= 0) {
                    ElMessage.error('获取未添加歌曲链接失败')
                    return
                } else if (Object.keys(songurls).length < toReqSongmids.length) {
                    ElMessage.error('部分歌曲链接获取失败')
                }

                let reqSongs = new Map();
                for (let i = 0; i < songlists.length; i++) {
                    let data = songlists[i]
                    data.songurl = songurls[allSongmids[i]]
                    reqSongs.set(allSongmids[i], data)
                }
                commit('replaceSongs', { allSongmids, reqSongs })

            } else {
                // 不存在需要新获取的歌曲时，直接按照顺序改变
                commit('replaceSongs', { allSongmids, reqSongs })
            }
        },
        async insertSongs({ dispatch, state }: any, data: any) {
            const { songlists, index } = data;
            let currentSongs = state.musics.getAllSongs()

            let toInsertSongs = songlists.filter((info: any) => {
                return !state.musics.has(info.songmid)
            })

            let songs = []
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
                const songurls: any = await musicsUrlsReq(toReqSongmids)
                if (!songurls || Object.keys(songurls).length <= 0) {
                    ElMessage.error('获取未添加歌曲链接失败')
                    return
                } else if (Object.keys(songurls).length < toReqSongmids.length) {
                    ElMessage.error('部分歌曲链接获取失败')
                }

                let reqSongs = new Map();
                for (let mid of allSongmids) {
                    let data: any
                    if (mid in songinfos) {
                        data = songinfos[mid]
                        data.songurl = songurls[mid]
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
            console.log(data)
            const songmid: string = data.songmid;
            if (!state.musics.has(songmid)) {
                const songurls: any = await musicsUrlsReq(songmid)
                data.songurl = songurls[songmid]
                commit('addSong', data)
            }
            commit('selectSong', state.musics.find(songmid))
            commit('toPlay')
        },
        async nextToPlay({ commit, state }: any, data: any) {
            const songmid: string = data.songmid;

            // 如果正在播放，忽略
            if (state.musics.getInfo(state.currentIdx).songmid == songmid) {
                return
            }

            if (!state.musics.has(songmid)) {
                const songurls: any = await musicsUrlsReq(songmid)
                data.songurl = songurls[songmid]
            } else {
                data = state.musics.getInfoBySongmid(songmid)
            }
            commit('insertSong', { index: state.currentIdx + 1, songdata: data })
            commit('selectSong', Math.max(1, state.musics.find(songmid) - 1))
        }
    }
}