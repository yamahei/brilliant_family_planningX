<template>

<div class="columns is-multiline">
    <div class="column is-full">

        <div class="box">
            <p class="has-text-centered">今月の収支予測</p>
            <p v-if="props.summarycache" class="title is-2 is-size-3-mobile has-text-weight-bold is-italic is-flex is-flex-wrap-nowrap">
                <span class="is-flex-grow-1 has-text-right">
                    <i class="fa-solid fa-yen-sign"></i>
                </span>
                <span class="is-flex-shrink-0">123,456</span>
                <span class="icon is-flex-grow-1 is-justify-content-right">
                    <i class="fa-solid fa-chevron-right"></i>
                </span>
            </p>
            <p v-else class="title is-2 is-size-3-mobile has-text-weight-bold is-italic is-flex is-flex-wrap-nowrap">
                <span class="is-flex-grow-1 has-text-right has-text-grey-light">
                    🤷収支データがありません
                </span>
                <span class="icon is-flex-grow-1 is-justify-content-right">
                    <i class="fa-solid fa-chevron-right"></i>
                </span>
            </p>
        </div>
    </div>

    <div v-if="props.summarycache" class="column is-half">
        <div class="box">
            <p class="subtitle is-flex is-flex-wrap-nowrap">
                <span class="is-flex-grow-1">
                    <span class="tag">💰収入</span>
                </span>
                <span class="is-flex-shrink-0">+123,456</span>
            </p>
        </div>
    </div>

    <div v-if="props.summarycache" class="column is-half">
        <div class="box">

            <p class="subtitle is-flex is-flex-wrap-nowrap">
                <span class="is-flex-grow-1">
                    <span class="tag">💸支出</span>
                </span>
                <span class="is-flex-shrink-0">-123,456</span>
            </p>
        </div>
    </div>

</div>


</template>

<script setup lang="ts">

import { defineProps } from 'vue'
// @ts-ignore TODO: fix alias settings
import * as vm from '@/biz/bfpviewmodel';

const props = defineProps<{
    summarycache: vm.VMSummaryCache | null
}>();


</script>

