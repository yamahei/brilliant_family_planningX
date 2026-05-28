

<template>

<div class="modal" :class="{ 'is-active': props.show }">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p v-if="props.title" class="modal-card-title">
                {{ props.title || 'Base Dialog' }}
            </p>
        </header>
        <section class="modal-card-body ">
            <slot></slot>
        </section>
        <footer class="modal-card-foot">
            <div class="buttons is-flex">
                <button v-if="!props.hideCancel" @click="$emit('cancel', false)" class="button">
                    {{  props.cancelText || 'Cancel' }}
                </button>
                <div class="is-flex-grow-1"></div>
                <button @click="$emit('ok', true)" class="button is-success">
                    {{ props.okText || 'OK' }}
                </button>
            </div>
        </footer>
    </div>
</div>


</template>


<style scoped>

footer .buttons {
    width: 100%;
}

</style>



<script setup lang="ts">

const emit = defineEmits(["ok", "cancel"]);
const props = defineProps<{
    show: boolean;
    title?: string;
    okText?: string;
    hideCancel?: boolean;
    cancelText?: string;
}>();

</script>
