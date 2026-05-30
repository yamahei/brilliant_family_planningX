import { RuleBase } from "./RuleBase";
import * as types from "./types";

export class RuleSomeMonths extends RuleBase<types.BFPRuleArg_SomeMonth> {

    static getInstance(
        months: types.BFPType_Month[],
        fromYM: types.BFPType_YearMonth | null,
        toYM: types.BFPType_YearMonth | null,
        not: types.BFPType_Not,
    ): RuleSomeMonths {
        return new RuleSomeMonths({
            type: "SOMEMONTH",
            months: months,
            fromYM: fromYM,
            toYM: toYM,
            not: not,
        });
    }

    constructor(rule:types.BFPRuleArg_SomeMonth) {
        super(rule);

        const months:types.BFPType_Month[] = rule.months;
        if(months.length <= 0) {
            throw new Error("months must have at least one element.");
        }
        if(months.length > 12) {
            throw new Error("months must have at most 12 elements.");
        }
    }

    _evaluate(targetYM: types.BFPType_YearMonth): NonNullable<boolean> {
        const ruleMonths:types.BFPType_Month[] = this.rule.months;
        const targetMonth:types.BFPType_Month = targetYM.month;
        const isFound = ruleMonths.some((expressionMonth: types.BFPType_Month) => {
            return targetMonth === expressionMonth;
        });
        return isFound;
    }
}
