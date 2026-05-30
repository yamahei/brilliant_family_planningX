<script setup lang="ts">
import { useBfpStore } from '../store';

const store = useBfpStore();
</script>

<template>
  <div class="dashboard">
    <header class="page-header">
      <h1>ダッシュボード</h1>
      <p class="subtitle">未来の残高推移と現在のサマリ</p>
    </header>

    <!-- Empty State -->
    <div v-if="!store.hasData" class="empty-state glass-panel">
      <div class="empty-content">
        <span class="empty-icon">✨</span>
        <h2>未来の家計を予測しよう</h2>
        <p>銀行口座と、毎月の収支イベントを登録して<br>将来の残高シミュレーションを始めましょう。</p>
        <button class="glass-button primary" @click="$router.push('/settings')">
          設定を始める
        </button>
        <div style="margin-top: 1rem;">
          <button class="glass-button" @click="store.injectDummyData()">
            デモデータを入れる
          </button>
        </div>
      </div>
    </div>

    <!-- Data State -->
    <div v-else class="dashboard-content">
      <div class="summary-cards">
        <div class="card glass-panel">
          <h3>今月の予定収入</h3>
          <p class="amount positive">¥0</p>
        </div>
        <div class="card glass-panel">
          <h3>今月の予定支出</h3>
          <p class="amount negative">¥0</p>
        </div>
        <div class="card glass-panel">
          <h3>メインバンク残高</h3>
          <p class="amount">¥1,000,000</p>
        </div>
      </div>

      <div class="chart-container glass-panel">
        <h3>残高推移チャート (近日実装)</h3>
        <div class="placeholder-chart"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
}
.subtitle {
  color: var(--text-muted);
  margin-top: var(--sp-1);
}

.empty-state {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--sp-2);
}

.empty-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--sp-4);
}

.card {
  padding: var(--sp-6);
}

.card h3 {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--sp-2);
}

.amount {
  font-size: 2rem;
  font-weight: 700;
}
.amount.positive { color: var(--success-color); }
.amount.negative { color: var(--danger-color); }

.chart-container {
  padding: var(--sp-6);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.placeholder-chart {
  flex: 1;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  margin-top: var(--sp-4);
  background: rgba(255, 255, 255, 0.02);
}
</style>
