<template>

    <article class="media is-clickable" @click="$router.push(`/rules/${props.klass_id}/${props.category_id}/${props.rule_id}`)">
        <figure class="media-left">
            <p><br/></p>
        </figure><!--media-left-->
        <div class="media-content">
            <div class="content">
                <div class="">
                    <!-- 💰お小遣い -->
                     {{ props.rule.name }}
                </div>
                <div class="">
                    <span class="tag">TODO</span>
                    rule description text
                    <!-- 毎月 123,456 円 -->
                </div>
            </div><!--content-->
        </div><!--media-content-->
        <div class="media-right">
            <div class="icon">
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div><!--media-right-->
    </article>



</template>

<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    klass_id:number;
    category_id:number;
    rule_id:number;
    rule: vm.VMRule;
}>();


/*
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    klass_id:number;
    category_id:number;
    category: vm.VMCategory;
}>();
const emit = defineEmits(["change"]);


// @ts-ignore TODO: fix alias settings
import ModalPrompt from '@/components/common/ModalPrompt.vue';
import { ref } from "vue";
const isGroupPromptShow = ref(false);
const modalGroupPrompt = {
    isshow: ref(isGroupPromptShow),
    show: () => {
        modalGroupPrompt.isshow.value = true;
    },
    close: (e:string) => {
        modalGroupPrompt.isshow.value = false;
        if(e){
            const new_category_name = e.toString().trim();
            const category = props.category;
            const category_index = props.category_id;
            emit("change", {category_index, category, new_category_name});
        }
    }
};
*/
</script>