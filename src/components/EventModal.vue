<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBfpStore } from '../store';
import type { BFPRule, BFPEvent } from '../biz/types';

const props = defineProps<{ 
  show: boolean, 
  entityId: number | null, 
  categoryId: number | null,
  editEventId: number | null
}>();
const emit = defineEmits(['close']);
const store = useBfpStore();

const name = ref('');
const frequency = ref('monthly'); // 'monthly', 'yearly', 'stepyearly'
const frequencyMonth = ref(1); // 1-12
const frequencyStep = ref(2); // 2年おきなど
const bankId = ref<number | null>(null);
const amount = ref(0);
const errorMessage = ref('');

watch(() => props.show, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    
    if (props.editEventId && props.entityId && props.categoryId) {
      const entity = store.data.entities.find(e => e.id === props.entityId);
      const category = entity?.categories.find(c => c.id === props.categoryId);
      const event = category?.events.find(ev => ev.id === props.editEventId);
      
      if (event) {
        name.value = event.name;
        amount.value = event.amount;
        bankId.value = event.bankId;
        
        const rule = event.rules[0];
        if (rule) {
          if (rule.type === 'SOMEMONTH' && rule.months.length === 12) {
            frequency.value = 'monthly';
          } else if (rule.type === 'YEARMONTH' || (rule.type === 'SOMEMONTH' && rule.months.length === 1)) {
            frequency.value = 'yearly';
            frequencyMonth.value = rule.type === 'YEARMONTH' ? rule.yearmonths![0].month : rule.months[0];
          } else if (rule.type === 'SOMEMONTHSTEPYEAR') {
            frequency.value = 'stepyearly';
            frequencyMonth.value = rule.months[0];
            frequencyStep.value = rule.step || 2;
          } else {
            frequency.value = 'monthly';
          }
        }
      }
    } else {
      name.value = '';
      amount.value = 0;
      bankId.value = null;
      frequency.value = 'monthly';
      frequencyMonth.value = 4;
      frequencyStep.value = 2;
    }
  }
});

const submit = () => {
  errorMessage.value = '';
  if (!name.value.trim()) {
    errorMessage.value = '名前を入力してください。';
    return;
  }
  if (amount.value === 0) {
    errorMessage.value = '金額は0円以外を指定してください。支出の場合はマイナスを入力します。';
    return;
  }
  if (!props.entityId || !props.categoryId) return;
  
  // 頻度からRuleを生成する隠蔽ロジック
  const rules: BFPRule[] = [];
  if (frequency.value === 'monthly') {
    rules.push({
      id: 1, sortOrder: 1, type: "SOMEMONTH", not: false,
      months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null
    });
  } else if (frequency.value === 'yearly') {
    rules.push({
      id: 1, sortOrder: 1, type: "SOMEMONTH", not: false,
      months: [frequencyMonth.value as any], fromYM: null, toYM: null
    });
  } else if (frequency.value === 'stepyearly') {
    rules.push({
      id: 1, sortOrder: 1, type: "SOMEMONTHSTEPYEAR", not: false,
      months: [frequencyMonth.value as any], step: frequencyStep.value, fromYM: null, toYM: null
    });
  }

  const eventData: Omit<BFPEvent, 'id' | 'sortOrder'> = {
    name: name.value,
    memo: '',
    eventFrom: null,
    eventTo: null,
    amount: amount.value,
    bankId: bankId.value,
    rules
  };

  if (props.editEventId) {
    store.updateEvent(props.entityId, props.categoryId, props.editEventId, eventData);
  } else {
    store.addEvent(props.entityId, props.categoryId, eventData);
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
      <h2>{{ editEventId ? '収支イベントの編集' : '収支イベントの追加' }}</h2>
      
      <div v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label>名前</label>
        <input v-model="name" type="text" class="glass-input" placeholder="例：給料、家賃、車検" />
      </div>
      
      <div class="form-group">
        <label>頻度 (ルールの自動生成)</label>
        <select v-model="frequency" class="glass-input">
          <option value="monthly">毎月</option>
          <option value="yearly">毎年 (特定月)</option>
          <option value="stepyearly">数年ごと (車検など)</option>
        </select>
      </div>

      <div v-if="frequency === 'yearly' || frequency === 'stepyearly'" class="form-group row">
        <label>発生月:</label>
        <select v-model="frequencyMonth" class="glass-input inline">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
        </select>
      </div>

      <div v-if="frequency === 'stepyearly'" class="form-group row">
        <label>周期:</label>
        <select v-model="frequencyStep" class="glass-input inline">
          <option value="2">2年ごと</option>
          <option value="3">3年ごと</option>
          <option value="4">4年ごと</option>
          <option value="5">5年ごと</option>
        </select>
      </div>

      <div class="form-group">
        <label>対象の銀行</label>
        <select v-model="bankId" class="glass-input">
          <option :value="null">デフォルト銀行 (自動)</option>
          <option v-for="bank in store.data.banks" :key="bank.id" :value="bank.id">
            {{ bank.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>金額 (支出は必ずマイナスで入力)</label>
        <input v-model.number="amount" type="number" class="glass-input" placeholder="例：-100000" />
      </div>

      <div class="modal-actions">
        <button class="glass-button" @click="close">キャンセル</button>
        <button class="glass-button primary" @click="submit">
          {{ editEventId ? '更新する' : '追加する' }}
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
.form-group.row {
  flex-direction: row;
  align-items: center;
  gap: var(--sp-3);
  padding-left: var(--sp-2);
}
.form-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.inline {
  width: auto;
  min-width: 100px;
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
