import type { BFPRuleArg_Any } from "../core/rule/types";

export type BFPActualLog = {
  id: number;
  yearMonth: string; // "YYYY-MM"
  amount: number;
};

export type BFPBank = {
  id: number;
  name: string;
  memo: string;
  actualLogs: BFPActualLog[];
};

export type BFPRule = BFPRuleArg_Any & {
  id: number;
  sortOrder: number;
};

export type BFPEvent = {
  id: number;
  sortOrder: number;
  name: string;
  memo: string;
  eventFrom: string | null; // "YYYY-MM"
  eventTo: string | null;   // "YYYY-MM"
  amount: number;
  bankId: number | null;
  rules: BFPRule[];
};

export type BFPCategory = {
  id: number;
  sortOrder: number;
  name: string;
  memo: string;
  events: BFPEvent[];
};

export type BFPEntity = {
  id: number;
  sortOrder: number;
  name: string;
  memo: string;
  entityFrom: string | null; // "YYYY-MM"
  entityTo: string | null;   // "YYYY-MM"
  categories: BFPCategory[];
};

export type BFPData = {
  entities: BFPEntity[];
  banks: BFPBank[];
  defaultBankId: number;
};

export type EventLog = {
  yearmonth: string;      // "YYYY-MM"
  entityId: number;
  categoryId: number;
  eventId: number;
  amount: number;
  bankId: number | null;  // DefaultBankIdにフォールバックされた後の最終適用銀行ID
};

export type BankBalanceLog = {
  yearmonth: string;      // "YYYY-MM"
  bankId: number;
  monthlyAmount: number;  // 当月のイベント増減額の合計
  balance: number | null; // 最古ActualLog以降に累積された残高（最古より前はnull）
};

export type SimulationResult = {
  eventLogs: EventLog[];
  bankBalanceLogs: BankBalanceLog[];
};
