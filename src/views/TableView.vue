<script setup lang="ts">
import { computed } from 'vue';
import { useBfpStore } from '../store';

const store = useBfpStore();

// シミュレーション結果を取得
const sim = computed(() => store.currentSimulation);

// テーブルの行（年月）のリストを生成
const yearMonths = computed(() => {
  if (!sim.value) return [];
  const yms = new Set<string>();
  sim.value.eventLogs.forEach(e => yms.add(e.yearmonth));
  sim.value.bankBalanceLogs.forEach(b => yms.add(b.yearmonth));
  return Array.from(yms).sort();
});

// 列構造のフラット化（イベント単位の列リストを作成）
const flatEventColumns = computed(() => {
  const cols: { entityId: number, categoryId: number, eventId: number, name: string }[] = [];
  store.data.entities.forEach(entity => {
    entity.categories.forEach(category => {
      category.events.forEach(event => {
        cols.push({
          entityId: entity.id,
          categoryId: category.id,
          eventId: event.id,
          name: event.name
        });
      });
    });
  });
  return cols;
});

// イベントログからマトリクス描画用のデータ構造を作る
// ym -> eventId -> sum of amount
const getAmountForEventCell = (ym: string, eventId: number) => {
  if (!sim.value) return 0;
  return sim.value.eventLogs
    .filter(e => e.yearmonth === ym && e.eventId === eventId)
    .reduce((sum, e) => sum + e.amount, 0);
};

const getBankBalance = (ym: string, bankId: number) => {
  if (!sim.value) return null;
  const log = sim.value.bankBalanceLogs.find(b => b.yearmonth === ym && b.bankId === bankId);
  return log?.balance ?? null;
};

const getEntityColspan = (entity: any) => {
  return entity.categories.reduce((sum: number, c: any) => sum + Math.max(1, c.events.length), 0);
};

const getCategoryColspan = (category: any) => {
  return Math.max(1, category.events.length);
};

const getTotalMonthlyIncome = (ym: string) => {
  if (!sim.value) return 0;
  return sim.value.eventLogs
    .filter(e => e.yearmonth === ym && e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
};

const getTotalMonthlyExpense = (ym: string) => {
  if (!sim.value) return 0;
  return sim.value.eventLogs
    .filter(e => e.yearmonth === ym && e.amount < 0)
    .reduce((sum, e) => sum + e.amount, 0);
};
</script>

<template>
  <div class="table-view">
    <header class="page-header">
      <div class="header-content">
        <h1>シミュレーション表</h1>
        <p class="subtitle">未来の収支マトリクスと予測残高</p>
      </div>
    </header>

    <div v-if="!store.hasData" class="empty-state glass-panel">
      <div class="empty-content">
        <span class="empty-icon">📊</span>
        <p>データがありません。設定メニューからデータを登録してください。</p>
      </div>
    </div>

    <div v-else class="matrix-container glass-panel">
      <table class="sim-table">
        <thead>
          <!-- 1行目: 年月, 主体, 銀行, 合計 -->
          <tr>
            <th rowspan="3" class="sticky-col sticky-col-header z-top">年月</th>
            <th v-for="entity in store.data.entities" :key="'e-'+entity.id" 
                :colspan="getEntityColspan(entity)" 
                class="entity-col sticky-header-1">
              {{ entity.name }}
            </th>
            <th rowspan="3" class="total-col sticky-header-1">収入計</th>
            <th rowspan="3" class="total-col sticky-header-1">支出計</th>
            <th v-for="bank in store.data.banks" :key="'bh1-'+bank.id" 
                rowspan="3" 
                class="bank-col sticky-header-1">
              🏦 {{ bank.name }}残高
            </th>
          </tr>
          <!-- 2行目: カテゴリ -->
          <tr>
            <template v-for="entity in store.data.entities" :key="'ec-'+entity.id">
              <th v-for="category in entity.categories" :key="'c-'+category.id" 
                  :colspan="getCategoryColspan(category)"
                  class="category-col sticky-header-2">
                {{ category.name }}
              </th>
            </template>
          </tr>
          <!-- 3行目: イベント -->
          <tr>
            <th v-for="col in flatEventColumns" :key="'ev-'+col.eventId" 
                class="event-col sticky-header-3">
              {{ col.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ym in yearMonths" :key="ym">
            <td class="sticky-col">{{ ym }}</td>
            <td v-for="col in flatEventColumns" :key="'cell-'+ym+'-'+col.eventId" 
                class="amount-cell"
                :class="{ 
                  positive: getAmountForEventCell(ym, col.eventId) > 0, 
                  negative: getAmountForEventCell(ym, col.eventId) < 0,
                  zero: getAmountForEventCell(ym, col.eventId) === 0
                }">
              {{ getAmountForEventCell(ym, col.eventId) === 0 ? '-' : getAmountForEventCell(ym, col.eventId).toLocaleString() }}
            </td>
            
            <td class="amount-cell total-cell positive">
              {{ getTotalMonthlyIncome(ym).toLocaleString() }}
            </td>
            <td class="amount-cell total-cell negative">
              {{ getTotalMonthlyExpense(ym).toLocaleString() }}
            </td>

            <td v-for="bank in store.data.banks" :key="'bc-'+ym+'-'+bank.id" 
                class="bank-cell"
                :class="{ negative: (getBankBalance(ym, bank.id) ?? 0) < 0 }">
              <span v-if="getBankBalance(ym, bank.id) === null">-</span>
              <span v-else>¥{{ getBankBalance(ym, bank.id)!.toLocaleString() }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-view {
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-12) var(--sp-6);
  border-radius: var(--radius-lg);
  text-align: center;
}
.empty-content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  align-items: center;
}
.empty-icon {
  font-size: 3rem;
}

.matrix-container {
  overflow: auto;
  border-radius: var(--radius-lg);
  max-height: calc(100vh - 180px);
  /* Firefox Scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}

.sim-table {
  border-collapse: separate;
  border-spacing: 0;
  text-align: right;
  min-width: 100%;
}

.sim-table th, .sim-table td {
  padding: var(--sp-2) var(--sp-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.sim-table th {
  background: var(--surface-2);
  color: var(--text-secondary);
  font-weight: 600;
  text-align: center;
}

/* 階層ヘッダの固定とボーダー */
.sticky-header-1 { top: 0; position: sticky; z-index: 10; border-bottom: 1px solid rgba(255,255,255,0.2); }
.sticky-header-2 { top: 40px; position: sticky; z-index: 10; border-bottom: 1px solid rgba(255,255,255,0.1); }
.sticky-header-3 { top: 76px; position: sticky; z-index: 10; border-bottom: 2px solid rgba(255,255,255,0.2); font-size: 0.85rem;}

.entity-col { background: rgba(30, 41, 59, 1) !important; }
.category-col { background: rgba(40, 53, 75, 1) !important; }
.event-col { background: rgba(50, 65, 90, 1) !important; }

/* 年月列（左側固定） */
.sticky-col {
  position: sticky;
  left: 0;
  background: var(--surface-1);
  z-index: 20;
  text-align: left;
  border-right: 2px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
}
.sticky-col-header {
  background: var(--surface-2) !important;
}
.z-top {
  z-index: 30 !important;
}

/* 数値セル */
.amount-cell {
  font-variant-numeric: tabular-nums;
}
.amount-cell.zero { color: rgba(255,255,255,0.2); }
.amount-cell.positive { color: var(--success-color); }
.amount-cell.negative { color: var(--danger-color); }

/* 合計列 */
.total-col {
  background: rgba(15, 23, 42, 1) !important;
  border-left: 2px solid rgba(255,255,255,0.1);
}
.total-cell {
  background: rgba(15, 23, 42, 0.6);
  border-left: 2px solid rgba(255,255,255,0.1);
  font-weight: 600;
}

/* 銀行列 */
.bank-col {
  background: rgba(30, 58, 138, 1) !important;
  border-left: 2px solid rgba(59, 130, 246, 0.3);
}
.bank-cell {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  background: rgba(30, 58, 138, 0.4);
  border-left: 2px solid rgba(59, 130, 246, 0.3);
}
.bank-cell.negative { 
  color: var(--danger-color); 
  background: rgba(220, 38, 38, 0.2);
}
</style>
