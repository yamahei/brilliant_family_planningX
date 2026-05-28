<template>


<nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
        accounts
    </a>
    </div>
</nav>


<section class="section">
    <div class="container">
        <div class="columns is-multiline">

            <div class="column">
                <div class="box">
                    <p class="title is-4 is-flex is-flex-wrap-nowrap">
                        <span class="is-flex-grow-1">💰収支</span>
                        <span class="is-flex-shrink-0">
                            <span class="icon">
                                <i class="fa-solid fa-chevron-right"></i>
                                <!-- <i class="fa-solid fa-sliders"></i> -->
                            </span>
                        </span>
                    </p>

                    <div class="notification">
                        <p>収支ルールがありません</p>
                    </div>

                    <!--
                        TODO：menu で良いかも？
                        https://bulma.io/documentation/components/menu/
                     -->
                    <div class="list has-visible-pointer-controls" v-for="key in [1,2,3]" :key="key">

                        <div class="list-item">
                            <div class="list-item-image">
                                <p class="title is-5">👦</p>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title">お父さん</div>
                            </div>
                            <div class="list-item-controls">
                                <span>123,456</span>
                            </div>
                        </div>
                        <div class="list-item" v-for="key in [1,2,3]" :key="key">
                            <div class="list-item-image">
                                <p class="title is-5"></p>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-description">📱List item description</div>
                            </div>
                            <div class="list-item-controls">
                                <span>123,456</span>
                            </div>
                        </div>

                    </div><!--list-->

                </div><!--box-->
            </div><!--column-->

        </div><!--columns-->
    </div>
</section>


</template>

