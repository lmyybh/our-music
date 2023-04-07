import { createStore } from 'vuex'
import playingList from './modules/playingList'
import user from './modules/user'
import menu from './modules/menu'

const store = createStore({
    modules: {
        playingList: playingList,
        user: user,
        menu: menu
    }
})

export default store