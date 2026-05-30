import { describe, test, expect } from "@jest/globals";
import * as types from "./types";
import { RuleYearMonths } from "./RuleYearMonths";

const getInstance = (
    { fromYM, toYM, not, yearmonths }:{
        fromYM?:types.BFPType_YearMonth,
        toYM?:types.BFPType_YearMonth,
        not?:types.BFPType_Not,
        yearmonths?:types.BFPType_YearMonth[]
    }):RuleYearMonths => {
    return new RuleYearMonths({
        type: "YEARMONTH",
        fromYM: fromYM || { year: 2023, month: 1 },
        toYM: toYM  || { year: 2025, month: 12 },
        not: not || false,
        yearmonths: yearmonths || [
            { year: 2024, month: 1 },
            { year: 2024, month: 2 },
        ]
    });
}

describe("RuleYearMonths", () => {
    // パラメータ観点
    test("引数チェック:fromYM > toYMはエラー", () => {
        expect(() => {
            getInstance({
                fromYM: { year: 2025, month: 12 },
                toYM: { year: 2023, month: 1 }
            });
        }).toThrow(/earlier/);
    });

    test("引数チェック:yearmonths要素が0件はエラー", () => {
        expect(() => {
            getInstance({ yearmonths: [] });
        }).toThrow(/yearmonths/);
    });

    // 評価観点：普通の評価
    describe("evaluate:普通の評価", () => {
        const instance = getInstance({});

        //インスタンスのFromYMの境界チェック
        test("FromYM-1ヵ月", () => {
            expect(instance.evaluate({ year: 2022, month: 12 })).toEqual(false);
        });
        test("FromYMぴったり", () => {
            expect(instance.evaluate({ year: 2023, month: 1 })).toEqual(false);
        });

        //インスタンスのFromYM-toYMの範囲内
        test("対象月-1ヵ月", () => {
            expect(instance.evaluate({ year: 2023, month: 12 })).toEqual(false);
        });
        test("対象月①", () => {
            expect(instance.evaluate({ year: 2024, month: 1 })).toEqual(true);
        });
        test("対象月②", () => {
            expect(instance.evaluate({ year: 2024, month: 2 })).toEqual(true);
        });
        test("対象月+1ヵ月", () => {
            expect(instance.evaluate({ year: 2024, month: 3 })).toEqual(false);
        });

        //インスタンスのtoYMの境界チェック
        test("toYMぴったり", () => {
            expect(instance.evaluate({ year: 2025, month: 12 })).toEqual(false);
        });
        test("toYM+1ヵ月", () => {
            expect(instance.evaluate({ year: 2026, month: 1 })).toEqual(false);
        });
    });

    describe("evaluate:notで結果を反転する", () => {
        const instance = getInstance({ not: true });

        //インスタンスのFromYMの境界チェック (期間外はNotに関わらず常にFalse)
        test("FromYM-1ヵ月", () => {
            expect(instance.evaluate({ year: 2022, month: 12 })).toEqual(false);
        });
        // 期間内
        test("FromYMぴったり", () => {
            expect(instance.evaluate({ year: 2023, month: 1 })).toEqual(true);
        });

        //インスタンスのFromYM-toYMの範囲内
        test("対象月-1ヵ月", () => {
            expect(instance.evaluate({ year: 2023, month: 12 })).toEqual(true);
        });
        test("対象月①", () => {
            expect(instance.evaluate({ year: 2024, month: 1 })).toEqual(false);
        });
        test("対象月②", () => {
            expect(instance.evaluate({ year: 2024, month: 2 })).toEqual(false);
        });
        test("対象月+1ヵ月", () => {
            expect(instance.evaluate({ year: 2024, month: 3 })).toEqual(true);
        });

        //インスタンスのtoYMの境界チェック
        test("toYMぴったり", () => {
            expect(instance.evaluate({ year: 2025, month: 12 })).toEqual(true);
        });
        // 期間外はNotに関わらず常にFalse
        test("toYM+1ヵ月", () => {
            expect(instance.evaluate({ year: 2026, month: 1 })).toEqual(false);
        });
    });

    test("評価観点：ルールのfromYM-toYM範囲と評価のfromYM-toYM範囲", () => {
        const instance = getInstance({
            fromYM: { year: 2024, month: 1 },
            toYM: { year: 2024, month: 12 },
            yearmonths: [
                { year: 2023, month: 12 },//fromYM外
                { year: 2024, month: 1 },//fromYMぴったり
                { year: 2024, month: 6 },//fromYM-toYMの範囲内
                { year: 2024, month: 12 },//toYMぴったり
                { year: 2025, month: 1 },//toYM外
            ]
        });
        const evaluates = instance.bulkEvaluate({ year: 2023, month: 11 }, { year: 2025, month: 2 });

        // bulkEvaluate:ルールのfromYM-toYM範囲'内'のyearmonthは合致する
        expect(evaluates[2].result).toEqual(true); // 2024-01
        expect(evaluates[7].result).toEqual(true); // 2024-06
        expect(evaluates[13].result).toEqual(true); // 2024-12
        // bulkEvaluate:ルールのfromYM-toYM範囲'外'のyearmonthは合致しない
        expect(evaluates[1].result).toEqual(false); // 2023-12
        expect(evaluates[14].result).toEqual(false); // 2025-01
    });
});
