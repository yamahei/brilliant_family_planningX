import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import TableView from '../views/TableView.vue';
import BanksView from '../views/BanksView.vue';
import EventsView from '../views/EventsView.vue';

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
    path: '/banks',
    name: 'Banks',
    component: BanksView
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
