import { createStore } from 'vuex'
import playingList from './modules/playingList'
import user from './modules/user'

const store = createStore({
    modules: {
        playingList: playingList,
        user: user
    }
})

export default store