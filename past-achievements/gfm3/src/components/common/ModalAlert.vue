

<template>

<ModalBase :show="props.show" :title="props.title ?? 'Alert'" :hideCancel="true" @ok="$emit('ok', true)">
    <p>{{ props.message }}</p>
</ModalBase>

</template>


<style scoped>

/* overscroll-behavior: none; */

</style>



<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import ModalBase from '@/components/common/ModalBase.vue';

const emit = defineEmits(["ok"]);
const props = defineProps<{
    show: boolean;
    title?: string;
    message: String;
}>();


</script>
