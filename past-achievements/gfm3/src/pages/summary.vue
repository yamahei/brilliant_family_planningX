
<template>

<section class="hero is-medium is-primary">
    <div class="hero-body">

        <BalanceComponent :summarycache="summarycache" />

    </div><!--hero-body-->
</section><!--hero-->

<section class="section">
    <div class="container">
        <div class="columns is-multiline">

            <div class="column is-half">
                <div class="block">
                    <div class="box is-clickable" @click="$router.push('/classes')">
                        <p class="title is-4 is-flex is-flex-wrap-nowrap">
                            <span class="is-flex-grow-1">💰収支ルール</span>
                            <span class="is-flex-shrink-0">
                                <span class="icon">
                                    <i class="fa-solid fa-chevron-right"></i>
                                    <!-- <i class="fa-solid fa-sliders"></i> -->
                                </span>
                            </span>
                        </p>

                        <div v-if="has_klass===false" class="notification">
                            <p>収支ルールがありません</p>
                        </div>

                    </div>

                </div><!--block-->
            </div><!--column-->

            <div class="column is-half">
                <div class="block">
                    <div class="box is-clickable" @click="$router.push('/accounts')">

                        <p class="title is-4 is-flex is-flex-wrap-nowrap">
                            <span class="is-flex-grow-1">💳口座</span>
                            <span class="is-flex-shrink-0">

                                    <span class="icon">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </span>

                                <RouterLink to="/accounts" class="has-text-link">
                                </RouterLink>
                            </span>
                        </p>

                        <div v-if="has_account===false" class="notification">
                            <p>口座がありません</p>
                        </div>
                    </div>

                </div><!--box-->
            </div><!--column-->

        </div><!--columns-->
    </div>
</section>


</template>




<script setup lang="ts">

// @ts-ignore TODO: fix alias settings
import { Biz } from '@/biz/biz';
// import { Biz } from '../biz/biz';
// @ts-ignore TODO: fix alias settings
import BalanceComponent from '@/components/pages/summary/balanceComponent.vue'

const biz:Biz = Biz.getInstance();
const summarycache = biz.getSummaryInThisMonth(biz.getThisYearMonth());
const data = biz.getData();
const has_account = (data?.accounts?.length ?? 0) ? true : false;
const has_klass = (data?.klasses?.length ?? 0) ? true : false;
</script>
