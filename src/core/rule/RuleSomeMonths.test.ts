import { describe, test, expect } from "@jest/globals";
import * as types from "./types";
import { RuleSomeMonths } from "./RuleSomeMonths";

const getInstance = (
    { fromYM, toYM, not, months }:{
        fromYM?:types.BFPType_YearMonth,
        toYM?:types.BFPType_YearMonth,
        not?:types.BFPType_Not,
        months?:types.BFPType_Month[]
    }):RuleSomeMonths => {
    return new RuleSomeMonths({
        type: "SOMEMONTH",
        fromYM: fromYM || { year: 2023, month: 12 },
        toYM: toYM  || { year: 2025, month: 1 },
        not: not || false,
        months: months || [1, 3, 5]
    });
}

describe("RuleSomeMonths", () => {
    // パラメータ観点
    test("引数チェック:fromYM > toYMはエラー", () => {
        expect(() => {
            getInstance({
                fromYM: { year: 2424, month: 2 },
                toYM: { year: 2024, month: 1 }
            });
        }).toThrow(/earlier/);
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
    test("evaluate:普通の評価", () => {
        const instance = getInstance({});

        expect(instance.evaluate({ year: 2023, month: 1 })).toEqual(false);//範囲外：対象月
        expect(instance.evaluate({ year: 2023, month: 2 })).toEqual(false);//範囲外：対象外月
        expect(instance.evaluate({ year: 2023, month: 3 })).toEqual(false);//範囲外：対象月
        expect(instance.evaluate({ year: 2023, month: 11 })).toEqual(false);//範囲外：対象外月
        expect(instance.evaluate({ year: 2023, month: 12 })).toEqual(false);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 1 })).toEqual(true);//範囲内：対象月
        expect(instance.evaluate({ year: 2024, month: 2 })).toEqual(false);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 3 })).toEqual(true);//範囲内：対象月
        expect(instance.evaluate({ year: 2024, month: 4 })).toEqual(false);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 5 })).toEqual(true);//範囲内：対象月
        expect(instance.evaluate({ year: 2024, month: 6 })).toEqual(false);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 12 })).toEqual(false);//範囲内：対象外月
        expect(instance.evaluate({ year: 2025, month: 1 })).toEqual(true);//範囲内：対象月
        expect(instance.evaluate({ year: 2025, month: 2 })).toEqual(false);//範囲外：対象外月
        expect(instance.evaluate({ year: 2025, month: 3 })).toEqual(false);//範囲外：対象月
    });

    test("evaluate:notで結果を反転する", () => {
        const instance = getInstance({ not: true });

        // 期間外はNotに関わらず常にFalse
        expect(instance.evaluate({ year: 2023, month: 1 })).toEqual(false);//範囲外：対象月
        expect(instance.evaluate({ year: 2023, month: 2 })).toEqual(false);//範囲外：対象外月
        expect(instance.evaluate({ year: 2023, month: 3 })).toEqual(false);//範囲外：対象月
        expect(instance.evaluate({ year: 2023, month: 11 })).toEqual(false);//範囲外：対象外月

        expect(instance.evaluate({ year: 2023, month: 12 })).toEqual(true);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 1 })).toEqual(false);//範囲内：対象月
        expect(instance.evaluate({ year: 2024, month: 2 })).toEqual(true);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 3 })).toEqual(false);//範囲内：対象月
        expect(instance.evaluate({ year: 2024, month: 4 })).toEqual(true);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 5 })).toEqual(false);//範囲内：対象月
        expect(instance.evaluate({ year: 2024, month: 6 })).toEqual(true);//範囲内：対象外月
        expect(instance.evaluate({ year: 2024, month: 12 })).toEqual(true);//範囲内：対象外月
        expect(instance.evaluate({ year: 2025, month: 1 })).toEqual(false);//範囲内：対象月

        // 期間外はNotに関わらず常にFalse
        expect(instance.evaluate({ year: 2025, month: 2 })).toEqual(false);//範囲外：対象外月
        expect(instance.evaluate({ year: 2025, month: 3 })).toEqual(false);//範囲外：対象月
        expect(instance.evaluate({ year: 2025, month: 4 })).toEqual(false);//範囲外：対象外月
    });
});
