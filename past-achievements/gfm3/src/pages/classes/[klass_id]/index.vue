

<template>

<Header :title="`💰収支ルールの概要`"></Header>


<section class="section">
    <div class="container">
        <div class="columns is-multiline">

            <div class="column is-half">

                <klassInformationComponent :klass="klass" :klass_id="Number(klass_id)" class="block sticky-class">
                </klassInformationComponent>

            </div><!--column-->

            <div class="column is-half">

                <categoryComponent
                    v-for="(category, category_index) in categories"
                    :key="category_index"
                    :klass_id="Number(klass_id)"
                    :category_id="Number(category_index)"
                    :category="category"
                    @change="onChangeCategoryName"
                    @append="onAppendRule"
                >
                </categoryComponent>


            </div><!--column-->

        </div><!--columns-->

        <div class="notification" v-if="categories.length === 0">
            <p>
                収支ルール（グループ）がありません。
            </p>
        </div><!--notification-->
        <div class="block">
            <p>
                <button class="button is-primary" @click="modalCategoryEdit.show">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-circle-plus"></i>
                        </span>
                        <span>新しいグループ</span>
                    </span>
                </button>
            </p>
        </div>
        <ModalCategoryEdit :show="isCategoryEditShow" :klass_id="Number(klass_id)" @append="modalCategoryEdit.append" @cancel="modalCategoryEdit.cancel"></ModalCategoryEdit>

    </div><!--container-->
</section>



</template>

<style scoped>
    .sticky-class {
        position: sticky;
        top: 48px;
        z-index: 10;
    }
</style>


<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'
// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz';
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';
// @ts-ignore TODO: fix alias settings
import Header from '@/components/common/Header.vue'
// @ts-ignore TODO: fix alias settings
import klassInformationComponent from '@/components/pages/klasses/klassInformationComponent.vue';
// @ts-ignore TODO: fix alias settings
import categoryComponent from '@/components/pages/klasses/categoryComponent.vue';


const route = useRoute('/classes/[klass_id]/');
const router = useRouter();

const klass_id = route.params.klass_id;

const biz:Biz = Biz.getInstance();
const klass:vm.VMKlass = biz.getKlassById(klass_id);
if (!klass) {
    console.error(`klass_id(${klass_id}) is not provided in the route parameters.`);
    router.push('/404');
}
const categories: vm.VMCategories = klass.categories;

const onChangeCategoryName = (category_id:string) => {
    console.log("onChangeCategoryName", category_id);
}

const onAppendRule = (e:{category_id:number, new_rule_name:string}) => {
    console.log("onAppendRule", e);
    const new_rule_id = biz.appendNewRule(klass_id, e.category_id, e.new_rule_name);
    biz.save(biz.getData());
    router.push(`/rules/${klass_id}/${e.category_id}/${new_rule_id}`);
}

// @ts-ignore TODO: fix alias settings
import ModalCategoryEdit from '@/components/common/ModalCategoryEdit.vue';

import { ref } from "vue";
const isCategoryEditShow = ref(false);
const modalCategoryEdit = {
    isshow: ref(isCategoryEditShow),
    show: () => {
        modalCategoryEdit.isshow.value = true;
    },
    append: (new_category_id:string) => {
        modalCategoryEdit.isshow.value = false;
        if(new_category_id){
            console.log("new_category_id", new_category_id);
        }
    },
    cancel: () => {
        modalCategoryEdit.isshow.value = false;
    }
};
</script>

