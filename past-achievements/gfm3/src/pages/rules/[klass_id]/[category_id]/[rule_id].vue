

<template>

<Header :title="`💰収支ルールの詳細`"></Header>


<section class="section">
    <div class="container">
        <div class="columns is-multiline">

            <div class="column is-half">

                <ruleInformationComponent :rule="rule" :klass_id="Number(klass_id)" :category_id="Number(category_id)" :rule_id="Number(rule_id)" class="block sticky-class">
                </ruleInformationComponent>

            </div><!--column-->

            <div class="column is-half">

                <component
                    v-for="(condition, condition_index) in conditions" :key="condition_index"
                    :is="getConditionComponent(condition.type)"
                    :condition_id="Number(condition_index)"
                    :condition="condition"
                ></component>


            </div><!--column-->

        </div><!--columns-->

        <div class="notification" v-if="conditions.length === 0">
            <p>
                収支ルール（条件）がありません。
            </p>
        </div><!--notification-->
        <div class="block">
            <p>
                <button class="button is-primary" @click="modalConditionEdit.show">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-circle-plus"></i>
                        </span>
                        <span>新しい条件</span>
                    </span>
                </button>
            </p>
        </div>
        <ModalConditionEdit :show="isConditionEditShow" :rule="rule" @append="modalConditionEdit.append" @cancel="modalConditionEdit.cancel"></ModalConditionEdit>

    </div><!--container-->
</section>



</template>

<style scoped>
    .sticky-class {
        position: sticky;
        top: 48px;
        z-index: 10;
    }
</style>


<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'
// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz';
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';
// @ts-ignore TODO: fix alias settings
import Header from '@/components/common/Header.vue'
// @ts-ignore TODO: fix alias settings
import ruleInformationComponent from '@/components/pages/rules/ruleInformationComponent.vue';


const route = useRoute('/rules/[klass_id]/[category_id]/[rule_id]');
const klass_id = Number(route.params.klass_id);
const category_id = Number(route.params.category_id);
const rule_id = Number(route.params.rule_id);
console.debug(`klass_id is: ${klass_id}, category_id is: ${category_id}, rule_id is: ${rule_id}`);


const biz:Biz = Biz.getInstance();
const rule:vm.VMRule = biz.getRuleById(klass_id, category_id, rule_id);
const router = useRouter();
if (!rule) {
    console.error(`Rule not found: klass_id=${klass_id}, category_id=${category_id}, rule_id=${rule_id}`);
    router.push('/404');
}
const conditions: vm.BFPRules = rule.conditions;


// @ts-ignore TODO: fix alias settings
import ModalConditionEdit from '@/components/common/ModalConditionEdit.vue';

import { ref } from "vue";
const isConditionEditShow = ref(false);
const modalConditionEdit = {
    isshow: ref(isConditionEditShow),
    show: () => {
        modalConditionEdit.isshow.value = true;
    },
    append: (new_condition_id:string) => {
        modalConditionEdit.isshow.value = false;
        if(new_condition_id){
            console.log("new_condition_id", new_condition_id);
        }
    },
    cancel: () => {
        modalConditionEdit.isshow.value = false;
    }
};

// @ts-ignore TODO: fix alias settings
import * as types from "@/biz/lib/bfp/rule/types.ts";
// @ts-ignore TODO: fix alias settings
import conditionSomeMonthComponent from '@/components/pages/rules/conditionSomeMonthComponent.vue';
// @ts-ignore TODO: fix alias settings
import conditionSomeMonthStepYearComponent from '@/components/pages/rules/conditionSomeMonthStepYearComponent.vue';
// @ts-ignore TODO: fix alias settings
import conditionYearMonthsComponent from '@/components/pages/rules/conditionYearMonthsComponent.vue';


const getConditionComponent = (type:types.BFPType_RuleNames) => {
  switch (type) {
    case types.BFPConst_RuleNames.BFPType_RuleNameYM:
        return conditionYearMonthsComponent;
    case types.BFPConst_RuleNames.BFPType_RuleNameSM:
        return conditionSomeMonthComponent;
    case types.BFPConst_RuleNames.BFPType_RuleNameSMSY:
        return conditionSomeMonthStepYearComponent;
    default:
        throw new Error(`Unknown condition type: ${type}`);
  }
};





</script>
