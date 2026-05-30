import * as types from "./types";

export abstract class RuleBase<T extends types.BFPRuleArg_Any> {

    protected rule:T;
    constructor(rule: T) {
        this.rule = rule;
        
        // FromTo validation if both exist
        if(rule.fromYM && rule.toYM) {
            const ruleFromYMDate:Date = new Date(`${rule.fromYM.year}-${rule.fromYM.month}-01`);
            const ruleToYMDate:Date = new Date(`${rule.toYM.year}-${rule.toYM.month}-01`);
            if(ruleFromYMDate > ruleToYMDate) {
                throw new Error("rule.fromYM is earlier than rule.toYM.");
            }
        }
    }

    private getYearMonthList(fromYM:types.BFPType_YearMonth, toYM:types.BFPType_YearMonth)
    :types.BFPType_YearMonth[] {
        const fromYMDate = new Date(`${fromYM.year}-${fromYM.month}-01`);
        const toYMMDate = new Date(`${toYM.year}-${toYM.month}-01`);
        if(fromYMDate > toYMMDate) {
            throw new Error("fromYM is earlier than toYM.");
        }

        const yearMonthList:types.BFPType_YearMonth[] = [];
        const currentYMDate = new Date(fromYMDate);
        while(currentYMDate <= toYMMDate) {
            yearMonthList.push({
                year: currentYMDate.getFullYear(),
                month: (currentYMDate.getMonth() + 1) as types.BFPType_YearMonth["month"]
            });
            currentYMDate.setMonth(currentYMDate.getMonth() + 1);
        }

        return yearMonthList;
    }

    protected abstract _evaluate(targetYM:types.BFPType_YearMonth):NonNullable<boolean>;

    public evaluate(targetYM:types.BFPType_YearMonth):NonNullable<boolean> {
        const rule:T = this.rule;
        
        const targetYMDate:Date = new Date(`${targetYM.year}-${targetYM.month}-01`);
        
        // Evaluate From-To (Now they are optional per the new spec, but the logic handles them if present)
        let isWithinRange = true;
        if (rule.fromYM) {
            const ruleFromYMDate:Date = new Date(`${rule.fromYM.year}-${rule.fromYM.month}-01`);
            if (targetYMDate < ruleFromYMDate) isWithinRange = false;
        }
        if (rule.toYM) {
            const ruleToYMDate:Date = new Date(`${rule.toYM.year}-${rule.toYM.month}-01`);
            if (ruleToYMDate < targetYMDate) isWithinRange = false;
        }

        if(!isWithinRange) {
            // Not: true の反転効果は、有効な期間（From-To）の内側だけで適用される
            return false;
        }else{
            const isFound = this._evaluate(targetYM);
            return rule.not ? !isFound : isFound;
        }
    }

    public bulkEvaluate(fromYM:types.BFPType_YearMonth, toYM:types.BFPType_YearMonth):NonNullable<types.BFPRuleEvaluateResult>[] {
        const YearMonthList:types.BFPType_YearMonth[] = this.getYearMonthList(fromYM, toYM);
        return YearMonthList.map(ym => {
            return {
                yearmonth: ym,
                result: this.evaluate(ym),
            };
        });
    }
}
