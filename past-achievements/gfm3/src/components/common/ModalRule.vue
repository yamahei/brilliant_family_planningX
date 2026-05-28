

<template>

<ModalBase :show="props.show" :title="props.title ?? 'Confirm'" @ok="onOk" @cancel="onCancel">
    <p v-if="props.message">{{ props.message }}</p>
    <div class="field">
        <div class="control">
            <input class="input" :type="props.type ?? 'text'" :placeholder="props.placeholder ?? ''"  v-model="text" />
        </div>
    </div>

    <!-- <p>ルールの種類を選んでください</p>
    <div class="field">
        <div class="control">
            <nav class="panel">
                <label class="radio panel-block">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="types.BFPConst_RuleNames.BFPType_RuleNameSM" v-model="type" />
                    </span>
                    <span class="radio-text">指定月</span>
                    <span class="radio-subtext">
                        毎年 4月と10月など、指定した月に毎年発生するルール
                    </span>
                </label>
                <label class="radio panel-block">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="types.BFPConst_RuleNames.BFPType_RuleNameSMSY" v-model="type" />
                    </span>
                    <span class="radio-text">複雑なルール</span>
                    <span class="radio-subtext">
                        指定した月に発生するが、x年ごとに発生するルール
                    </span>
                </label>
                <label class="radio panel-block">
                    <span class="panel-icon">
                        <input type="radio" name="type" :value="types.BFPConst_RuleNames.BFPType_RuleNameYM" v-model="type" />
                    </span>
                    <span class="radio-text">特定年月</span>
                    <span class="radio-subtext">
                        1999年12月など、特定の年月に 1回だけ発生するルール
                    </span>
                </label>

            </nav>

        </div>
    </div> -->


</ModalBase>

</template>


<style scoped>

/* overscroll-behavior: none; */
.radio-text {
    display: inline-block;
    width: 7em;
}
.radio-subtext {
    display: inline-block;
    padding-left: 0.5em;
    font-size: 0.8em;
    color: #7a7a7a;
}
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
    defaultNameValue?: string;
}>();

// @ts-ignore TODO: fix alias settings
const text = ref(props.defaultNameValue ?? "");
const onOk = () => {
    const rule_name = text.value.trim();
    if (text.value.trim() !== "") {
        emit("ok", rule_name);
        text.value = "";
    }
};
const onCancel = () => {
    emit("cancel", null);
};


</script>


