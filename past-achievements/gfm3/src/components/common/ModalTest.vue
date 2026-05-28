

<template>

<div class="modal" :class="{ 'is-active': isshow }">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">
                Promiseでモーダル制御のテスト
            </p>
        </header>
        <section class="modal-card-body ">
            <!-- <slot></slot> -->
            <p v-if="props.message">{{ props.message }}</p>
            <p v-else>TEST</p>
        </section>
        <footer class="modal-card-foot">
            <div class="buttons is-flex">
                <button @click="$emit('cancel', false)" class="button">
                    {{  'Cancel' }}
                </button>
                <div class="is-flex-grow-1"></div>
                <button @click="$emit('ok', true)" class="button is-success">
                    {{ 'OK' }}
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
import { ref } from 'vue';


const emit = defineEmits(["ok", "cancel"]);
const props = defineProps<{
    message?: string;
}>();

const isshow = ref(true);
const toggle = () => {
  isshow.value = !isshow.value;
}

const expose = defineExpose({
  toggle
});

</script>
