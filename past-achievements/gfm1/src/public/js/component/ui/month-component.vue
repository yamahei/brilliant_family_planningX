<template>
    <div>
        <div class="field is-grouped is-grouped-multiline">
            <div class="control">
                <label>指定月</label>
            </div>
            <div class="control" style="margin-right: 0.5rem;" v-for="month in months" :key="`month${month}`">
                <button style="padding-left: 0.5rem; padding-right: 0.5rem;" @click="toggle(month)"
                :class="{'button': true, 'is-small': true, 'is-primary': status(month), 'is-outlined': !status(month)}">
                    {{ `${month}` }}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {"value": Array},
    data() {
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return { months: months };
    },
    methods: {
        status(month){
            return this.value.indexOf(month) >= 0;
        },
        toggle(month){
            const index = this.value.indexOf(month);
            if(index >= 0){
                this.value.splice(index, 1);
            }else{
                this.value.push(month * 1);
            }
            const new_value = this.value.concat().sort((a, b)=> a-b );
            this.$emit('change', new_value);
        },
    },
};
</script>
