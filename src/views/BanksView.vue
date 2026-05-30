<script setup lang="ts">
import { ref } from 'vue';
import { useBfpStore } from '../store';
import BankModal from '../components/BankModal.vue';

const store = useBfpStore();
const showBankModal = ref(false);
const activeBankId = ref<number | null>(null);

const openAddModal = () => {
  activeBankId.value = null;
  showBankModal.value = true;
};

const openEditModal = (id: number) => {
  activeBankId.value = id;
  showBankModal.value = true;
};

const deleteBank = (id: number) => {
  if (confirm('本当にこの銀行を削除しますか？')) {
    try {
      store.deleteBank(id);
    } catch (e: any) {
      alert(e.message);
    }
  }
};
</script>

<template>
  <div class="settings-view">
    <header class="page-header">
      <div class="header-content">
        <h1>銀行の管理</h1>
        <p class="subtitle">家計の基盤となる銀行口座を管理します</p>
      </div>
    </header>

    <main class="settings-content">
      <div class="pane-header">
        <h2>登録されている銀行</h2>
        <button class="glass-button primary" @click="openAddModal">＋ 新規銀行を追加</button>
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
            <span class="value">¥{{ bank.actualLogs[bank.actualLogs.length - 1]?.amount.toLocaleString() || 0 }}</span>
          </div>
          <div class="bank-actions">
            <button class="glass-button sm" @click="openEditModal(bank.id)">編集</button>
            <button class="glass-button sm danger-btn" v-if="bank.id !== store.data.defaultBankId" @click="deleteBank(bank.id)">削除</button>
          </div>
        </div>
      </div>
    </main>

    <BankModal :show="showBankModal" :edit-bank-id="activeBankId" @close="showBankModal = false" />
  </div>
</template>

<style scoped>
.settings-view {
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
  gap: var(--sp-2);
}
</style>
