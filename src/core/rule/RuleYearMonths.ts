import { RuleBase } from "./RuleBase";
import * as types from "./types";

export class RuleYearMonths extends RuleBase<types.BFPRuleArg_YearMonths> {

    static getInstance(
        yearmonths: types.BFPType_YearMonth[],
        fromYM: types.BFPType_YearMonth | null,
        toYM: types.BFPType_YearMonth | null,
        not: types.BFPType_Not,
    ): RuleYearMonths {
        return new RuleYearMonths({
            type: "YEARMONTH",
            yearmonths: yearmonths,
            fromYM: fromYM,
            toYM: toYM,
            not: not,
        });
    }

    constructor(rule:types.BFPRuleArg_YearMonths) {
        super(rule);

        const yearmonths:types.BFPType_YearMonth[] = rule.yearmonths;
        if(yearmonths.length <= 0) {
            throw new Error("yearmonths must have at least one element.");
        }
    }

    _evaluate(targetYM: types.BFPType_YearMonth): NonNullable<boolean> {
        const yearmonths:types.BFPType_YearMonth[] = this.rule.yearmonths;
        const isFound = yearmonths.some((expressionYM: types.BFPType_YearMonth) => {
            const equalsYear = expressionYM.year === targetYM.year;
            const equalsMonth = expressionYM.month === targetYM.month;
            return equalsYear && equalsMonth;
        });
        return isFound;
    }
}
