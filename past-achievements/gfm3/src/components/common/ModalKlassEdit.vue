

<template>

<ModalBase :show="props.show" :title="`登場人物`" @ok="onOk" @cancel="onCancel">
    <p>
        <span>名前を決めてください</span>
    </p>
    <div class="field">
        <div class="control">
            <input class="input" :type="'text'" :placeholder="klass ? klass.name : ''"  v-model="name" />
        </div>
    </div>
    <div class="field">
        <div class="control">
            <div class="select">
                <select v-model="presetklassid" :disabled="!!klass">
                    <option value="">プリセットを使わない</option>
                </select>
            </div>
        </div>
        <p class="help">
            プリセットを使って、簡単にルールを作成できます
        </p>
    </div>
    <div class="field">
        <div class="control">
            <div class="buttons">
                <button class="button is-danger">
                    TODO: この登場人物を削除する
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
    klass?: vm.VMKlass;
    klass_id?: number;
}>();

const has_klass= !!props.klass;
const has_klass_id = (typeof props.klass_id === 'number');
if(has_klass !== has_klass_id){
    console.debug({klass: props.klass, klass_id: props.klass_id});
    throw new Error("klass & klass_id must be defined or undefined together.");
}

const name = ref(props.klass?.name ?? "");
const presetklassid = ref(props.klass?.presetklassid ?? "");
watch(props, () => {
    name.value = props.klass?.name ?? "";
    presetklassid.value = props.klass?.presetklassid ?? "";
});


const onOk = () => {
    const new_klass_name = name.value.trim();
    const new_presetklassid = presetklassid.value;
    if (new_klass_name) {
        if(props.klass){//edit
            props.klass.name = new_klass_name;
            biz.save(biz.getData());
            emit("change", props.klass_id);
        }else{//append
            const new_klass_id = biz.appendNewKlass(new_klass_name, new_presetklassid);
            emit("append", new_klass_id);
        }
    }
};
const onCancel = () => {
    emit("cancel", null);
};


</script>
