import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../components/HomeView.vue';
import TestInfoView from '../components/TestInfoView.vue';
import TestLoginView from '../components/TestLoginView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/Info/:id',
    name: 'Info',
    component: TestInfoView,
  },
  {
    path: '/Login',
    name: 'Login',
    component: TestLoginView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;