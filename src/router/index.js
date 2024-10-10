import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../components/HomeView.vue';
import TestInfoView from '../components/TestInfoView.vue';
import RiroBoardView from '@/components/RiroBoardView.vue';
import RiroLoginView from '@/components/RiroLoginView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/info/:id',
    name: 'Info',
    component: TestInfoView,
  },
  {
    path: '/riro/board/:url',
    name: 'RiroBoard',
    component: RiroBoardView,
  },
  {
    path: '/riro/login',
    name: 'RiroLogin',
    component: RiroLoginView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;