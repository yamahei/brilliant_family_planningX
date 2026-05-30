import { defineStore } from 'pinia';
import type { BFPData, SimulationResult } from '../biz/types';
import { Simulator } from '../biz/Simulator';

export const useBfpStore = defineStore('bfp', {
  state: () => ({
    // 初期状態は空（またはモックデータ）
    data: {
      entities: [],
      banks: [],
      defaultBankId: 99
    } as BFPData,
    isLoaded: false
  }),
  getters: {
    hasData: (state) => state.data.banks.length > 0 || state.data.entities.length > 0,
    
    // 現在から10年分のシミュレーションを返す
    currentSimulation: (state): SimulationResult | null => {
      if (!state.isLoaded) return null;
      const now = new Date();
      const fromStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const toStr = `${now.getFullYear() + 10}-12`;
      try {
        return Simulator.simulate(state.data, fromStr, toStr);
      } catch (e) {
        console.error("Simulation error", e);
        return null;
      }
    }
  },
  actions: {
    initData() {
      // TODO: IndexedDBからロード
      this.isLoaded = true;
    },
    // デバッグ用のダミーデータ注入
    injectDummyData() {
      const now = new Date();
      const year = now.getFullYear();
      
      this.data = {
        banks: [
          { id: 1, name: "メインバンク（給与振込）", memo: "", actualLogs: [{ id: 1, yearMonth: `${year}-01`, amount: 1500000 }] },
          { id: 2, name: "貯蓄用口座", memo: "", actualLogs: [{ id: 1, yearMonth: `${year}-01`, amount: 3000000 }] }
        ],
        defaultBankId: 1,
        entities: [
          {
            id: 1, sortOrder: 1, name: "収入", memo: "", entityFrom: null, entityTo: null, categories: [
              { id: 1, sortOrder: 1, name: "給与", memo: "", events: [
                { id: 1, sortOrder: 1, name: "夫 給与", memo: "", eventFrom: null, eventTo: null, amount: 350000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] },
                { id: 2, sortOrder: 2, name: "妻 給与", memo: "", eventFrom: null, eventTo: null, amount: 150000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] }
              ]},
              { id: 2, sortOrder: 2, name: "ボーナス", memo: "", events: [
                { id: 3, sortOrder: 1, name: "夫 ボーナス", memo: "", eventFrom: null, eventTo: null, amount: 600000, bankId: 2, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [6, 12], fromYM: null, toYM: null }] }
              ]}
            ]
          },
          {
            id: 2, sortOrder: 2, name: "家族（共有）", memo: "", entityFrom: null, entityTo: null, categories: [
              { id: 3, sortOrder: 1, name: "固定費", memo: "", events: [
                { id: 4, sortOrder: 1, name: "家賃", memo: "", eventFrom: null, eventTo: null, amount: -120000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] },
                { id: 5, sortOrder: 2, name: "水道光熱費", memo: "", eventFrom: null, eventTo: null, amount: -25000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] },
                { id: 6, sortOrder: 3, name: "通信費", memo: "", eventFrom: null, eventTo: null, amount: -15000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] }
              ]},
              { id: 4, sortOrder: 2, name: "変動費", memo: "", events: [
                { id: 7, sortOrder: 1, name: "食費・日用品", memo: "", eventFrom: null, eventTo: null, amount: -80000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] }
              ]},
              { id: 5, sortOrder: 3, name: "特別費", memo: "", events: [
                { id: 8, sortOrder: 1, name: "車検", memo: "", eventFrom: null, eventTo: null, amount: -120000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTHSTEPYEAR", not: false, months: [4], step: 2, fromYM: null, toYM: null }] },
                { id: 9, sortOrder: 2, name: "帰省・旅行", memo: "", eventFrom: null, eventTo: null, amount: -100000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [8, 12], fromYM: null, toYM: null }] }
              ]}
            ]
          },
          {
            id: 3, sortOrder: 3, name: "第一子", memo: "", entityFrom: null, entityTo: null, categories: [
              { id: 6, sortOrder: 1, name: "教育費", memo: "", events: [
                { id: 10, sortOrder: 1, name: "習い事", memo: "", eventFrom: null, eventTo: null, amount: -15000, bankId: 1, rules: [{ id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }] },
                { id: 11, sortOrder: 2, name: "高校入学金", memo: "", eventFrom: null, eventTo: null, amount: -300000, bankId: 2, rules: [{ id: 1, sortOrder: 1, type: "YEARMONTH", not: false, yearmonths: [{ year: year + 1, month: 4 }], fromYM: null, toYM: null }] },
                { id: 12, sortOrder: 3, name: "大学入学金・初年度", memo: "", eventFrom: null, eventTo: null, amount: -1500000, bankId: 2, rules: [{ id: 1, sortOrder: 1, type: "YEARMONTH", not: false, yearmonths: [{ year: year + 4, month: 4 }], fromYM: null, toYM: null }] }
              ]}
            ]
          }
        ]
      };
      this.isLoaded = true;
    },
    
    // 銀行の追加
    addBank(name: string, initialBalance: number) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const newId = this.data.banks.length > 0 ? Math.max(...this.data.banks.map(b => b.id)) + 1 : 1;
      this.data.banks.push({
        id: newId,
        name,
        memo: "",
        actualLogs: [{
          id: 1,
          yearMonth,
          amount: initialBalance
        }]
      });
      if (this.data.banks.length === 1) {
        this.data.defaultBankId = newId;
      }
    },

    updateBank(id: number, name: string, initialBalance: number) {
      const bank = this.data.banks.find(b => b.id === id);
      if (bank) {
        bank.name = name;
        if (bank.actualLogs.length > 0) {
          bank.actualLogs[bank.actualLogs.length - 1].amount = initialBalance;
        }
      }
    },

    deleteBank(id: number) {
      if (this.data.defaultBankId === id) {
        throw new Error("デフォルト銀行は削除できません。");
      }
      this.data.banks = this.data.banks.filter(b => b.id !== id);
    },

    // 主体の追加
    addEntity(name: string) {
      const newId = this.data.entities.length > 0 ? Math.max(...this.data.entities.map(e => e.id)) + 1 : 1;
      this.data.entities.push({
        id: newId,
        sortOrder: newId,
        name,
        memo: "",
        entityFrom: null,
        entityTo: null,
        categories: []
      });
    },

    updateEntity(id: number, name: string) {
      const entity = this.data.entities.find(e => e.id === id);
      if (entity) entity.name = name;
    },

    deleteEntity(id: number) {
      this.data.entities = this.data.entities.filter(e => e.id !== id);
    },

    // カテゴリの追加
    addCategory(entityId: number, name: string) {
      const entity = this.data.entities.find(e => e.id === entityId);
      if (!entity) return;
      const newId = entity.categories.length > 0 ? Math.max(...entity.categories.map(c => c.id)) + 1 : 1;
      entity.categories.push({
        id: newId,
        sortOrder: newId,
        name,
        memo: "",
        events: []
      });
    },

    updateCategory(entityId: number, categoryId: number, name: string) {
      const entity = this.data.entities.find(e => e.id === entityId);
      if (!entity) return;
      const category = entity.categories.find(c => c.id === categoryId);
      if (category) category.name = name;
    },

    deleteCategory(entityId: number, categoryId: number) {
      const entity = this.data.entities.find(e => e.id === entityId);
      if (entity) {
        entity.categories = entity.categories.filter(c => c.id !== categoryId);
      }
    },

    // イベントの追加
    addEvent(entityId: number, categoryId: number, event: Omit<BFPEvent, 'id' | 'sortOrder'>) {
      const entity = this.data.entities.find(e => e.id === entityId);
      if (!entity) return;
      const category = entity.categories.find(c => c.id === categoryId);
      if (!category) return;
      
      const newId = category.events.length > 0 ? Math.max(...category.events.map(ev => ev.id)) + 1 : 1;
      category.events.push({
        ...event,
        id: newId,
        sortOrder: newId
      } as BFPEvent);
    },

    updateEvent(entityId: number, categoryId: number, eventId: number, updatedEvent: Omit<BFPEvent, 'id' | 'sortOrder'>) {
      const entity = this.data.entities.find(e => e.id === entityId);
      if (!entity) return;
      const category = entity.categories.find(c => c.id === categoryId);
      if (!category) return;
      
      const index = category.events.findIndex(ev => ev.id === eventId);
      if (index !== -1) {
        category.events[index] = {
          ...updatedEvent,
          id: category.events[index].id,
          sortOrder: category.events[index].sortOrder
        } as BFPEvent;
      }
    },

    deleteEvent(entityId: number, categoryId: number, eventId: number) {
      const entity = this.data.entities.find(e => e.id === entityId);
      if (!entity) return;
      const category = entity.categories.find(c => c.id === categoryId);
      if (category) {
        category.events = category.events.filter(ev => ev.id !== eventId);
      }
    }
  }
});
