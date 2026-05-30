import { describe, test, expect } from "@jest/globals";
import { Simulator } from "./Simulator";
import { BFPData, BFPEntity, BFPEvent, BFPRule, BFPBank, BFPActualLog } from "./types";
import { BFPType_RuleNameYM } from "../core/rule/types";

// Helper to create basic mock data
const createMockRule = (id: number, not: boolean, year: number, month: number): BFPRule => ({
    id, sortOrder: 1, type: "YEARMONTH", not,
    yearmonths: [{ year, month }],
    fromYM: null, toYM: null
});

describe("Simulator", () => {
    
    describe("1. 複数ルールの組み合わせ（AND条件）", () => {
        // パターン検証用のヘルパー
        const testCombinations = (ruleANot: boolean, ruleBNot: boolean, expectMatchIfBothTrue: boolean, expectMatchIfAFalse: boolean) => {
            const ruleA = createMockRule(1, ruleANot, 2026, 5); // 2026-05を対象とするルール
            const ruleB = createMockRule(2, ruleBNot, 2026, 5); // 同じく2026-05を対象とするルール

            const event: BFPEvent = {
                id: 1, sortOrder: 1, name: "Event", memo: "",
                eventFrom: null, eventTo: null, amount: 1000, bankId: null,
                rules: [ruleA, ruleB]
            };
            const entity: BFPEntity = {
                id: 1, sortOrder: 1, name: "Entity", memo: "",
                entityFrom: null, entityTo: null, categories: [{
                    id: 1, sortOrder: 1, name: "Cat", memo: "", events: [event]
                }]
            };

            // RuleA=True, RuleB=True となる 2026-05
            expect(Simulator.evaluateEvent(entity, event, "2026-05")).toBe(expectMatchIfBothTrue);
            // RuleA=False, RuleB=False となる 2026-06
            expect(Simulator.evaluateEvent(entity, event, "2026-06")).toBe(expectMatchIfAFalse);
        };

        // QAドキュメントに沿って主要なパターンを検証
        test("両方Notなし（P1-4）", () => {
            // 2026-05: T && T = True (P1), 2026-06: F && F = False (P4)
            testCombinations(false, false, true, false);
        });
        test("AのみNotあり（P5-8）", () => {
            // 2026-05: !T && T = False (P5), 2026-06: !F && F = False (P8)
            testCombinations(true, false, false, false);
        });
        test("BのみNotあり（P9-12）", () => {
            // 2026-05: T && !T = False (P9), 2026-06: F && !F = False (P12)
            testCombinations(false, true, false, false);
        });
        test("両方Notあり（P13-16）", () => {
            // 2026-05: !T && !T = False (P13), 2026-06: !F && !F = True (P16)
            testCombinations(true, true, false, true);
        });
    });

    describe("2. 有効期間（FromTo）の重なり判定", () => {
        const createOverlapData = (entityFrom: string|null, entityTo: string|null, eventFrom: string|null, eventTo: string|null): BFPData => {
            const rule = createMockRule(1, false, 2026, 5); // 常に合致するようにするため、今回はこのルールをベースにするが、
            // 全期間でイベントが発火するかどうかを見たいので、SOME_MONTHSで全月合致するルールを使う
            const ruleAll: BFPRule = {
                id: 1, sortOrder: 1, type: "SOMEMONTH", not: false,
                months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null
            };

            const event: BFPEvent = {
                id: 101, sortOrder: 1, name: "Ev", memo: "",
                eventFrom, eventTo, amount: 1000, bankId: 1, rules: [ruleAll]
            };
            const entity: BFPEntity = {
                id: 11, sortOrder: 1, name: "En", memo: "",
                entityFrom, entityTo, categories: [{
                    id: 1, sortOrder: 1, name: "Cat", memo: "", events: [event]
                }]
            };
            return {
                entities: [entity],
                banks: [{ id: 1, name: "B", memo: "", actualLogs: [{ id: 1, yearMonth: "2025-01", amount: 0 }] }],
                defaultBankId: 1
            };
        };

        const getTriggeredMonths = (data: BFPData): string[] => {
            const res = Simulator.simulate(data, "2026-01", "2026-12");
            return res.eventLogs.map(e => e.yearmonth);
        };

        test("P1: Entity期間とEvent期間が完全に同一", () => {
            const data = createOverlapData("2026-03", "2026-05", "2026-03", "2026-05");
            expect(getTriggeredMonths(data)).toEqual(["2026-03", "2026-04", "2026-05"]);
        });
        test("P2: Entity期間の中にEvent期間が完全に含まれる", () => {
            const data = createOverlapData("2026-01", "2026-12", "2026-03", "2026-05");
            expect(getTriggeredMonths(data)).toEqual(["2026-03", "2026-04", "2026-05"]);
        });
        test("P3: Event期間の中にEntity期間が完全に含まれる", () => {
            const data = createOverlapData("2026-03", "2026-05", "2026-01", "2026-12");
            expect(getTriggeredMonths(data)).toEqual(["2026-03", "2026-04", "2026-05"]);
        });
        test("P4: Entityの終了より前に、Eventが開始して重なる", () => {
            const data = createOverlapData("2026-01", "2026-04", "2026-03", "2026-06");
            expect(getTriggeredMonths(data)).toEqual(["2026-03", "2026-04"]);
        });
        test("P5: Eventの終了より前に、Entityが開始して重なる", () => {
            const data = createOverlapData("2026-03", "2026-06", "2026-01", "2026-04");
            expect(getTriggeredMonths(data)).toEqual(["2026-03", "2026-04"]);
        });
        test("P6: Entity期間の終了後にEvent期間が開始する", () => {
            const data = createOverlapData("2026-01", "2026-03", "2026-05", "2026-07");
            expect(getTriggeredMonths(data)).toEqual([]);
        });
        test("P7: Event期間の終了後にEntity期間が開始する", () => {
            const data = createOverlapData("2026-05", "2026-07", "2026-01", "2026-03");
            expect(getTriggeredMonths(data)).toEqual([]);
        });
        test("FromToが片方のみ指定されている場合（境界値）", () => {
            const data = createOverlapData("2026-05", null, null, "2026-06"); // 2026-05 〜 2026-06のみ重なる
            expect(getTriggeredMonths(data)).toEqual(["2026-05", "2026-06"]);
        });
    });

    describe("3. 銀行別の残高計算（シミュレーション）", () => {
        const createBankTestData = (): BFPData => {
            const ruleAll: BFPRule = {
                id: 1, sortOrder: 1, type: "SOMEMONTH", not: false,
                months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null
            };
            return {
                entities: [{
                    id: 11, sortOrder: 1, name: "En", memo: "", entityFrom: null, entityTo: null, categories: [{
                        id: 1, sortOrder: 1, name: "Cat", memo: "", events: [
                            // 毎月1000円、BankId=1
                            { id: 101, sortOrder: 1, name: "Ev1", memo: "", eventFrom: null, eventTo: null, amount: 1000, bankId: 1, rules: [ruleAll] },
                            // 毎月-500円、BankId=2
                            { id: 102, sortOrder: 2, name: "Ev2", memo: "", eventFrom: null, eventTo: null, amount: -500, bankId: 2, rules: [ruleAll] },
                            // 毎月3000円、BankId=null (DefaultBank=99へ)
                            { id: 103, sortOrder: 3, name: "Ev3", memo: "", eventFrom: null, eventTo: null, amount: 3000, bankId: null, rules: [ruleAll] },
                            // 毎月2000円、BankId=999 (削除済み銀行 -> DefaultBank=99へ)
                            { id: 104, sortOrder: 4, name: "Ev4", memo: "", eventFrom: null, eventTo: null, amount: 2000, bankId: 999, rules: [ruleAll] },
                        ]
                    }]
                }],
                banks: [
                    { id: 1, name: "Bank1", memo: "", actualLogs: [{ id: 1, yearMonth: "2026-03", amount: 10000 }] },
                    { id: 2, name: "Bank2", memo: "", actualLogs: [{ id: 2, yearMonth: "2026-02", amount: 5000 }, { id: 3, yearMonth: "2026-04", amount: 3000 }] }, // 2026-04に実残高あり（上書き）
                    { id: 99, name: "DefaultBank", memo: "", actualLogs: [{ id: 4, yearMonth: "2026-01", amount: 0 }] }
                ],
                defaultBankId: 99
            };
        };

        test("シミュレーションのエッジケース検証", () => {
            const data = createBankTestData();
            const res = Simulator.simulate(data, "2026-01", "2026-05");

            // EventLogが正しい銀行にマッピングされているか
            // Ev3 (null) と Ev4 (999) は 99 にマッピングされているはず
            const firstMonthEvents = res.eventLogs.filter(e => e.yearmonth === "2026-01");
            expect(firstMonthEvents.find(e => e.eventId === 101)?.bankId).toBe(1);
            expect(firstMonthEvents.find(e => e.eventId === 102)?.bankId).toBe(2);
            expect(firstMonthEvents.find(e => e.eventId === 103)?.bankId).toBe(99);
            expect(firstMonthEvents.find(e => e.eventId === 104)?.bankId).toBe(99);

            // Bank1の検証（最古ActualLog=2026-03）
            const b1 = res.bankBalanceLogs.filter(b => b.bankId === 1);
            expect(b1.find(b => b.yearmonth === "2026-01")?.balance).toBe(null); // 最古より前
            expect(b1.find(b => b.yearmonth === "2026-02")?.balance).toBe(null); // 最古より前
            expect(b1.find(b => b.yearmonth === "2026-03")?.balance).toBe(10000); // ActualLogの値（イベント1000円は上書きされて加味されない）
            expect(b1.find(b => b.yearmonth === "2026-04")?.balance).toBe(11000); // 10000 + 1000
            expect(b1.find(b => b.yearmonth === "2026-05")?.balance).toBe(12000); // 11000 + 1000

            // Bank2の検証（最古ActualLog=2026-02、2026-04にもActualLogあり）
            const b2 = res.bankBalanceLogs.filter(b => b.bankId === 2);
            expect(b2.find(b => b.yearmonth === "2026-01")?.balance).toBe(null); // 最古より前
            expect(b2.find(b => b.yearmonth === "2026-02")?.balance).toBe(5000); // 2026-02のActualLog値（マイナス残高許容など）
            expect(b2.find(b => b.yearmonth === "2026-03")?.balance).toBe(4500); // 5000 - 500
            expect(b2.find(b => b.yearmonth === "2026-04")?.balance).toBe(3000); // 2026-04のActualLog値で上書きされる！(4500 - 500 = 4000にはならない)
            expect(b2.find(b => b.yearmonth === "2026-05")?.balance).toBe(2500); // 3000 - 500

            // DefaultBank(99)の検証（最古ActualLog=2026-01）
            // Ev3(3000) + Ev4(2000) = 毎月5000増える
            const b99 = res.bankBalanceLogs.filter(b => b.bankId === 99);
            expect(b99.find(b => b.yearmonth === "2026-01")?.balance).toBe(0); // 2026-01のActualLog値(0)で上書き
            expect(b99.find(b => b.yearmonth === "2026-02")?.balance).toBe(5000);
            expect(b99.find(b => b.yearmonth === "2026-03")?.balance).toBe(10000);
        });

        test("マイナス残高の許容検証", () => {
            const data: BFPData = {
                entities: [{
                    id: 1, sortOrder: 1, name: "En", memo: "", entityFrom: null, entityTo: null, categories: [{
                        id: 1, sortOrder: 1, name: "Cat", memo: "", events: [{
                            id: 1, sortOrder: 1, name: "Ev", memo: "", eventFrom: null, eventTo: null, amount: -5000, bankId: 1, rules: [{
                                id: 1, sortOrder: 1, type: "SOMEMONTH", not: false, months: [1,2,3,4,5,6,7,8,9,10,11,12], fromYM: null, toYM: null
                            }]
                        }]
                    }]
                }],
                banks: [{ id: 1, name: "Bank1", memo: "", actualLogs: [{ id: 1, yearMonth: "2026-01", amount: 2000 }] }],
                defaultBankId: 1
            };
            const res = Simulator.simulate(data, "2026-01", "2026-03");
            const b = res.bankBalanceLogs.filter(b => b.bankId === 1);
            expect(b.find(x => x.yearmonth === "2026-01")?.balance).toBe(2000); // ActualLog
            expect(b.find(x => x.yearmonth === "2026-02")?.balance).toBe(-3000); // 2000 - 5000
            expect(b.find(x => x.yearmonth === "2026-03")?.balance).toBe(-8000); // -3000 - 5000 (マイナス計算の継続)
        });
    });
});
