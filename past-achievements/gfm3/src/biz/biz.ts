import { Storage } from './lib/storage.ts';
import * as vm from './bfpviewmodel.ts';
import * as types from "./lib/bfp/rule/types.ts";


export class Biz {
    private static instance: Biz;
    private storage: Storage = new Storage();
    private data: vm.BfpViewModel = null;

    //=====
    // 制御関連
    //=====

    public static getInstance(): Biz {
        if (!Biz.instance) {
            Biz.instance = new Biz();
        }
        return Biz.instance;
    }

    private constructor() {
        this.storage = new Storage();
        this.load().then((data: vm.BfpViewModel) => {
            this.data = data;
        });
    }

    private load(): Promise<vm.BfpViewModel> {
        return this.storage.get().then((data: vm.BfpViewModel) => {
            this.data = data;
            return new Promise((resolve) => {
                resolve(data);
            });
        });
    }

    public clear(): Promise<void> {
        this.data = null;
        return this.storage.clear().then(/* do nothing */);
    }

    public save(new_data: vm.BfpViewModel): Promise<void> {
        return this.storage.save(new_data).then(() => {
            this.data = new_data;
        });
    }

    private getUniqueId(): string {
        const radix = 36;
        const func = (n:number)=>{ return n.toString(radix); };
        const pre = Math.floor(Math.random() * radix);
        const timestamp = +new Date();
        const id = `${func(pre)}${func(timestamp)}`;
        return id;
    }

    //=====
    // 業務関連
    //=====

    public getData(): vm.BfpViewModel {
        return this.data;
    }

    public getThisMonth(): types.BFPType_Month {
        const now = new Date();
        return (now.getMonth() + 1) as types.BFPType_Month;
    }
    public getThisYearMonth(): types.BFPType_YearMonth {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1 as types.BFPType_Month,
        };
    }

    public getSummaryInThisMonth(yearMonth:types.BFPType_YearMonth): vm.VMSummaryCache | null {
        if(!this.data){
            throw new Error("data is not loaded.");
        }
        const summary = this.data.summarycaches.find((s) => {
            return s.yearmonth.year === yearMonth.year && s.yearmonth.month === yearMonth.month;
        });
        return summary ?? null;
    }

    public getKlassById(klass_id:number): vm.VMKlass | null {
        if([klass_id].some(n => isNaN(n) || n === null)){
            throw new Error("Invalid class id parameters.");
        }
        return this.data?.klasses[klass_id] ?? null;
    }

    public getCategoryById(klass_id:number, category_id:number): vm.VMCategory | null {
        if([klass_id, category_id].some(n => isNaN(n) || n === null)){
            throw new Error("Invalid category id parameters.");
        }
        const klass:(vm.VMKlass | null) = this.getKlassById(klass_id);
        return klass?.categories[category_id] ?? null;
    }

    public getRuleById(klass_id:number, category_id:number, rule_id:number): vm.VMRule | null {
        if([klass_id, category_id, rule_id].some(n => isNaN(n) || n === null)){
            throw new Error("Invalid rule id parameters.");
        }
        const category:(vm.VMCategory | null) = this.getCategoryById(klass_id, category_id);
        return category?.rules[rule_id] ?? null;
    }

    public appendNewKlass(klass_name:string, presetklassid:string): number {
        if(!this.data){
            throw new Error("data is not loaded.");
        }
        const klass: vm.VMKlass = {
            sortorder: this.data.klasses.length,
            name: klass_name,
            presetklassid: presetklassid || null,
            categories: [],
        };
        this.data.klasses.push(klass);
        const new_klass_id = this.data.klasses.length - 1;
        this.save(this.data).then(/* do nothing */);
        return new_klass_id;
    }

    public appendNewCategory(klass_id:number, category_name:string): number {
        if(!this.data){
            throw new Error("data is not loaded.");
        }
        const klass:(vm.VMKlass | null) = this.getKlassById(klass_id);
        if(!klass){
            throw new Error("Invalid class id parameters.");
        }
        const category:vm.VMCategory = {
            sortorder: klass.categories.length,
            name: category_name,
            presetcategoryid: null,
            rules: [],
        };
        klass.categories.push(category);
        const new_group_id = klass.categories.length - 1;
        this.save(this.data).then(/* do nothing */);
        return new_group_id;
    }

    public appendNewRule(klass_id:number, category_id:number, rule_name:string): number {
        if(!this.data){
            throw new Error("data is not loaded.");
        }
        const category:(vm.VMCategory | null) = this.getCategoryById(klass_id, category_id);
        if(!category){
            throw new Error("Invalid category id parameters.");
        }
        const vmrule:vm.VMRule = {
            sortorder: category.rules.length,
            name: rule_name,
            amount: 0,
            presetruleid: null,
            conditions: [],
        };
        category.rules.push(vmrule);
        const new_rule_id = category.rules.length - 1;
        this.save(this.data).then(/* do nothing */);
        return new_rule_id;
    }

    public appendNewCondition(rule:vm.VMRule, condition_type:types.BFPType_RuleNames, option?:vm.BFPRuleOptions):number {
        let condition:types.BFPRuleArg_Any|null = null;
        switch(condition_type){
            case types.BFPConst_RuleNames.BFPType_RuleNameYM:
                condition = {
                    type: condition_type,
                    fromYM: option?.fromYM || null,
                    toYM: option?.toYM || null,
                    not: option?.not || false,
                    yearmonths: option?.yearmonths || [],
                };
                break;
            case types.BFPConst_RuleNames.BFPType_RuleNameSM:
                condition = {
                    type: condition_type,
                    fromYM: option?.fromYM || null,
                    toYM: option?.toYM || null,
                    not: option?.not || false,
                    months: option?.months || [],
                };
                break;
            case types.BFPConst_RuleNames.BFPType_RuleNameSMSY:
                condition = {
                    type: condition_type,
                    fromYM: option?.fromYM || null,
                    toYM: option?.toYM || null,
                    not: option?.not || false,
                    months: option?.months || [],
                    step: option?.step || 1,
                };
                break;
            default:
                throw new Error("Invalid condition type.");
        }
        rule.conditions.push(condition);
        const new_condition_id = rule.conditions.length - 1;
        this.save(this.data).then(/* do nothing */);
        return new_condition_id;
    }

}