<template>

    <!-- Event -->
    <a class="panel-block" @click="edit" style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <span>{{ event.event_namae }}</span>
        </div>
        <div style="margin-right: 1rem;">
            <span>{{ $filters.formatNumber(event.budget, 1) }}</span>
        </div>
    </a>

</template>

<script>
export default {
    props: ["event"],
    methods: {
        edit(){
            this.$emit("event_edit", { event: this.event });
        },
    },
};
</script>
