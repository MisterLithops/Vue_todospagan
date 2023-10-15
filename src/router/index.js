import { createRouter, createWebHistory } from 'vue-router'
import PagInicio from '../views/PagInicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      // component: ()=>import('../views/Pag404.vue')
      component: PagInicio
    },
    {
      path: '/buscar',
      name: 'buscar',
      component: ()=>import('../views/PagBuscarGrupo.vue')
    },
    {
      path: '/nuevo',
      name: 'nuevo',
      component: ()=>import('../views/PagNuevoGrupo.vue')
    },
    {
      path: '/cambalache/:id',
      name: 'cambalache',
      component: ()=>import('../views/PagCambalache.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'noPag',
      component: ()=>import('../views/Pag404.vue')
    }
  ]
})

export default router
