import { RuleBase } from "./RuleBase.ts";
import * as types from "./types.ts";

export class RuleSomeMonthStepYear extends RuleBase<types.BFPRuleArg_SomeMonthStepYear> {

    static getInstance(
        months: types.BFPType_Month[],
        step: types.BFPType_Step,
        fromYM: types.BFPType_YearMonth,
        toYM: types.BFPType_YearMonth,
        not: types.BFPType_Not,
    ): RuleSomeMonthStepYear {
        return new RuleSomeMonthStepYear({
            type: "SOMEMONTHSTEPYEAR",
            months: months,
            step: step,
            fromYM: fromYM,
            toYM: toYM,
            not: not,
        });
    }

    constructor(rule:types.BFPRuleArg_SomeMonthStepYear) {
        super(rule);

        const step = Number(rule.step);
        if(!Number.isInteger(step)){ throw new Error("step must be integer."); }
        if(step <= 0){ throw new Error("step must be positive."); }

        const months:types.BFPType_Month[] = rule.months;
        if(months.length <= 0) {
            throw new Error("months must have at least one element.");
        }
        if(months.length > 12) {
            throw new Error("months must have at most 12 elements.");
        }

    }

    _evaluate(targetYM: types.BFPType_YearMonth): NonNullable<boolean> {
        const step:types.BFPType_Step = this.rule.step;
        const fromYear:types.BFPType_Year = this.rule.fromYM.year;
        const targetYear:types.BFPType_Year = targetYM.year;
        const diffYear:number = Number(targetYear) - Number(fromYear);
        const isYearHit = (Number(diffYear) % Number(step) === 0);
        if(!isYearHit){ return false; }

        const months:types.BFPType_Month[] = this.rule.months;
        const targetMonth:types.BFPType_Month = targetYM.month;
        const isFound = months.some((expressionMonth: types.BFPType_Month) => {
            return targetMonth === expressionMonth;
        });
        return isFound;
    }
}

