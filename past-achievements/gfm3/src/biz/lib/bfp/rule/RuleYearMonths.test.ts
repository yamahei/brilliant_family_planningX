import { expect } from "jsr:@std/expect";
import * as types from "./types.ts";
import { RuleYearMonths } from "./RuleYearMonths.ts";

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

// パラメータ観点
Deno.test("引数チェック:fromYM > toYMはエラー",
() => {
    expect(() => {
        getInstance({
            fromYM: { year: 2025, month: 12 },
            toYM: { year: 2023, month: 1 }
        });
    }).toThrow(/earlier/);
});
Deno.test("引数チェック:yearmonths要素が0件はエラー",
() => {
    expect(() => {
        getInstance({ yearmonths: [] });
    }).toThrow(/yearmonths/);
});

// 評価観点：普通の評価
Deno.test("evaluate:普通の評価",
async(t) => {
    const instance = getInstance({});

    //インスタンスのFromYMの境界チェック
    await t.step("FromYM-1ヵ月", () => {
        expect(instance.evaluate({ year: 2022, month: 12 })).toEqual(false);
    });
    await t.step("FromYMぴったり", () => {
        expect(instance.evaluate({ year: 2023, month: 1 })).toEqual(false);
    });

    //インスタンスのFromYM-toYMの範囲内
    await t.step("対象月-1ヵ月", () => {
        expect(instance.evaluate({ year: 2023, month: 12 })).toEqual(false);
    });
    await t.step("対象月①", () => {
        expect(instance.evaluate({ year: 2024, month: 1 })).toEqual(true);
    });
    await t.step("対象月②", () => {
        expect(instance.evaluate({ year: 2024, month: 2 })).toEqual(true);
    });
    await t.step("対象月+1ヵ月", () => {
        expect(instance.evaluate({ year: 2024, month: 3 })).toEqual(false);
    });

    //インスタンスのtoYMの境界チェック
    await t.step("toYMぴったり", () => {
        expect(instance.evaluate({ year: 2025, month: 12 })).toEqual(false);
    });
    await t.step("toYM+1ヵ月", () => {
        expect(instance.evaluate({ year: 2026, month: 1 })).toEqual(false);
    });
});

Deno.test("evaluate:notで結果を反転する",
async (t) => {
    const instance = getInstance({ not: true });

    //インスタンスのFromYMの境界チェック
    await t.step("FromYM-1ヵ月", () => {
        expect(instance.evaluate({ year: 2022, month: 12 })).toEqual(true);
    });
    await t.step("FromYMぴったり", () => {
        expect(instance.evaluate({ year: 2023, month: 1 })).toEqual(true);
    });

    //インスタンスのFromYM-toYMの範囲内
    await t.step("対象月-1ヵ月", () => {
        expect(instance.evaluate({ year: 2023, month: 12 })).toEqual(true);
    });
    await t.step("対象月①", () => {
        expect(instance.evaluate({ year: 2024, month: 1 })).toEqual(false);
    });
    await t.step("対象月②", () => {
        expect(instance.evaluate({ year: 2024, month: 2 })).toEqual(false);
    });
    await t.step("対象月+1ヵ月", () => {
        expect(instance.evaluate({ year: 2024, month: 3 })).toEqual(true);
    });

    //インスタンスのtoYMの境界チェック
    await t.step("toYMぴったり", () => {
        expect(instance.evaluate({ year: 2025, month: 12 })).toEqual(true);
    });
    await t.step("toYM+1ヵ月", () => {
        expect(instance.evaluate({ year: 2026, month: 1 })).toEqual(true);
    });
});


// 評価観点：ルールのfromYM-toYM範囲と評価のfromYM-toYM範囲
Deno.test("評価観点：ルールのfromYM-toYM範囲と評価のfromYM-toYM範囲",
async (t) => {

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

    await t.step("bulkEvaluate:ルールのfromYM-toYM範囲'内'のyearmonthは合致する", () => {
        const expression = evaluates[2];// 2024-01
        console.debug(expression);
        expect(expression.result).toEqual(true);
    });
    await t.step("bulkEvaluate:ルールのfromYM-toYM範囲'内'のyearmonthは合致する", () => {
        const expression = evaluates[7];// 2024-06
        console.debug(expression);
        expect(expression.result).toEqual(true);
    });
    await t.step("bulkEvaluate:ルールのfromYM-toYM範囲'内'のyearmonthは合致する", () => {
        const expression = evaluates[13];// 2024-12
        console.debug(expression);
        expect(expression.result).toEqual(true);
    });
    await t.step("bulkEvaluate:ルールのfromYM-toYM範囲'外'のyearmonthは合致しない", () => {
        const expression = evaluates[1];// 2023-12
        console.debug(expression);
        expect(expression.result).toEqual(false);
    });
    await t.step("bulkEvaluate:ルールのfromYM-toYM範囲'外'のyearmonthは合致しない", () => {
        const expression = evaluates[14];// 2025-01
        console.debug(expression);
        expect(expression.result).toEqual(false);
    });
});



