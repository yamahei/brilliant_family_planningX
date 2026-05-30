<script setup lang="ts">
import { ref } from 'vue';
import { useBfpStore } from '../store';
import EventModal from '../components/EventModal.vue';

const store = useBfpStore();
const showEventModal = ref(false);

const activeEntityId = ref<number | null>(null);
const activeCategoryId = ref<number | null>(null);
const activeEventId = ref<number | null>(null);

const openAddEventModal = (entityId: number, categoryId: number) => {
  activeEntityId.value = entityId;
  activeCategoryId.value = categoryId;
  activeEventId.value = null;
  showEventModal.value = true;
};

const openEditEventModal = (entityId: number, categoryId: number, eventId: number) => {
  activeEntityId.value = entityId;
  activeCategoryId.value = categoryId;
  activeEventId.value = eventId;
  showEventModal.value = true;
};

const deleteEvent = (entityId: number, categoryId: number, eventId: number) => {
  if (confirm('このイベントを削除しますか？')) {
    store.deleteEvent(entityId, categoryId, eventId);
  }
};

// Inline Input State
const addEntityMode = ref(false);
const newEntityName = ref('');

const addCategoryModeEntityId = ref<number | null>(null);
const newCategoryName = ref('');

const editEntityId = ref<number | null>(null);
const editCategoryInfo = ref<{eId: number, cId: number} | null>(null);
const editNameInput = ref('');

const submitAddEntity = () => {
  if (newEntityName.value.trim()) {
    store.addEntity(newEntityName.value.trim());
  }
  addEntityMode.value = false;
  newEntityName.value = '';
};

const submitAddCategory = (entityId: number) => {
  if (newCategoryName.value.trim()) {
    store.addCategory(entityId, newCategoryName.value.trim());
  }
  addCategoryModeEntityId.value = null;
  newCategoryName.value = '';
};

const submitEditEntity = (id: number) => {
  if (editNameInput.value.trim()) {
    store.updateEntity(id, editNameInput.value.trim());
  }
  editEntityId.value = null;
};

const submitEditCategory = (entityId: number, categoryId: number) => {
  if (editNameInput.value.trim()) {
    store.updateCategory(entityId, categoryId, editNameInput.value.trim());
  }
  editCategoryInfo.value = null;
};

const startEditEntity = (id: number, name: string) => {
  editEntityId.value = id;
  editNameInput.value = name;
};

const startEditCategory = (eId: number, cId: number, name: string) => {
  editCategoryInfo.value = { eId, cId };
  editNameInput.value = name;
};

const deleteEntity = (id: number) => {
  if (confirm('本当にこのメンバー（主体）を削除しますか？紐づく費目・イベントもすべて削除されます。')) {
    store.deleteEntity(id);
  }
};

const deleteCategory = (eId: number, cId: number) => {
  if (confirm('この費目を削除しますか？紐づくイベントもすべて削除されます。')) {
    store.deleteCategory(eId, cId);
  }
};

</script>

<template>
  <div class="settings-view">
    <header class="page-header">
      <div class="header-content">
        <h1>収支の管理</h1>
        <p class="subtitle">家族メンバーごとの費目とイベントを管理します</p>
      </div>
    </header>

    <main class="settings-content">
      <div class="pane-header">
        <h2>家族メンバーと収支イベント</h2>
        
        <div v-if="!addEntityMode">
          <button class="glass-button primary" @click="addEntityMode = true; newEntityName = ''">＋ メンバーを追加</button>
        </div>
        <div v-else class="inline-add">
          <input v-model="newEntityName" @keyup.enter="submitAddEntity" class="glass-input" placeholder="メンバー名を入力..." autoFocus />
          <button class="glass-button primary" @click="submitAddEntity">保存</button>
          <button class="glass-button" @click="addEntityMode = false">取消</button>
        </div>
      </div>

      <div v-if="store.data.entities.length === 0" class="empty-list">
        <p>メンバーが登録されていません。「夫」や「家族共有」などを追加してください。</p>
      </div>
      
      <div v-else class="kanban-board">
        <!-- Entity 列 -->
        <div v-for="entity in store.data.entities" :key="entity.id" class="kanban-column glass-panel">
          
          <div class="column-header">
            <div v-if="editEntityId === entity.id" class="inline-add w-full">
              <input v-model="editNameInput" @keyup.enter="submitEditEntity(entity.id)" class="glass-input sm w-full" autoFocus />
              <button class="icon-btn" @click="submitEditEntity(entity.id)">✅</button>
            </div>
            <h3 v-else @dblclick="startEditEntity(entity.id, entity.name)">{{ entity.name }}</h3>
            
            <div class="header-actions dropdown-wrapper">
              <button class="icon-btn" @click="addCategoryModeEntityId = entity.id; newCategoryName = ''">＋ 費目</button>
              <button class="icon-btn text-muted" @click="startEditEntity(entity.id, entity.name)" title="編集">✏️</button>
              <button class="icon-btn danger-text" @click="deleteEntity(entity.id)" title="削除">🗑️</button>
            </div>
          </div>
          
          <!-- Category Inline Add -->
          <div v-if="addCategoryModeEntityId === entity.id" class="inline-add mb-2">
            <input v-model="newCategoryName" @keyup.enter="submitAddCategory(entity.id)" class="glass-input sm" placeholder="費目名..." autoFocus />
            <button class="glass-button sm primary" @click="submitAddCategory(entity.id)">保存</button>
            <button class="glass-button sm" @click="addCategoryModeEntityId = null">取消</button>
          </div>

          <!-- Category ブロック -->
          <div v-for="category in entity.categories" :key="category.id" class="category-block">
            <div class="category-header">
              
              <div v-if="editCategoryInfo?.eId === entity.id && editCategoryInfo?.cId === category.id" class="inline-add w-full">
                <input v-model="editNameInput" @keyup.enter="submitEditCategory(entity.id, category.id)" class="glass-input sm" autoFocus />
                <button class="icon-btn" @click="submitEditCategory(entity.id, category.id)">✅</button>
              </div>
              <h4 v-else @dblclick="startEditCategory(entity.id, category.id, category.name)">{{ category.name }}</h4>

              <div class="category-actions">
                <button class="icon-btn sm text-muted" @click="startEditCategory(entity.id, category.id, category.name)">✏️</button>
                <button class="icon-btn sm danger-text" @click="deleteCategory(entity.id, category.id)">🗑️</button>
                <button class="icon-btn sm primary-text ml-2" @click="openAddEventModal(entity.id, category.id)">＋収支</button>
              </div>
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
                  <span class="event-rule">
                    {{ event.rules[0]?.type === 'SOMEMONTH' && event.rules[0]?.months.length === 12 ? '毎月' : 
                       event.rules[0]?.type === 'SOMEMONTHSTEPYEAR' ? event.rules[0]?.step + '年毎' : '特定月' }}
                  </span>
                  <div class="event-hover-actions">
                    <button class="icon-btn sm" @click="openEditEventModal(entity.id, category.id, event.id)">✏️</button>
                    <button class="icon-btn sm danger-text" @click="deleteEvent(entity.id, category.id, event.id)">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <EventModal 
      :show="showEventModal" 
      :entity-id="activeEntityId" 
      :category-id="activeCategoryId" 
      :edit-event-id="activeEventId"
      @close="showEventModal = false" 
    />
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
.column-header h3 {
  cursor: text;
  flex: 1;
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
  cursor: text;
  flex: 1;
}
.category-actions {
  display: flex;
  gap: 2px;
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
  position: relative;
  transition: all var(--trans-fast);
}

.event-card:hover {
  background: rgba(255, 255, 255, 0.1);
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
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.event-hover-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}
.event-card:hover .event-hover-actions {
  opacity: 1;
}

/* Utils */
.icon-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.icon-btn:hover {
  background: rgba(255,255,255,0.1);
}
.text-muted { color: var(--text-muted); }
.danger-text { color: var(--danger-color); }
.primary-text { color: #60a5fa; font-weight: bold; }

.inline-add {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
}
.w-full { width: 100%; }
.mb-2 { margin-bottom: var(--sp-2); }
</style>
