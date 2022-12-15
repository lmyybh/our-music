export default {
    namespaced: true,
    state: () => {
        return {
            items: [],
            display: false,
            userSonglists: [],
            top: 200,
            left: 200
        }
    },
    mutations: {
        showMenu(state: any) {
            state.display = true
        },
        hideMenu(state: any) {
            state.display = false
        },
        setTop(state: any, value: number) {
            state.top = value
        },
        setLeft(state: any, value: number) {
            state.left = value
        },
        changeItems(state: any, items: any) {
            state.items = items
        }
    },
}