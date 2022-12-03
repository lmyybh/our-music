import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import SongListView from '../views/SongListView.vue'

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

export default router
