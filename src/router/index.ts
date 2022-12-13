import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import SongListView from '../views/SongListView.vue'
import { checkTokenReq } from '@/assets/utils/server'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search/:key/:pageNo',
      name: 'search',
      component: SearchView
    },
    {
      path: '/songlist/:id',
      name: 'songlist',
      component: SongListView
    },
    {
      path: '/usonglist/:id',
      name: 'usonglist',
      component: SongListView
    }
  ]
})

router.beforeEach(async (to, from) => {
  const state = await checkTokenReq()
  if (!state) {
    store.commit("user/logout")
  } else {
    store.commit("user/login", window.localStorage.getItem("username"))
  }
})

export default router
