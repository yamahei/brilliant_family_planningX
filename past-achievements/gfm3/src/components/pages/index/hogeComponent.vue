<template>

<p>
    It's a child component!<br/>
    Text: {{ props.text }}
</p>

</template>

<script setup lang="ts">
const props = defineProps<{
    text: string;
}>();
</script>