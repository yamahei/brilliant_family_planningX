<template>

<div class="box">

    <div class="block">

        <conditionDeleteComponent :condition_id="props.condition_id" @delete="onDeleteCondition"></conditionDeleteComponent>


        <div class="field is-horizontal">
            <label class="label">{{ note.name }}</label>
            <p class="help">{{ note.description }}</p>
        </div>
        <!---->
        <!---->
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" class="toggle is-primary" />
                    結果を反転する
                </label>
            </div>
        </div>

    </div><!--block-->

</div>

</template>

<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz';
// const biz:Biz = Biz.getInstance();

// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';
// @ts-ignore TODO: fix alias settings
import * as types from "@/biz/lib/bfp/rule/types.ts";

const props = defineProps<{
    condition: vm.VMRule;
    condition_id: number;
}>();
const emit = defineEmits(["change"]);

const type = types.BFPConst_RuleNames.BFPType_RuleNameYM;
const note = vm.VMRuleNotes.find((n:{[key:string]:string}) => n?.type === type);
if(props.condition.type !== type){
    console.debug(props);
    throw new Error('this component is for BFPType_RuleNameYM = "YEARMONTH".');
}


// @ts-ignore TODO: fix alias settings
import conditionDeleteComponent from '@/components/pages/rules/conditionDeleteComponent.vue'

const onDeleteCondition = () => {
    console.log("delete")
}


</script>