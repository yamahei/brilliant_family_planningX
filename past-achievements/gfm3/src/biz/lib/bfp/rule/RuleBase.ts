import * as types from "./types.ts";

export abstract class RuleBase<T extends types.BFPRuleArg_Any> {

    /**
     * コンストラクタ
     * fromYM <= toYM かどうかは抽象クラスでチェックするので、
     * それ以外のパラメータは、各派生クラス内でチェックすること
     */
    protected rule:T;
    constructor(rule: T) {
        console.log(JSON.stringify(rule));
        this.rule = rule;
        const ruleFromYMDate:Date = new Date(`${rule.fromYM.year}-${rule.fromYM.month}-01`);
        const ruleToYMDate:Date = new Date(`${rule.toYM.year}-${rule.toYM.month}-01`);
        if(ruleFromYMDate > ruleToYMDate) {
            throw new Error("rule.fromYM is earlier than rule.toYM.");
        }
    }

    /**
     * 期間を指定して年月のリストを取得する
     * 共通的な処理なので、抽象クラスに実装する
     * @param fromYM
     * @param toYM
     * @returns 年月のリスト
     */
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
                // year: eval(`${currentYMDate.getFullYear()}n`),
                year: currentYMDate.getFullYear(),
                month: (currentYMDate.getMonth() + 1) as types.BFPType_YearMonth["month"]
            });
            currentYMDate.setMonth(currentYMDate.getMonth() + 1);
        }

        return yearMonthList;
    }

    /**
     * 対象年月がルールに合致するかの評価の実体：各派生クラスで実装する
     * ルールのfromYMとtoYMの範囲内かどうかのチェックは抽象クラスで行なうので実装不要
     * ルールのnotフラグによる反転の処理も抽象クラスで行なうので実装不要
     * @param targetYM 評価対象の年月
     */
    protected abstract _evaluate(targetYM:types.BFPType_YearMonth):NonNullable<boolean>;

    /**
     * 対象年月がルールに合致するかの評価の表面的なIF
     * ルールのfromYMとtoYMの範囲内かどうかのチェックは共通的に必要なため、
     * 抽象クラスで行なう（評価の実体だけ、派生クラスに任せる）
     * @param targetYM 評価対象の年月
     * @returns
     */
    public evaluate(targetYM:types.BFPType_YearMonth):NonNullable<boolean> {
        const rule:T = this.rule;
        const ruleFromYMDate:Date = new Date(`${rule.fromYM.year}-${rule.fromYM.month}-01`);
        const ruleToYMDate:Date = new Date(`${rule.toYM.year}-${rule.toYM.month}-01`);
        const targetYMDate:Date = new Date(`${targetYM.year}-${targetYM.month}-01`);
        if(targetYMDate < ruleFromYMDate || ruleToYMDate < targetYMDate) {
            console.debug({cause: "out of rule.fromYM-toYM", targetYM, ruleFromYMDate, ruleToYMDate});
            return rule.not ? !false : false;
        }else{
            const isFound = this._evaluate(targetYM);
            console.debug(`at ${targetYM.year}/${targetYM.month}, _evaluate returns: ${isFound}`);
            return rule.not ? !isFound : isFound;
        }
    }

    /**
     * 期間を指定して評価結果のリストを取得する
     * @param fromYM 期間の開始年月
     * @param toYM 期間の終了年月
     * @returns 評価結果のリスト
     */
    public bulkEvaluate(fromYM:types.BFPType_YearMonth, toYM:types.BFPType_YearMonth):NonNullable<types.BFPRuleEvaluateResult>[] {
        const rule:T = this.rule;
        const ruleFromYMDate:Date = new Date(`${rule.fromYM.year}-${rule.fromYM.month}-01`);
        const ruleToYMDate:Date = new Date(`${rule.toYM.year}-${rule.toYM.month}-01`);

        const YearMonthList:types.BFPType_YearMonth[] = this.getYearMonthList(fromYM, toYM);
        return YearMonthList.map(ym => {
            const ymDate:Date = new Date(`${ym.year}-${ym.month}-01`);
            const result:types.BFPRuleEvaluateResult = {
                yearmonth: ym,
                result: rule.not ? !false : false,
            };
            if(ruleFromYMDate <= ymDate && ymDate <= ruleToYMDate) {
                const isFound = this._evaluate(ym);
                result.result = rule.not ? !isFound : isFound;
            }
            return result;
        });
    }
}