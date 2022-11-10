import { createStore } from 'vuex'
import playingList from './modules/playingList'

const store = createStore({
    modules: {
        playingList: playingList
    }
})

export default store