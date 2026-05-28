<template>

<section class="section is-vertical-center">
    <div class="container">

        <p class="error_message">
            <span class="message_token">👨‍👩‍👧‍👦</span>
            <span class="message_token">{{ content.code }}</span>
            <span class="message_token">{{ content.message }}</span>
        </p>

    </div>
</section>

</template>


<style scoped>
section.is-vertical-center{
    min-height: 100vh;
    display: grid;
    place-items: center;
}

p.error_message {
    font-size: 3rem;
    text-align: center;
}
span.message_token {
    display: inline-block;
    margin: 0 0.5rem;
}

</style>


<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const path = router.currentRoute.value.path;
console.log(`Path not found: ${path}`);

const content500 = { path: "/500", code:500, message: "Internal Server Error" };
const content404 = { path: "/404", code:404, message: "Not Found" };
const contents = [content500, content404];
const content = contents.find(c => c.path === path) || content404;

</script>