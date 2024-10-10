import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../components/HomeView.vue';
import TestInfoView from '../components/TestInfoView.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;