import type { BFPType_YearMonth } from "../core/rule/types";
import { RuleYearMonths } from "../core/rule/RuleYearMonths";
import { RuleSomeMonths } from "../core/rule/RuleSomeMonths";
import { RuleSomeMonthStepYear } from "../core/rule/RuleSomeMonthStepYear";
import type { BFPData, BFPEvent, BFPEntity, SimulationResult, EventLog, BankBalanceLog, BFPRule, BFPBank, BFPActualLog } from "./types";

export class Simulator {
    
    // YYYY-MM形式から YearMonth型へ変換
    public static parseYM(ymStr: string): BFPType_YearMonth {
        const [y, m] = ymStr.split("-");
        return {
            year: parseInt(y, 10),
            month: parseInt(m, 10) as BFPType_YearMonth["month"],
        };
    }

    // YearMonth型から YYYY-MM形式へ変換
    public static formatYM(ym: BFPType_YearMonth): string {
        return `${ym.year}-${String(ym.month).padStart(2, '0')}`;
    }

    // 指定期間のYYYY-MMリストを生成
    public static generatePeriod(fromStr: string, toStr: string): string[] {
        const fromYM = this.parseYM(fromStr);
        const toYM = this.parseYM(toStr);
        const fromDate = new Date(fromYM.year, fromYM.month - 1, 1);
        const toDate = new Date(toYM.year, toYM.month - 1, 1);
        
        if (fromDate > toDate) throw new Error("from is later than to");

        const result: string[] = [];
        const current = new Date(fromDate);
        while (current <= toDate) {
            result.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
            current.setMonth(current.getMonth() + 1);
        }
        return result;
    }

    // Ruleを評価する
    private static evaluateRule(ruleDef: BFPRule, targetYM: BFPType_YearMonth): boolean {
        let ruleInstance;
        switch(ruleDef.type) {
            case "YEARMONTH":
                ruleInstance = new RuleYearMonths(ruleDef);
                break;
            case "SOMEMONTH":
                ruleInstance = new RuleSomeMonths(ruleDef);
                break;
            case "SOMEMONTHSTEPYEAR":
                ruleInstance = new RuleSomeMonthStepYear(ruleDef);
                break;
            default:
                throw new Error("Unknown rule type");
        }
        return ruleInstance.evaluate(targetYM);
    }

    // Eventが指定年月に発生するか判定する
    public static evaluateEvent(entity: BFPEntity, event: BFPEvent, ymStr: string): boolean {
        const targetYM = this.parseYM(ymStr);
        const targetDate = new Date(targetYM.year, targetYM.month - 1, 1);

        // 1. Entity期間の判定
        if (entity.entityFrom) {
            const eFrom = this.parseYM(entity.entityFrom);
            if (targetDate < new Date(eFrom.year, eFrom.month - 1, 1)) return false;
        }
        if (entity.entityTo) {
            const eTo = this.parseYM(entity.entityTo);
            if (targetDate > new Date(eTo.year, eTo.month - 1, 1)) return false;
        }

        // 2. Event期間の判定
        if (event.eventFrom) {
            const eFrom = this.parseYM(event.eventFrom);
            if (targetDate < new Date(eFrom.year, eFrom.month - 1, 1)) return false;
        }
        if (event.eventTo) {
            const eTo = this.parseYM(event.eventTo);
            if (targetDate > new Date(eTo.year, eTo.month - 1, 1)) return false;
        }

        // 3. ルールのAND評価
        if (!event.rules || event.rules.length === 0) {
            return false; // ルールがなければ発生しない
        }

        for (const rule of event.rules) {
            const isMatch = this.evaluateRule(rule, targetYM);
            if (!isMatch) {
                return false; // AND条件なので1つでもfalseなら即座にfalse
            }
        }

        return true;
    }

    // メインシミュレーション
    public static simulate(data: BFPData, fromStr: string, toStr: string): SimulationResult {
        const period = this.generatePeriod(fromStr, toStr);
        const eventLogs: EventLog[] = [];
        const bankBalanceLogs: BankBalanceLog[] = [];

        // --- 初期設定 ---
        // 各銀行の残高計算用ステート
        // bankId -> { currentBalance, oldestLogYM }
        const bankStates = new Map<number, { balance: number, oldestLogDate: Date | null }>();
        const validBankIds = new Set(data.banks.map(b => b.id));

        for (const bank of data.banks) {
            let oldestDate: Date | null = null;
            let initialBalance = 0;
            
            // 最古のActualLogを探す
            if (bank.actualLogs && bank.actualLogs.length > 0) {
                // actualLogsを日付順にソート（昇順）
                const sortedLogs = [...bank.actualLogs].sort((a, b) => {
                    const ad = this.parseYM(a.yearMonth);
                    const bd = this.parseYM(b.yearMonth);
                    return new Date(ad.year, ad.month - 1, 1).getTime() - new Date(bd.year, bd.month - 1, 1).getTime();
                });
                
                const oldestLog = sortedLogs[0];
                const oldestYM = this.parseYM(oldestLog.yearMonth);
                oldestDate = new Date(oldestYM.year, oldestYM.month - 1, 1);
                
                // 今回はシンプルに、開始時点の残高をゼロとし、計算の過程でActualLogがあれば上書きする方式にする
                // ※ 最古より前はnullとなる
            }

            bankStates.set(bank.id, { balance: 0, oldestLogDate: oldestDate });
        }
        // デフォルト銀行が存在しない場合も考慮（念のためマップにエントリを作るが、oldestLogDateはnullとする。要件次第）
        if (!bankStates.has(data.defaultBankId)) {
            bankStates.set(data.defaultBankId, { balance: 0, oldestLogDate: null });
        }

        // --- シミュレーションループ ---
        for (const ymStr of period) {
            const targetYM = this.parseYM(ymStr);
            const targetDate = new Date(targetYM.year, targetYM.month - 1, 1);

            // 1. 当月の ActualLog で残高を上書き（リセット）
            for (const bank of data.banks) {
                const actualLog = bank.actualLogs?.find(l => l.yearMonth === ymStr);
                if (actualLog) {
                    const state = bankStates.get(bank.id)!;
                    state.balance = actualLog.amount; // 実績で上書き
                }
            }

            // 2. 当月のイベントを収集
            const currentMonthBankAmounts = new Map<number, number>(); // bankId -> 当月増減額

            for (const entity of data.entities) {
                for (const category of entity.categories) {
                    for (const event of category.events) {
                        if (this.evaluateEvent(entity, event, ymStr)) {
                            // イベント発生
                            // フォールバック処理：指定銀行がない、または存在しない場合はデフォルト銀行へ
                            let appliedBankId = event.bankId;
                            if (appliedBankId === null || !validBankIds.has(appliedBankId)) {
                                appliedBankId = data.defaultBankId;
                            }

                            eventLogs.push({
                                yearmonth: ymStr,
                                entityId: entity.id,
                                categoryId: category.id,
                                eventId: event.id,
                                amount: event.amount,
                                bankId: appliedBankId
                            });

                            // 当月の増減額を計算
                            const currentBankAmount = currentMonthBankAmounts.get(appliedBankId) || 0;
                            currentMonthBankAmounts.set(appliedBankId, currentBankAmount + event.amount);
                        }
                    }
                }
            }

            // 3. 銀行ごとの残高計算と記録
            for (const [bankId, state] of bankStates.entries()) {
                const monthlyAmount = currentMonthBankAmounts.get(bankId) || 0;
                
                // ActualLogがある月はステップ1ですでに上書き済み。
                // その月のイベント増減をそれに加算するかどうかだが、
                // 仕様「入力された残高は『月末残高』として扱う」
                // 「入力された月から未来に向かって収支を累積する」
                // ということは、ActualLogがある月は、ActualLogが最終的なその月末の残高となる。
                // ただし、この月のイベントも反映するべきか？
                // ActualLogは「月末残高」なら、その月のイベント反映後の値なので、イベントを加算してはいけない。
                
                const hasActualLogThisMonth = data.banks.find(b => b.id === bankId)?.actualLogs?.some(l => l.yearMonth === ymStr);
                
                if (!hasActualLogThisMonth) {
                    state.balance += monthlyAmount;
                }

                // 最古ActualLogより前の場合は残高null
                let finalBalance: number | null = state.balance;
                if (state.oldestLogDate !== null && targetDate < state.oldestLogDate) {
                    finalBalance = null;
                } else if (state.oldestLogDate === null) {
                    // ActualLogが1件もない場合はどうするか？
                    // 仕様「銀行を新規登録したタイミングで実残高の入力を必須にする必要」があるので、通常はここに来ない。
                    // 万が一来たらnullとするか、0から累積するかだが、要件通り「最古より前は集計不可」としてnullを返す。
                    finalBalance = null;
                }

                bankBalanceLogs.push({
                    yearmonth: ymStr,
                    bankId: bankId,
                    monthlyAmount: monthlyAmount,
                    balance: finalBalance
                });
            }
        }

        return {
            eventLogs,
            bankBalanceLogs
        };
    }
}
