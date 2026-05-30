import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import TableView from '../views/TableView.vue';
import SettingsView from '../views/SettingsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/table',
    name: 'Table',
    component: TableView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
