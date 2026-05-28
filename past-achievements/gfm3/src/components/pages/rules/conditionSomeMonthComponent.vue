<template>

<div class="box">

    <div class="block">
        <p>conditionSomeMonthComponent</p>
        name: "指定月",
        description: "毎年 4月と10月など、指定した月に毎年発生するルール",

    </div><!--block-->

</div>

</template>

<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz';
// const biz:Biz = Biz.getInstance();


// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    condition: vm.VMRule;
    condition_id: number;
}>();
console.debug("props", props);
const emit = defineEmits(["change"]);


</script>