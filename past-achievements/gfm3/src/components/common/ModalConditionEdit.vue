

<template>

<ModalBase :show="props.show" :title="'条件'" @ok="onOk" @cancel="onCancel">

    <p>ルールの種類を選んでください</p>
    <div class="field">
        <div class="control">
            <nav class="panel">
                <!-- <label class="radio panel-block">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="types.BFPConst_RuleNames.BFPType_RuleNameSM" v-model="type" />
                    </span>
                    <span class="radio-text">指定月</span>
                    <span class="radio-subtext">
                        毎年 4月と10月など、指定した月に毎年発生するルール
                    </span>
                </label>
                <label class="radio panel-block">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="types.BFPConst_RuleNames.BFPType_RuleNameSMSY" v-model="type" />
                    </span>
                    <span class="radio-text">複雑なルール</span>
                    <span class="radio-subtext">
                        指定した月に発生するが、x年ごとに発生するルール
                    </span>
                </label>
                <label class="radio panel-block">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="types.BFPConst_RuleNames.BFPType_RuleNameYM" v-model="type" />
                    </span>
                    <span class="radio-text">特定年月</span>
                    <span class="radio-subtext">
                        1999年12月など、特定の年月に 1回だけ発生するルール
                    </span>
                </label> -->
                <label class="radio panel-block" v-for="(note, index) in vm.VMRuleNotes" :key="index">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="note.type" v-model="type" />
                    </span>
                    <span class="radio-text">{{ note.name }}</span>
                    <span class="radio-subtext">
                        {{ note.description }}
                    </span>
                </label>

            </nav>

        </div>
    </div>


</ModalBase>

</template>


<style scoped>

/* overscroll-behavior: none; */
.radio-text {
    display: inline-block;
    width: 7em;
}
.radio-subtext {
    display: inline-block;
    padding-left: 0.5em;
    font-size: 0.8em;
    color: #7a7a7a;
}
</style>



<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import * as types from "@/biz/lib/bfp/rule/types.ts";
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';
// @ts-ignore TODO: fix alias settings
import { Biz } from "@/biz/biz";
const biz:Biz = Biz.getInstance();

// @ts-ignore TODO: fix alias settings
import ModalBase from '@/components/common/ModalBase.vue';
import { ref } from 'vue';

const props = defineProps<{
    show: boolean;
    rule?: vm.VMRule;
    defaultTypeValue?: string;
}>();

if(!props.rule){
    throw new Error("props.rule is required");
}

const emit = defineEmits(["append", "change", "cancel"]);

const type = ref(props.defaultTypeValue ?? types.BFPConst_RuleNames.BFPType_RuleNameSM);
const onOk = () => {
    const condition_type = type.value;
    if (props.rule) {
        const condition_id:number = biz.appendNewCondition(props.rule, condition_type);
        emit("append", condition_id);
        type.value = "";
    }
};
const onCancel = () => {
    emit("cancel", null);
};


</script>


