
<template>

    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">

            <div class="navbar-item title is-4 is-flex is-flex-wrap-nowrap">

                <div class="is-flex-shrink-0 is-clickable" @click="$router.go(-1)">
                    <span class="icon">
                        <i class="fa-solid fa-chevron-left"></i>
                    </span>
                </div>
                <div class="is-flex-grow-1 is-justify-content-center">{{ props.title }}</div>

            </div>

        </div>
    </nav>

</template>

<script setup lang="ts">

const props = defineProps<{
    title: string
}>();

</script>


