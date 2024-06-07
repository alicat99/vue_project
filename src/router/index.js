import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../components/HomeView.vue';
import TestInfoView from '../components/TestInfoView.vue';
import AuthView from '../components/AuthView.vue';

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
    path: '/auth/:type',
    name: 'Auth',
    component: AuthView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;