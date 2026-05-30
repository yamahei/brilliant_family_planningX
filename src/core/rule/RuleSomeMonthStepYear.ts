import { RuleBase } from "./RuleBase";
import * as types from "./types";

export class RuleSomeMonthStepYear extends RuleBase<types.BFPRuleArg_SomeMonthStepYear> {

    static getInstance(
        months: types.BFPType_Month[],
        step: types.BFPType_Step,
        fromYM: types.BFPType_YearMonth | null,
        toYM: types.BFPType_YearMonth | null,
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
        
        // This rule requires fromYM to calculate steps
        if(!rule.fromYM) {
            throw new Error("fromYM is required for RuleSomeMonthStepYear to calculate steps.");
        }
    }

    _evaluate(targetYM: types.BFPType_YearMonth): NonNullable<boolean> {
        const step:types.BFPType_Step = this.rule.step;
        // The rule is guaranteed to have fromYM from the constructor check
        const fromYear:types.BFPType_Year = this.rule.fromYM!.year;
        const targetYear:types.BFPType_Year = targetYM.year;
        
        // The difference in years must be a multiple of step
        const diffYear:number = Number(targetYear) - Number(fromYear);
        if (diffYear < 0) return false; // shouldn't happen if evaluate checks fromYM first, but just in case
        
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
