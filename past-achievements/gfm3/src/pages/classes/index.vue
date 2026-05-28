
<template>

<Header title="💰収支ルールの一覧"></Header>


<section class="section">

    <div class="container">

        <div v-if="klasses.length > 0" class="columns is-multiline">

            <div v-for="(klass, klass_id) in klasses" :key="klass_id" class="column is-full-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
                <div class="block">
                    <div class="box is-clickable" @click="$router.push(`/classes/${klass_id}`)">

                        <p class="title is-4 is-flex is-flex-wrap-nowrap">
                            <span class="is-flex-grow-1">{{ klass.name }}</span>
                            <span class="is-flex-shrink-0">
                                <span class="icon">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </span>
                            </span>
                        </p>

                    </div>

                </div><!--block-->
            </div><!--column-->

        </div><!--columns-->

        <div v-else class="notification">
            <p>
                収支ルール（登場人物）がありません。
            </p>
        </div><!--notification-->
        <div class="block">
            <p>
                <button class="button is-primary" @click="modalKlassEdit.show">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-circle-plus"></i>
                        </span>
                        <span>新しい登場人物</span>
                    </span>
                </button>
            </p>
        </div><!--notification-->

    </div>
    <ModalKlassEdit :show="isKlassEditShow" :klass="null" :klass_id="null" @append="modalKlassEdit.append" @cancel="modalKlassEdit.cancel"></ModalKlassEdit>

</section>

</template>


<style scoped>
</style>



<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz.ts';
// @ts-ignore TODO: fix alias settings
import Header from '@/components/common/Header.vue';
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel.ts';

const biz:Biz = Biz.getInstance();
const data:vm.BfpViewModel = biz.getData();
const klasses:vm.VMKlasses = data.klasses;


// @ts-ignore TODO: fix alias settings
import ModalKlassEdit from '@/components/common/ModalKlassEdit.vue';
import { ref } from "vue";
const isKlassEditShow = ref(false);
const modalKlassEdit = {
    isshow: ref(isKlassEditShow),
    show: () => {
        modalKlassEdit.isshow.value = true;
    },
    append: (new_klass_id:number) => {
        modalKlassEdit.isshow.value = false;
        if(new_klass_id){
            router.push(`/classes/${new_klass_id}`);
        }
    },
    cancel: () => {
        modalKlassEdit.isshow.value = false;
    }
};


</script>

