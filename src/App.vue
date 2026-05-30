<script setup lang="ts">
import { onMounted } from 'vue';
import { useBfpStore } from './store';

const store = useBfpStore();

onMounted(() => {
  store.initData();
});
</script>

<template>
  <div class="app-layout">
    <nav class="sidebar glass-panel">
      <div class="logo">
        <h2>Brilliant Family Planning</h2>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-item">
          <span class="icon">📊</span>
          ダッシュボード
        </router-link>
        <router-link to="/table" class="nav-item">
          <span class="icon">📅</span>
          シミュレーション表
        </router-link>
        <router-link to="/events" class="nav-item">
          <span class="icon">💰</span>
          収支の管理
        </router-link>
        <router-link to="/banks" class="nav-item">
          <span class="icon">🏦</span>
          銀行の管理
        </router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  margin: var(--sp-4);
  padding: var(--sp-6) var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
  position: sticky;
  top: var(--sp-4);
  height: calc(100vh - var(--sp-8));
}

.logo h2 {
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all var(--trans-fast);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-item.router-link-active {
  background: var(--accent-gradient);
  color: var(--text-primary);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.icon {
  font-size: 1.25rem;
}

.main-content {
  flex: 1;
  padding: var(--sp-4) var(--sp-6);
  width: 100%;
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--trans-normal), transform var(--trans-normal);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive Minimal Consideration */
@media (max-width: 900px) {
  .app-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    flex-direction: column;
    padding: var(--sp-4);
    margin: 0;
    gap: var(--sp-4);
    border-radius: 0;
    border-bottom: 1px solid var(--border-color);
  }
  .nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  .nav-item {
    flex: 1 1 auto;
    justify-content: center;
    white-space: nowrap;
    min-width: 120px;
  }
}
</style>
