<script setup lang="ts">
import { computed } from 'vue';
import { useBfpStore } from '../store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const store = useBfpStore();

// サマリ計算
const currentMonthSummary = computed(() => {
  const sim = store.currentSimulation;
  if (!sim) return { income: 0, expense: 0, currentBalance: 0 };
  
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentEvents = sim.eventLogs.filter(e => e.yearmonth === currentYM);
  const income = currentEvents.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
  const expense = currentEvents.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
  
  const currentBalance = sim.bankBalanceLogs
    .filter(b => b.yearmonth === currentYM)
    .reduce((sum, b) => sum + (b.balance || 0), 0);
    
  return { income, expense, currentBalance };
});

// チャートデータ構築
const chartData = computed(() => {
  const sim = store.currentSimulation;
  if (!sim) return { labels: [], datasets: [] };

  // 1年分(12ヶ月)のラベルを生成
  const labels = Array.from(new Set(sim.bankBalanceLogs.map(b => b.yearmonth))).slice(0, 24);

  const datasets = store.data.banks.map((bank, index) => {
    // プリセットカラー
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const color = colors[index % colors.length];

    const data = labels.map(ym => {
      const log = sim.bankBalanceLogs.find(b => b.bankId === bank.id && b.yearmonth === ym);
      return log?.balance ?? 0;
    });

    return {
      label: bank.name,
      backgroundColor: color,
      borderColor: color,
      data,
      tension: 0.4
    };
  });

  return { labels, datasets };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#f8fafc' }
    }
  },
  scales: {
    x: {
      ticks: { color: '#94a3b8' },
      grid: { color: 'rgba(255,255,255,0.05)' }
    },
    y: {
      ticks: { color: '#94a3b8' },
      grid: { color: 'rgba(255,255,255,0.05)' }
    }
  }
};
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
          <p class="amount positive">¥{{ currentMonthSummary.income.toLocaleString() }}</p>
        </div>
        <div class="card glass-panel">
          <h3>今月の予定支出</h3>
          <p class="amount negative">¥{{ currentMonthSummary.expense.toLocaleString() }}</p>
        </div>
        <div class="card glass-panel">
          <h3>今月末の総残高予測</h3>
          <p class="amount" :class="{ negative: currentMonthSummary.currentBalance < 0 }">
            ¥{{ currentMonthSummary.currentBalance.toLocaleString() }}
          </p>
        </div>
      </div>

      <div class="chart-container glass-panel">
        <h3>向こう2年間の残高推移予測</h3>
        <div class="chart-wrapper">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  height: 100%;
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
  border-radius: var(--radius-lg);
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
  border-radius: var(--radius-lg);
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
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.chart-container h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
