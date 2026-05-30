<script setup lang="ts">
import { ref } from 'vue';
import { useBfpStore } from '../store';

const store = useBfpStore();
const activeTab = ref<'banks' | 'events'>('banks');

// --- 銀行タブ用のステートと関数 ---
const showBankModal = ref(false);
// TODO: 銀行の編集ロジック

// --- 収支（イベント）タブ用のステートと関数 ---
const showEventModal = ref(false);
// TODO: イベントの編集ロジック

</script>

<template>
  <div class="settings-view">
    <header class="page-header">
      <div class="header-content">
        <h1>家計の設定</h1>
        <p class="subtitle">銀行口座と毎月の収支（イベント）を管理します</p>
      </div>
      <div class="tabs glass-panel">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'banks' }"
          @click="activeTab = 'banks'"
        >
          🏦 銀行の管理
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'events' }"
          @click="activeTab = 'events'"
        >
          💰 収支の管理
        </button>
      </div>
    </header>

    <main class="settings-content">
      <!-- 銀行管理タブ -->
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'banks'" class="tab-pane" key="banks">
          <div class="pane-header">
            <h2>登録されている銀行</h2>
            <button class="glass-button primary" @click="showBankModal = true">＋ 新規銀行を追加</button>
          </div>
          
          <div v-if="store.data.banks.length === 0" class="empty-list">
            <p>銀行が登録されていません。まずはメインバンクを登録しましょう。</p>
          </div>
          <div v-else class="card-grid">
            <div v-for="bank in store.data.banks" :key="bank.id" class="bank-card glass-panel">
              <div class="bank-info">
                <h3>{{ bank.name }}</h3>
                <span v-if="bank.id === store.data.defaultBankId" class="badge">デフォルト</span>
              </div>
              <div class="bank-balance">
                <span class="label">最新の実績残高</span>
                <!-- TODO: 最も新しいActualLogを表示する -->
                <span class="value">¥{{ bank.actualLogs[bank.actualLogs.length - 1]?.amount.toLocaleString() || 0 }}</span>
              </div>
              <div class="bank-actions">
                <button class="glass-button">編集</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 収支管理タブ -->
        <div v-else-if="activeTab === 'events'" class="tab-pane" key="events">
          <div class="pane-header">
            <h2>主体と収支イベント</h2>
            <button class="glass-button primary">＋ 主体を追加</button>
          </div>

          <div v-if="store.data.entities.length === 0" class="empty-list">
            <p>主体が登録されていません。「家族全体」や「夫」「妻」などの主体を追加してください。</p>
          </div>
          <div v-else class="kanban-board">
            <!-- Entity 列 -->
            <div v-for="entity in store.data.entities" :key="entity.id" class="kanban-column glass-panel">
              <div class="column-header">
                <h3>{{ entity.name }}</h3>
                <button class="icon-btn">＋ カテゴリ</button>
              </div>
              
              <!-- Category ブロック -->
              <div v-for="category in entity.categories" :key="category.id" class="category-block">
                <div class="category-header">
                  <h4>{{ category.name }}</h4>
                  <button class="icon-btn sm" @click="showEventModal = true">＋</button>
                </div>
                
                <!-- Event カード -->
                <div class="event-cards">
                  <div v-for="event in category.events" :key="event.id" class="event-card">
                    <div class="event-main">
                      <span class="event-name">{{ event.name }}</span>
                      <span class="event-amount" :class="event.amount >= 0 ? 'positive' : 'negative'">
                        {{ event.amount >= 0 ? '+' : '' }}{{ event.amount.toLocaleString() }}
                      </span>
                    </div>
                    <div class="event-sub">
                      <!-- TODO: 頻度の文字起こし -->
                      <span class="event-rule">毎月</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--sp-4);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  color: var(--text-muted);
  margin-top: var(--sp-1);
}

.tabs {
  display: flex;
  padding: var(--sp-1);
  border-radius: var(--radius-lg);
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: var(--sp-2) var(--sp-6);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-6);
}

.empty-list {
  text-align: center;
  padding: var(--sp-8);
  color: var(--text-muted);
  background: rgba(0,0,0,0.2);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-color);
}

/* 銀行カード */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--sp-4);
}

.bank-card {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.bank-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bank-info h3 {
  font-size: 1.25rem;
}

.badge {
  background: var(--accent-gradient);
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.bank-balance {
  display: flex;
  flex-direction: column;
}

.bank-balance .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.bank-balance .value {
  font-size: 1.5rem;
  font-weight: 700;
}

.bank-actions {
  display: flex;
  justify-content: flex-end;
}

/* Kanban / Tree */
.kanban-board {
  display: flex;
  gap: var(--sp-4);
  overflow-x: auto;
  padding-bottom: var(--sp-4);
}

.kanban-column {
  flex: 0 0 350px;
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  background: rgba(30, 41, 59, 0.4);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border-color);
}

.category-block {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-header h4 {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.event-cards {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.event-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  cursor: pointer;
  transition: all var(--trans-fast);
}

.event-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.event-main {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.event-amount.positive { color: var(--success-color); }
.event-amount.negative { color: var(--danger-color); }

.event-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}
.icon-btn:hover {
  color: var(--text-primary);
}
</style>
