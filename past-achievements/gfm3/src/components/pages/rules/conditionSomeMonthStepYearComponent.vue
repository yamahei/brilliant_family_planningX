<template>

<div class="box">

    <div class="block">
        <p>conditionSomeMonthStepYearComponent</p>
        name: "複雑なルール",
        description: "指定した月に発生するが、x年ごとに発生するルール",

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