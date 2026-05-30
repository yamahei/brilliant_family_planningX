import { describe, test, expect } from "@jest/globals";
import * as types from "./types";
import { RuleSomeMonthStepYear } from "./RuleSomeMonthStepYear";

const getInstance = (
    { fromYM, toYM, not, step, months }:{
        fromYM?:types.BFPType_YearMonth,
        toYM?:types.BFPType_YearMonth,
        not?:types.BFPType_Not,
        step?:types.BFPType_Step,
        months?:types.BFPType_Month[]
    }):RuleSomeMonthStepYear => {
    return new RuleSomeMonthStepYear({
        type: "SOMEMONTHSTEPYEAR",
        fromYM: fromYM || { year: 2022, month: 12 },
        toYM: toYM  || { year: 2026, month: 4 },
        not: not || false,
        step: step ?? 2,
        months: months || [2, 3, 4, 8, 9, 10]
    });
}

describe("RuleSomeMonthStepYear", () => {
    // パラメータ観点
    test("引数チェック:fromYM > toYMはエラー", () => {
        expect(() => {
            getInstance({
                fromYM: { year: 2424, month: 2 },
                toYM: { year: 2024, month: 1 }
            });
        }).toThrow(/earlier/);
    });

    test("引数チェック:stepが数字でないとエラー(NaN)", () => {
        expect(() => {
            getInstance({ step: NaN });
        }).toThrow(/integer/);
    });

    test("引数チェック:stepが整数でないとエラー", () => {
        expect(() => {
            getInstance({ step: 3.14 });
        }).toThrow(/integer/);
    });

    test("引数チェック:stepが正の整数でないとエラー(0)", () => {
        expect(() => {
            getInstance({ step: 0 });
        }).toThrow(/positive/);
    });

    test("引数チェック:stepが正の整数でないとエラー(-1)", () => {
        expect(() => {
            getInstance({ step: -1 });
        }).toThrow(/positive/);
    });

    test("引数チェック:months要素が0件はエラー", () => {
        expect(() => {
            getInstance({ months: [] });
        }).toThrow(/least/);
    });

    test("引数チェック:months要素数が12超えはエラー", () => {
        expect(() => {
            getInstance({
                //12が2つ（要素の重複はエラーではない）
                months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12] as any
            });
        }).toThrow(/most/);
    });

    // 評価観点：普通の評価
    test("bulkEvaluate:普通の評価", () => {
        const instance = getInstance({});
        const evaluates = instance.bulkEvaluate({ year: 2022, month: 1 }, { year: 2026, month: 9 });

        expect(evaluates[0].result).toEqual(false);//2022/01, 範囲外, step:0, 対象外月
        expect(evaluates[1].result).toEqual(false);//2022/02, 範囲外, step:0, 対象月
        expect(evaluates[11].result).toEqual(false);//2022/12, 範囲内, step:0, 対象外月
        expect(evaluates[12].result).toEqual(false);//2023/01, 範囲内, step:1, 対象外月
        expect(evaluates[13].result).toEqual(false);//2023/02, 範囲内, step:1, 対象月
        expect(evaluates[24].result).toEqual(false);//2024/01, 範囲内, step:2, 対象外月
        expect(evaluates[25].result).toEqual(true);//2024/02, 範囲内, step:2, 対象月
        expect(evaluates[26].result).toEqual(true);//2024/03, 範囲内, step:2, 対象月
        expect(evaluates[28].result).toEqual(false);//2024/05, 範囲内, step:2, 対象外月
        expect(evaluates[31].result).toEqual(true);//2024/08, 範囲内, step:2, 対象月
        expect(evaluates[36].result).toEqual(false);//2025/01, 範囲内, step:3, 対象外月
        expect(evaluates[37].result).toEqual(false);//2025/02, 範囲内, step:3, 対象月
        expect(evaluates[48].result).toEqual(false);//2026/01, 範囲内, step:4, 対象外月
        expect(evaluates[49].result).toEqual(true);//2026/02, 範囲内, step:4, 対象月
        expect(evaluates[51].result).toEqual(true);//2026/04, 範囲内, step:4, 対象月
        expect(evaluates[52].result).toEqual(false);//2026/05, 範囲外, step:4, 対象外月
        expect(evaluates[55].result).toEqual(false);//2026/08, 範囲外, step:4, 対象月
    });

    test("bulkEvaluate:notで結果を反転する", () => {
        const instance = getInstance({ not: true });
        const evaluates = instance.bulkEvaluate({ year: 2022, month: 1 }, { year: 2026, month: 9 });

        // 期間外はNotに関わらず常にFalse
        expect(evaluates[0].result).toEqual(false);//2022/01, 範囲外, step:0, 対象外月
        expect(evaluates[1].result).toEqual(false);//2022/02, 範囲外, step:0, 対象月
        
        // 期間内は反転
        expect(evaluates[11].result).toEqual(true);//2022/12, 範囲内, step:0, 対象外月
        expect(evaluates[12].result).toEqual(true);//2023/01, 範囲内, step:1, 対象外月
        expect(evaluates[13].result).toEqual(true);//2023/02, 範囲内, step:1, 対象月
        expect(evaluates[24].result).toEqual(true);//2024/01, 範囲内, step:2, 対象外月
        expect(evaluates[25].result).toEqual(false);//2024/02, 範囲内, step:2, 対象月
        expect(evaluates[26].result).toEqual(false);//2024/03, 範囲内, step:2, 対象月
        expect(evaluates[28].result).toEqual(true);//2024/05, 範囲内, step:2, 対象外月
        expect(evaluates[31].result).toEqual(false);//2024/08, 範囲内, step:2, 対象月
        expect(evaluates[36].result).toEqual(true);//2025/01, 範囲内, step:3, 対象外月
        expect(evaluates[37].result).toEqual(true);//2025/02, 範囲内, step:3, 対象月
        expect(evaluates[48].result).toEqual(true);//2026/01, 範囲内, step:4, 対象外月
        expect(evaluates[49].result).toEqual(false);//2026/02, 範囲内, step:4, 対象月
        expect(evaluates[51].result).toEqual(false);//2026/04, 範囲内, step:4, 対象月
        
        // 期間外はNotに関わらず常にFalse
        expect(evaluates[52].result).toEqual(false);//2026/05, 範囲外, step:4, 対象外月
        expect(evaluates[55].result).toEqual(false);//2026/08, 範囲外, step:4, 対象月
    });
});
