

/**
 * Public types
 */

export type BFPType_RuleNameYM = "YEARMONTH";
export type BFPType_RuleNameSM = "SOMEMONTH";
export type BFPType_RuleNameSMSY = "SOMEMONTHSTEPYEAR";
export type BFPType_RuleNames = BFPType_RuleNameYM | BFPType_RuleNameSM | BFPType_RuleNameSMSY;
export const BFPConst_RuleNames = {
    BFPType_RuleNameYM: "YEARMONTH" as BFPType_RuleNameYM,
    BFPType_RuleNameSM: "SOMEMONTH" as BFPType_RuleNameSM,
    BFPType_RuleNameSMSY: "SOMEMONTHSTEPYEAR" as BFPType_RuleNameSMSY,
}

export type BFPType_Not = boolean;
export type BFPType_Step = number;
export type BFPType_Year = number;
export type BFPType_Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type BFPType_YearMonth = {
    year: NonNullable<BFPType_Year>;
    month: NonNullable<BFPType_Month>;
};

/**
 * Public rules
 */
// 共通のパラメータ
type BFPRuleArg_Base = {
    fromYM: BFPType_YearMonth | null;
    toYM: BFPType_YearMonth | null;
    not: NonNullable<BFPType_Not>;
}

// 特定年月（のいずれか）に合致する
export type BFPRuleArg_YearMonths = BFPRuleArg_Base & {
    type: BFPType_RuleNameYM;
    yearmonths: NonNullable<BFPType_YearMonth[]>;
}

// 特定年月期間[from-to]の毎月合致する
// => BFPRule_SomeMonth.monthsが1~12で代用可能

// 特定年月期間[from-to]の指定月[months]（のいずれか）に合致する
export type BFPRuleArg_SomeMonth = BFPRuleArg_Base & {
    type: BFPType_RuleNameSM;
    months: NonNullable<BFPType_Month[]>;
}

// 特定年月期間[from-to]の基準年月[from]からX[step]年毎の指定月[months]（のいずれか）に合致する
export type BFPRuleArg_SomeMonthStepYear = BFPRuleArg_Base & {
    type: BFPType_RuleNameSMSY;
    months: NonNullable<BFPType_Month[]>;
    step: NonNullable<BFPType_Step>;//1は毎年と同義
}

export type BFPRuleEvaluateResult = {
    yearmonth: NonNullable<BFPType_YearMonth>;
    result:  boolean
}

export type BFPRuleArg_Any = BFPRuleArg_YearMonths | BFPRuleArg_SomeMonth | BFPRuleArg_SomeMonthStepYear;
export type BFPRules = NonNullable<BFPRuleArg_Any[]>;