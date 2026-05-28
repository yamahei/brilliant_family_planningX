<template>

<div>
    <!-- <p class="title is-3 is-flex is-flex-wrap-nowrap">
        <span class="is-flex-grow-1 has-text-centered">
            {{ props.rule.name }}
            <div class="field">
            <label class="label">Name</label>
            <div class="control">
                <input class="input" type="text" placeholder="Text input">
            </div>
            </div>
        </span>
        <span class="is-flex-shrink-0">
            <button class="button is-white">
            <button class="button is-white" @click="modalRuleEdit.show">
                <span class="icon-text">
                    <span class="icon">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </span>
                </span>
            </button>
        </span>
    </p> -->
    <div class="field">
        <div class="control">
            <input class="input is-medium" type="text" v-model="rule_name" @change="onChangeRule" />
        </div>
    </div>


    <!-- <ModalKlassEdit :show="isRuleEditShow" :rule="props.rule" :rule_id="props.rule_id" @change="modalRuleEdit.change" @cancel="modalRuleEdit.cancel"></ModalKlassEdit> -->

</div><!--block-->

</template>

<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz';
const biz:Biz = Biz.getInstance();


// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    rule: vm.VMRule;
    rule_id: number;
    category_id: number;
    klass_id: number;
}>();
console.debug("props", props);
const emit = defineEmits(["change"]);


// @ts-ignore TODO: fix alias settings
// import ModalRuleEdit from '@/components/common/ModalRuleEdit.vue';
// import { ref } from "vue";
// const isRuleEditShow = ref(false);
// const modalRuleEdit = {
//     isshow: ref(isRuleEditShow),
//     show: () => {
//         modalRuleEdit.isshow.value = true;
//     },
//     change: (klass_id:number) => {
//         modalRuleEdit.isshow.value = false;
//         console.log("klass_id", klass_id);
//     },
//     cancel: () => {
//         modalRuleEdit.isshow.value = false;
//     }
// };



import { ref } from 'vue';

const rule_name = ref(props.rule.name ?? "");

const onChangeRule = () => {
    console.debug("onChangeRule", rule_name.value);
    props.rule.name = rule_name.value;
    biz.save(biz.getData());
    emit("change", props.rule_id);
};



</script>