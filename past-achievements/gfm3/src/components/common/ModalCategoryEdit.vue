

<template>

<ModalBase :show="props.show" :title="`グループ`" @ok="onOk" @cancel="onCancel">
    <p>名前を決めてください</p>
    <div class="field">
        <div class="control">
            <input class="input" :type="'text'" :placeholder="category ? category.name : ''"  v-model="name" />
        </div>
    </div>
    <div class="field">
        <div class="control">
            <div class="buttons">
                <button class="button is-danger">
                    TODO: このグループを削除する
                </button>
            </div>
        </div>
        <p class="help">
            削除すると、配下のルールも削除されます。<br/>
            この操作は取り消せませんので、注意してください。
        </p>
    </div>


</ModalBase>

</template>


<style scoped>

/* overscroll-behavior: none; */
.select, .select select {
    width: 100%;
}

</style>



<script setup lang="ts">
// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz.ts';
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel.ts';
const biz:Biz = Biz.getInstance();

// @ts-ignore TODO: fix alias settings
import ModalBase from '@/components/common/ModalBase.vue';
import { ref, watch } from 'vue';

const emit = defineEmits(["change", "append", "cancel"]);
const props = defineProps<{
    show: boolean;
    category?: vm.VMCategory;
    category_id?: number;
    klass_id?:number;
}>();

const has_category= !!props.category;
const has_category_id = (typeof props.category_id === 'number');
const has_klass_id = (typeof props.klass_id === 'number');
if(has_category !== has_category_id){
    console.debug({category: props.category, category_id: props.category_id});
    throw new Error("category and category_id must be both defined or both undefined.");
}
if(!has_category_id && !has_klass_id){
    throw new Error("klass_id must be defined when category is not defined.");
}

const name = ref(props.category?.name ?? "");
watch(props, () => {
    name.value = props.category?.name ?? "";
});

const onOk = () => {
    const new_category_name = name.value.trim();
    if (new_category_name) {
        if(props.category){//edit
            props.category.name = new_category_name;
            biz.save(biz.getData());
            emit("change", props.category_id);
        }else{//append
            const new_category_id = biz.appendNewCategory(props.klass_id, new_category_name);
            emit("append", new_category_id);
        }
    }
};
const onCancel = () => {
    emit("cancel", null);
};


</script>
