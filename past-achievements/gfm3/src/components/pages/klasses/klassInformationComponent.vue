<template>

<div>
    <p class="title is-3 is-flex is-flex-wrap-nowrap">
        <span class="is-flex-grow-1 has-text-centered">
            {{ props.klass.name }}
        </span>
        <span class="is-flex-shrink-0">
            <button class="button is-white" @click="modalKlassEdit.show">
                <span class="icon-text">
                    <span class="icon">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </span>
                </span>
            </button>
        </span>
    </p>

    <p class="has-text-centered">
        <span class="tag">プリセット</span>
        <span>大人</span>
    </p>

    <ModalKlassEdit :show="isKlassEditShow" :klass="props.klass" :klass_id="props.klass_id" @change="modalKlassEdit.change" @cancel="modalKlassEdit.cancel"></ModalKlassEdit>

</div><!--block-->

</template>

<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    klass: vm.VMKlasses;
    klass_id: number;
}>();
const emit = defineEmits(["change"]);


// @ts-ignore TODO: fix alias settings
import ModalKlassEdit from '@/components/common/ModalKlassEdit.vue';
import { ref } from "vue";
const isKlassEditShow = ref(false);
const modalKlassEdit = {
    isshow: ref(isKlassEditShow),
    show: () => {
        modalKlassEdit.isshow.value = true;
    },
    change: (klass_id:number) => {
        modalKlassEdit.isshow.value = false;
        console.log("klass_id", klass_id);
    },
    cancel: () => {
        modalKlassEdit.isshow.value = false;
    }
};


</script>