import * as types from "./lib/bfp/rule/types.ts";


/*
    VMAccounts
*/

export type VMRecord = {
    yearmonth: NonNullable<types.BFPType_YearMonth>;
    memo: string | null;
    balance : number;
};
export type VMRecords = VMRecord[];

export type VMAccount = {
    name: string;
    memo: string | null;
    records: NonNullable<VMRecords>;
};
export type VMAccounts = VMAccount[];

/*
    VMKlasses
*/
export const VMRuleNotes = [
    {
        type: types.BFPConst_RuleNames.BFPType_RuleNameSM,
        name: "指定月",
        description: "毎年 4月と10月など、指定した月に毎年発生するルール",
    },
    {
        type: types.BFPConst_RuleNames.BFPType_RuleNameSMSY,
        name: "複雑なルール",
        description: "指定した月に発生するが、x年ごとに発生するルール",
    },
    {
        type: types.BFPConst_RuleNames.BFPType_RuleNameYM,
        name: "特定年月",
        description: "1999年12月など、特定の年月にだけ発生するルール",
    }
];

export type VMRule = {
    sortorder: number;
    name: string;
    amount: number;
    presetruleid: string | null;
    conditions: NonNullable<types.BFPRules>;
}
export type VMRules = VMRule[];

export type BFPRuleOptions = {
    // type: types.BFPType_RuleNames;
    fromYM?: types.BFPType_YearMonth;
    toYM?: types.BFPType_YearMonth;
    not?: NonNullable<types.BFPType_Not>;
    months?: NonNullable<types.BFPType_Month[]>;
    step?: NonNullable<types.BFPType_Step>;
    yearmonths?: NonNullable<types.BFPType_YearMonth[]>;
}

export type VMCategory = {
    sortorder: number;
    name: string;
    presetcategoryid: string | null;
    rules: NonNullable<VMRules>;
};
export type VMCategories = VMCategory[];

export type VMKlass = {
    sortorder: number;
    name: string;
    presetklassid: string | null;
    categories: NonNullable<VMCategories>;
};
export type VMKlasses = VMKlass[];

/*
    SummaryCaches
*/

export type VMSummaryCache = {
    yearmonth: NonNullable<types.BFPType_YearMonth>;
    balance: number;
    income: number;
    outgo: number;
};
export type VMSummaryCaches = VMSummaryCache[];

/*
    ViewModel
*/
export type BfpViewModel = {
    accounts: NonNullable<VMAccounts>;
    klasses: NonNullable<VMKlasses>;
    summarycaches: NonNullable<VMSummaryCaches>;
    presetvalues: null;//TODO
} | null;