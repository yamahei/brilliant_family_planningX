import { defineStore } from 'pinia';
import { BFPData, SimulationResult } from '../biz/types';
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
    hasData: (state) => state.banks.length > 0 || state.entities.length > 0,
    
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
      this.data = {
        entities: [{
          id: 1, sortOrder: 1, name: "家族A", memo: "", entityFrom: null, entityTo: null, categories: [{
            id: 1, sortOrder: 1, name: "収入", memo: "", events: [{
              id: 1, sortOrder: 1, name: "給料", memo: "", eventFrom: null, eventTo: null, amount: 300000, bankId: 1, rules: [
                { id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null }
              ]
            }]
          }]
        }],
        banks: [{
          id: 1, name: "メインバンク", memo: "", actualLogs: [{ id: 1, yearMonth: "2026-05", amount: 1000000 }]
        }],
        defaultBankId: 1
      };
      this.isLoaded = true;
    }
  }
});
