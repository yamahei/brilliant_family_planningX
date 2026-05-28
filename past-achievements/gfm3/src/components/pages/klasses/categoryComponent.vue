<template>

<div class="box">

    <div class="block">
        <p class="title is-4 is-flex is-flex-wrap-nowrap">
            <span class="is-flex-grow-1">
                {{ props.category.name }}
            </span>
            <span class="is-flex-shrink-0">
                <button class="button is-white" @click="modalCategoryEdit.show">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </span>
                    </span>
                </button>
            </span>
        </p>

        <ruleComponent v-for="(rule, rule_index) in props.category.rules" :klass_id="props.klass_id" :category_id="props.category_id" :rule_id="rule_index" :rule="rule"></ruleComponent>
        <article class="media">
            <div class="media-content">

                <div class="notification" v-if="props.category.rules.length === 0">
                    <p>
                        収支ルール（ルール）がありません。
                    </p>
                </div><!--notification-->
                <div class="block">
                    <p>
                        <button class="button is-primary" @click="onAppendRule">
                        <!-- <button class="button is-primary" @click="modalRulePrompt.show"> -->
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fa-solid fa-circle-plus"></i>
                                </span>
                                <span>新しいルール</span>
                            </span>
                        </button>
                    </p>
                </div>
                <!-- <ModalRule :show="isRulePromptShow" :title="'ルールの追加'" :message="'名前を決めてください。'" @ok="modalRulePrompt.close" @cancel="modalRulePrompt.close"></ModalRule> -->

            </div><!--media-content-->
        </article><!--media-->


    </div><!--block-->

    <ModalCategoryEdit :show="isCategoryEditShow" :category_id="Number(props.category_id)" :category="props.category" @change="modalCategoryEdit.change" @cancel="modalCategoryEdit.cancel"></ModalCategoryEdit>

</div>
</template>

<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    klass_id:number;
    category_id:number;
    category: vm.VMCategory;
}>();
const emit = defineEmits(["change", "append"]);

// @ts-ignore TODO: fix alias settings
import ModalCategoryEdit from '@/components/common/ModalCategoryEdit.vue';
import { ref } from "vue";
const isCategoryEditShow = ref(false);
const modalCategoryEdit = {
    isshow: ref(isCategoryEditShow),
    show: () => {
        modalCategoryEdit.isshow.value = true;
    },
    change: (category_id:number) => {
        modalCategoryEdit.isshow.value = false;
        if(category_id){
            console.log("category_id", category_id);
        }
    },
    cancel: () => {
        modalCategoryEdit.isshow.value = false;
    }
};


// @ts-ignore TODO: fix alias settings
import ruleComponent from '@/components/pages/klasses/ruleComponent.vue';
// @ts-ignore TODO: fix alias settings
// import ModalRule from '@/components/common/ModalRule.vue';

// const isRulePromptShow = ref(false);
// const modalRulePrompt = {
//     isshow: ref(isRulePromptShow),
//     show: () => {
//         modalRulePrompt.isshow.value = true;
//     },
//     close: (e?:string) => {
//         modalRulePrompt.isshow.value = false;
//         if(e){
//             const new_rule_name = e;
//             const category_id = props.category_id;
//             emit("append", {category_id, new_rule_name});
//         }
//     }
// };

const onAppendRule = () => {
    const new_rule_name = "新しいルール";
    const category_id = props.category_id;
    emit("append", { category_id, new_rule_name });
};

</script>