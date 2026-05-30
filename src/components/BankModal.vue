<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBfpStore } from '../store';

const props = defineProps<{ 
  show: boolean, 
  editBankId: number | null 
}>();
const emit = defineEmits(['close']);
const store = useBfpStore();

const name = ref('');
const initialBalance = ref(0);
const errorMessage = ref('');

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    if (props.editBankId) {
      const bank = store.data.banks.find(b => b.id === props.editBankId);
      if (bank) {
        name.value = bank.name;
        initialBalance.value = bank.actualLogs[bank.actualLogs.length - 1]?.amount || 0;
      }
    } else {
      name.value = '';
      initialBalance.value = 0;
    }
  }
});

const submit = () => {
  errorMessage.value = '';
  if (!name.value.trim()) {
    errorMessage.value = '銀行名を入力してください。';
    return;
  }
  
  if (props.editBankId) {
    store.updateBank(props.editBankId, name.value, initialBalance.value);
  } else {
    store.addBank(name.value, initialBalance.value);
  }
  close();
};

const close = () => {
  emit('close');
};
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="close">
    <div class="modal-content glass-panel">
      <h2>{{ editBankId ? '銀行の編集' : '新規銀行の追加' }}</h2>
      
      <div v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label>銀行名</label>
        <input v-model="name" type="text" class="glass-input" placeholder="例：〇〇銀行、メインバンク" />
      </div>
      
      <div class="form-group">
        <label>現在の実績残高 (円)</label>
        <p class="help-text">※シミュレーションの計算起点となるため、現在のリアルな残高を入力してください。</p>
        <input v-model.number="initialBalance" type="number" class="glass-input" />
      </div>
      
      <div class="modal-actions">
        <button class="glass-button" @click="close">キャンセル</button>
        <button class="glass-button primary" @click="submit">
          {{ editBankId ? '更新する' : '追加する' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-content {
  width: 400px;
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}
.form-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.help-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: var(--sp-1);
}
.error-msg {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: var(--sp-2);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-2);
  margin-top: var(--sp-4);
}
</style>
