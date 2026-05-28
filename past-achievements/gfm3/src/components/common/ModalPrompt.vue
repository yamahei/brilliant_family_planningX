

<template>

<ModalBase :show="props.show" :title="props.title ?? 'Confirm'" @ok="onOk" @cancel="onCancel">
    <p v-if="props.message">{{ props.message }}</p>
    <div class="field">
        <div class="control">
            <input class="input" :type="props.type ?? 'text'" :placeholder="props.placeholder ?? ''"  v-model="text" />
        </div>
    </div>
</ModalBase>

</template>


<style scoped>

/* overscroll-behavior: none; */

</style>



<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import ModalBase from '@/components/common/ModalBase.vue';
import { ref } from 'vue';

const emit = defineEmits(["ok", "cancel"]);
const props = defineProps<{
    show: boolean;
    title?: string;
    message?: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string;
}>();

const text = ref(props.defaultValue ?? "");
const onOk = () => {
    if (text.value.trim() !== "") {
        emit("ok", text.value);
    }
};
const onCancel = () => {
    emit("cancel", null);
};


</script>
