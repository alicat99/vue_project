import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../components/HomeView.vue';
import TestInfoView from '../components/TestInfoView.vue';
import AuthView from '../components/AuthView.vue';
import UploadView from '../components/UploadView.vue';

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
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;