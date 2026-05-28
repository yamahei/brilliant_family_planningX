import { expect } from "jsr:@std/expect";
import * as types from "./types.ts";
import { RuleSomeMonthStepYear } from "./RuleSomeMonthStepYear.ts";

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
// パラメータ観点
Deno.test("引数チェック:fromYM > toYMはエラー",
() => {
    expect(() => {
        getInstance({
            fromYM: { year: 2424, month: 2 },
            toYM: { year: 2024, month: 1 }
        });
    }).toThrow(/earlier/);
});

Deno.test("引数チェック:stepが数字でないとエラー(NaN)",
() => {
    expect(() => {
        //nullは型システム上渡せない
        //undefinedはgetInstanceの実装上渡せない
        getInstance({ step: NaN });
    }).toThrow(/integer/);
});
Deno.test("引数チェック:stepが整数でないとエラー",
() => {
    expect(() => {
        getInstance({ step: 3.14 });
    }).toThrow(/integer/);
});
Deno.test("引数チェック:stepが正の整数でないとエラー(0)",
() => {
    expect(() => {
        getInstance({ step: 0 });
    }).toThrow(/positive/);
});
Deno.test("引数チェック:stepが正の整数でないとエラー(-1)",
    () => {
        expect(() => {
            getInstance({ step: -1 });
        }).toThrow(/positive/);
    });


Deno.test("引数チェック:months要素が0件はエラー",
() => {
    expect(() => {
        getInstance({ months: [] });
    }).toThrow(/least/);
});


Deno.test("引数チェック:months要素数が空はエラー",
() => {
    expect(() => {
        getInstance({ months: [] });
    }).toThrow(/least/);
});

Deno.test("引数チェック:months要素数が12超えはエラー",
() => {
    expect(() => {
        getInstance({
            //12が2つ（要素の重複はエラーではない）
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12]
        });
    }).toThrow(/most/);
});

// 評価観点：普通の評価
Deno.test("bulkEvaluate:普通の評価",
() => {
    const instance = getInstance({});
    const evaluates = instance.bulkEvaluate({ year: 2022, month: 1 }, { year: 2026, month: 9 });
    console.debug(evaluates);

    expect(evaluates[0].result).toEqual(false);//2022/01, 範囲外, step:0, 対象外月
    expect(evaluates[1].result).toEqual(false);//2022/02, 範囲外, step:0, 対象月
    expect(evaluates[2].result).toEqual(false);//2022/03, 範囲外, step:0, 対象月
    expect(evaluates[3].result).toEqual(false);//2022/04, 範囲外, step:0, 対象月
    expect(evaluates[4].result).toEqual(false);//2022/05, 範囲外, step:0, 対象外月
    expect(evaluates[5].result).toEqual(false);//2022/06, 範囲外, step:0, 対象外月
    expect(evaluates[6].result).toEqual(false);//2022/07, 範囲外, step:0, 対象外月
    expect(evaluates[7].result).toEqual(false);//2022/08, 範囲外, step:0, 対象月
    expect(evaluates[8].result).toEqual(false);//2022/09, 範囲外, step:0, 対象月
    expect(evaluates[9].result).toEqual(false);//2022/10, 範囲外, step:0, 対象月
    expect(evaluates[10].result).toEqual(false);//2022/11, 範囲外, step:0, 対象外月
    expect(evaluates[11].result).toEqual(false);//2022/12, 範囲内, step:0, 対象外月
    expect(evaluates[12].result).toEqual(false);//2023/01, 範囲内, step:1, 対象外月
    expect(evaluates[13].result).toEqual(false);//2023/02, 範囲内, step:1, 対象月
    expect(evaluates[14].result).toEqual(false);//2023/03, 範囲内, step:1, 対象月
    expect(evaluates[15].result).toEqual(false);//2023/04, 範囲内, step:1, 対象月
    expect(evaluates[16].result).toEqual(false);//2023/05, 範囲内, step:1, 対象外月
    expect(evaluates[17].result).toEqual(false);//2023/06, 範囲内, step:1, 対象外月
    expect(evaluates[18].result).toEqual(false);//2023/07, 範囲内, step:1, 対象外月
    expect(evaluates[19].result).toEqual(false);//2023/08, 範囲内, step:1, 対象月
    expect(evaluates[20].result).toEqual(false);//2023/09, 範囲内, step:1, 対象月
    expect(evaluates[21].result).toEqual(false);//2023/10, 範囲内, step:1, 対象月
    expect(evaluates[22].result).toEqual(false);//2023/11, 範囲内, step:1, 対象外月
    expect(evaluates[23].result).toEqual(false);//2023/12, 範囲内, step:1, 対象外月
    expect(evaluates[24].result).toEqual(false);//2024/01, 範囲内, step:2, 対象外月
    expect(evaluates[25].result).toEqual(true);//2024/02, 範囲内, step:2, 対象月
    expect(evaluates[26].result).toEqual(true);//2024/03, 範囲内, step:2, 対象月
    expect(evaluates[27].result).toEqual(true);//2024/04, 範囲内, step:2, 対象月
    expect(evaluates[28].result).toEqual(false);//2024/05, 範囲内, step:2, 対象外月
    expect(evaluates[29].result).toEqual(false);//2024/06, 範囲内, step:2, 対象外月
    expect(evaluates[30].result).toEqual(false);//2024/07, 範囲内, step:2, 対象外月
    expect(evaluates[31].result).toEqual(true);//2024/08, 範囲内, step:2, 対象月
    expect(evaluates[32].result).toEqual(true);//2024/09, 範囲内, step:2, 対象月
    expect(evaluates[33].result).toEqual(true);//2024/10, 範囲内, step:2, 対象月
    expect(evaluates[34].result).toEqual(false);//2024/11, 範囲内, step:2, 対象外月
    expect(evaluates[35].result).toEqual(false);//2024/12, 範囲内, step:2, 対象外月
    expect(evaluates[36].result).toEqual(false);//2025/01, 範囲内, step:3, 対象外月
    expect(evaluates[37].result).toEqual(false);//2025/02, 範囲内, step:3, 対象月
    expect(evaluates[38].result).toEqual(false);//2025/03, 範囲内, step:3, 対象月
    expect(evaluates[39].result).toEqual(false);//2025/04, 範囲内, step:3, 対象月
    expect(evaluates[40].result).toEqual(false);//2025/05, 範囲内, step:3, 対象外月
    expect(evaluates[41].result).toEqual(false);//2025/06, 範囲内, step:3, 対象外月
    expect(evaluates[42].result).toEqual(false);//2025/07, 範囲内, step:3, 対象外月
    expect(evaluates[43].result).toEqual(false);//2025/08, 範囲内, step:3, 対象月
    expect(evaluates[44].result).toEqual(false);//2025/09, 範囲内, step:3, 対象月
    expect(evaluates[45].result).toEqual(false);//2025/10, 範囲内, step:3, 対象月
    expect(evaluates[46].result).toEqual(false);//2025/11, 範囲内, step:3, 対象外月
    expect(evaluates[47].result).toEqual(false);//2025/12, 範囲内, step:3, 対象外月
    expect(evaluates[48].result).toEqual(false);//2026/01, 範囲内, step:4, 対象外月
    expect(evaluates[49].result).toEqual(true);//2026/02, 範囲内, step:4, 対象月
    expect(evaluates[50].result).toEqual(true);//2026/03, 範囲内, step:4, 対象月
    expect(evaluates[51].result).toEqual(true);//2026/04, 範囲内, step:4, 対象月
    expect(evaluates[52].result).toEqual(false);//2026/05, 範囲外, step:4, 対象外月
    expect(evaluates[53].result).toEqual(false);//2026/06, 範囲外, step:4, 対象外月
    expect(evaluates[54].result).toEqual(false);//2026/07, 範囲外, step:4, 対象外月
    expect(evaluates[55].result).toEqual(false);//2026/08, 範囲外, step:4, 対象月
    expect(evaluates[56].result).toEqual(false);//2026/09, 範囲外, step:4, 対象月

});

Deno.test("bulkEvaluate:notで結果を反転する",
() => {
    const instance = getInstance({ not: true });
    const evaluates = instance.bulkEvaluate({ year: 2022, month: 1 }, { year: 2026, month: 9 });
    console.debug(evaluates);

    expect(evaluates[0].result).toEqual(true);//2022/01, 範囲外, step:0, 対象外月
    expect(evaluates[1].result).toEqual(true);//2022/02, 範囲外, step:0, 対象月
    expect(evaluates[2].result).toEqual(true);//2022/03, 範囲外, step:0, 対象月
    expect(evaluates[3].result).toEqual(true);//2022/04, 範囲外, step:0, 対象月
    expect(evaluates[4].result).toEqual(true);//2022/05, 範囲外, step:0, 対象外月
    expect(evaluates[5].result).toEqual(true);//2022/06, 範囲外, step:0, 対象外月
    expect(evaluates[6].result).toEqual(true);//2022/07, 範囲外, step:0, 対象外月
    expect(evaluates[7].result).toEqual(true);//2022/08, 範囲外, step:0, 対象月
    expect(evaluates[8].result).toEqual(true);//2022/09, 範囲外, step:0, 対象月
    expect(evaluates[9].result).toEqual(true);//2022/10, 範囲外, step:0, 対象月
    expect(evaluates[10].result).toEqual(true);//2022/11, 範囲外, step:0, 対象外月
    expect(evaluates[11].result).toEqual(true);//2022/12, 範囲内, step:0, 対象外月
    expect(evaluates[12].result).toEqual(true);//2023/01, 範囲内, step:1, 対象外月
    expect(evaluates[13].result).toEqual(true);//2023/02, 範囲内, step:1, 対象月
    expect(evaluates[14].result).toEqual(true);//2023/03, 範囲内, step:1, 対象月
    expect(evaluates[15].result).toEqual(true);//2023/04, 範囲内, step:1, 対象月
    expect(evaluates[16].result).toEqual(true);//2023/05, 範囲内, step:1, 対象外月
    expect(evaluates[17].result).toEqual(true);//2023/06, 範囲内, step:1, 対象外月
    expect(evaluates[18].result).toEqual(true);//2023/07, 範囲内, step:1, 対象外月
    expect(evaluates[19].result).toEqual(true);//2023/08, 範囲内, step:1, 対象月
    expect(evaluates[20].result).toEqual(true);//2023/09, 範囲内, step:1, 対象月
    expect(evaluates[21].result).toEqual(true);//2023/10, 範囲内, step:1, 対象月
    expect(evaluates[22].result).toEqual(true);//2023/11, 範囲内, step:1, 対象外月
    expect(evaluates[23].result).toEqual(true);//2023/12, 範囲内, step:1, 対象外月
    expect(evaluates[24].result).toEqual(true);//2024/01, 範囲内, step:2, 対象外月
    expect(evaluates[25].result).toEqual(false);//2024/02, 範囲内, step:2, 対象月
    expect(evaluates[26].result).toEqual(false);//2024/03, 範囲内, step:2, 対象月
    expect(evaluates[27].result).toEqual(false);//2024/04, 範囲内, step:2, 対象月
    expect(evaluates[28].result).toEqual(true);//2024/05, 範囲内, step:2, 対象外月
    expect(evaluates[29].result).toEqual(true);//2024/06, 範囲内, step:2, 対象外月
    expect(evaluates[30].result).toEqual(true);//2024/07, 範囲内, step:2, 対象外月
    expect(evaluates[31].result).toEqual(false);//2024/08, 範囲内, step:2, 対象月
    expect(evaluates[32].result).toEqual(false);//2024/09, 範囲内, step:2, 対象月
    expect(evaluates[33].result).toEqual(false);//2024/10, 範囲内, step:2, 対象月
    expect(evaluates[34].result).toEqual(true);//2024/11, 範囲内, step:2, 対象外月
    expect(evaluates[35].result).toEqual(true);//2024/12, 範囲内, step:2, 対象外月
    expect(evaluates[36].result).toEqual(true);//2025/01, 範囲内, step:3, 対象外月
    expect(evaluates[37].result).toEqual(true);//2025/02, 範囲内, step:3, 対象月
    expect(evaluates[38].result).toEqual(true);//2025/03, 範囲内, step:3, 対象月
    expect(evaluates[39].result).toEqual(true);//2025/04, 範囲内, step:3, 対象月
    expect(evaluates[40].result).toEqual(true);//2025/05, 範囲内, step:3, 対象外月
    expect(evaluates[41].result).toEqual(true);//2025/06, 範囲内, step:3, 対象外月
    expect(evaluates[42].result).toEqual(true);//2025/07, 範囲内, step:3, 対象外月
    expect(evaluates[43].result).toEqual(true);//2025/08, 範囲内, step:3, 対象月
    expect(evaluates[44].result).toEqual(true);//2025/09, 範囲内, step:3, 対象月
    expect(evaluates[45].result).toEqual(true);//2025/10, 範囲内, step:3, 対象月
    expect(evaluates[46].result).toEqual(true);//2025/11, 範囲内, step:3, 対象外月
    expect(evaluates[47].result).toEqual(true);//2025/12, 範囲内, step:3, 対象外月
    expect(evaluates[48].result).toEqual(true);//2026/01, 範囲内, step:4, 対象外月
    expect(evaluates[49].result).toEqual(false);//2026/02, 範囲内, step:4, 対象月
    expect(evaluates[50].result).toEqual(false);//2026/03, 範囲内, step:4, 対象月
    expect(evaluates[51].result).toEqual(false);//2026/04, 範囲内, step:4, 対象月
    expect(evaluates[52].result).toEqual(true);//2026/05, 範囲外, step:4, 対象外月
    expect(evaluates[53].result).toEqual(true);//2026/06, 範囲外, step:4, 対象外月
    expect(evaluates[54].result).toEqual(true);//2026/07, 範囲外, step:4, 対象外月
    expect(evaluates[55].result).toEqual(true);//2026/08, 範囲外, step:4, 対象月
    expect(evaluates[56].result).toEqual(true);//2026/09, 範囲外, step:4, 対象月

});

