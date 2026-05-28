<template>

<section class="section">
    <div class="container">

        <section>
            <p class="title">Data</p>
            <textarea class="textarea" v-model="json"></textarea>
            <button class="button" @click="biz.clear">Clear</button>
        </section>

        <section>
            <p class="title">Page</p>
            <ul>
                <li>
                    <RouterLink to="/summary" class="has-text-link">📈summary</RouterLink>
                </li>
            </ul>
        </section>

        <section>
            <p class="title">Component test</p>
            <HogeComponent text="hoge hoge ho--"></HogeComponent>
        </section>

        <section>
            <p class="title">Modal</p>

            <ModalBase :show="isBaseShow" @ok="modalBase.close" @cancel="modalBase.close">
                <p>it's a ModalBase component!</p>
            </ModalBase>
            <button class="button" @click="modalBase.show">Base</button>

            <ModalAlert :show="isAlertShow" :title="'title'" :message="'This is an alert message'" @ok="modalAlert.close"></ModalAlert>
            <button class="button" @click="modalAlert.show">Alert</button>

            <ModalConfirm :show="isConfirmShow" :title="'title'" :message="'This is an confirm message'" @ok="modalConfirm.close" @cancel="modalConfirm.close"></ModalConfirm>
            <button class="button" @click="modalConfirm.show">Confirm</button>

            <ModalPrompt :show="isPromptShow" :title="'title'" :type="'date'" :defaultValue="'1999-12-31'" :message="'This is an prompt message'" @ok="modalPrompt.close" @cancel="modalPrompt.close"></ModalPrompt>
            <button class="button" @click="modalPrompt.show">Prompt</button>

        </section>

    </div>
</section>




</template>


<script setup lang="ts">
import { Biz } from '../biz/biz';

// @ts-ignore TODO: fix alias settings
import HogeComponent from "@/components/pages/index/hogeComponent.vue"

import { ref } from 'vue';

// @ts-ignore TODO: fix alias settings
import ModalBase from '@/components/common/ModalBase.vue';
const isBaseShow = ref(false);
const modalBase = {
    isshow: ref(isBaseShow),
    show: () => {
        modalBase.isshow.value = true;
        console.log('ModalBase Show clicked');
    },
    close: (e:boolean) => {
        console.log(`ModalBase closed: ${e}`);
        modalBase.isshow.value = false;
    }

};

// @ts-ignore TODO: fix alias settings
import ModalAlert from '@/components/common/ModalAlert.vue';
const isAlertShow = ref(false);
const modalAlert = {
    isshow: ref(isAlertShow),
    show: () => {
        modalAlert.isshow.value = true;
        console.log('ModalAlert Show clicked');
    },
    close: (e:boolean) => {
        console.log(`ModalAlert closed: ${e}`);
        modalAlert.isshow.value = false;
    }
};

// @ts-ignore TODO: fix alias settings
import ModalConfirm from '@/components/common/ModalConfirm.vue';
const isConfirmShow = ref(false);
const modalConfirm = {
    isshow: ref(isConfirmShow),
    show: () => {
        modalConfirm.isshow.value = true;
        console.log('ModalConfirm Show clicked');
    },
    close: (e:boolean) => {
        console.log(`ModalConfirm closed: ${e}`);
        modalConfirm.isshow.value = false;
    }
};

// @ts-ignore TODO: fix alias settings
import ModalPrompt from '@/components/common/ModalPrompt.vue';
const isPromptShow = ref(false);
const modalPrompt = {
    isshow: ref(isPromptShow),
    show: () => {
        modalPrompt.isshow.value = true;
        console.log('ModalPrompt Show clicked');
    },
    close: (e:string) => {
        console.log(`ModalPrompt closed: ${e?.toString()}`);
        console.debug(e);
        modalPrompt.isshow.value = false;
    }
};

const biz:Biz = Biz.getInstance();
const data = biz.getData();
const json = JSON.stringify(data, null, 2);



</script>

