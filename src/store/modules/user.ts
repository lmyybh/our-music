import { ElMessage } from 'element-plus'
import { getUserSonglistsReq } from '../../assets/utils/api'
import { loginReq, logoutReq } from '../../assets/utils/server'

export default {
    namespaced: true,
    state: () => {
        return {
            username: '',
            isLogined: false,
            userSonglists: [],
        }
    },
    mutations: {
        login(state: any, username: string) {
            state.isLogined = true
            state.username = username
            window.localStorage.setItem("username", username)
        },
        logout(state: any) {
            state.isLogined = false
            state.username = ''
            window.localStorage.removeItem("username")
        },
        setUserSonglists(state: any, data: Array<any>) {
            state.userSonglists = data
        }
    },
    actions: {
        async login({ commit, state }: any, info: any) {
            const { username, password } = info;
            const name = await loginReq(username, password);
            if (name) {
                commit("login", name)
            }
        },
        async logout({ commit, state }: any) {
            if (!state.isLogined) {
                return
            }
            const isOk = await logoutReq()
            if (isOk) {
                commit("logout")
            }
        }
    }
}