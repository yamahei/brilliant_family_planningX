<template>

<div>
    <!-- every -->
    <div v-if="expression.proctype=='every'">
        <div class="field is-grouped">
            <div class="control">
                <span class="tag is-info">毎年 - 指定月に発生</span>
            </div>
            <div class="control" style="flex-grow: 1;"></div>
            <div class="control">
                <input type="checkbox" class="switch is-small" :id="switch_id('every')" v-model="expression.not"/>
                <label :for="switch_id('every')">結果を反転</label>
            </div>
            <button class="delete" @click="remove" title="削除"></button>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <month-component :value="expression.months" @change="months_change"></month-component>
                <p v-if="!months_is_valid" :class="{'help': true, 'is-danger': !months_is_valid}">
                    月を選択してください
                </p>
            </div>
        </div>
    </div>
    <!-- single -->
    <div v-if="expression.proctype=='single'">
        <div class="field is-grouped">
            <div class="control">
                <span class="tag is-link">年月 - 1回きり発生</span>
            </div>
            <div class="control" style="flex-grow: 1;"></div>
            <div class="control">
                <input type="checkbox" class="switch is-small" :id="switch_id('single')" v-model="expression.not"/>
                <label :for="switch_id('single')">結果を反転</label>
            </div>
            <button class="delete" @click="remove" title="削除"></button>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <input type="month"
                    :class="{'input': true, 'is-danger': !month_is_valid}"
                    v-model="expression.month"
                    @change="validate"
                />
            </div>
        </div>
    </div>
    <!-- detail -->
    <div v-if="expression.proctype=='detail'">
        <div class="field is-grouped">
            <div class="control">
                <span class="tag is-warning">詳細 - 隔年＆指定月に発生</span>
            </div>
            <div class="control" style="flex-grow: 1;"></div>
            <div class="control">
                <input type="checkbox" class="switch is-small" :id="switch_id('detail')" v-model="expression.not"/>
                <label :for="switch_id('detail')">結果を反転</label>
            </div>
            <button class="delete" @click="remove" title="削除"></button>
        </div>

        <div class="field is-grouped">
            <div class="control has-icons-right" style="flex-shrink: 1; max-width: 8rem;">
                <input type="number"
                    :class="{'input': true, 'is-danger': !year_is_valid}"
                    v-model="expression.year"
                    @change="validate"
                />
                <span class="icon is-medium is-right">年</span>
            </div>
            <div class="control">
                <p>を基準に</p>
            </div>
            <div class="control has-icons-right" style="flex-shrink: 2; max-width: 6rem;">
                <input type="number"
                    :class="{'input': true, 'is-danger': !step_is_valid}"
                    v-model="expression.step"
                    @change="validate"
                />
                <span class="icon is-medium is-right">年</span>
            </div>
            <div class="control"><p>おき</p></div>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <month-component :value="expression.months" @change="months_change"></month-component>
                <p v-if="!months_is_valid" :class="{'help': true, 'is-danger': !months_is_valid}">
                    月を選択してください
                </p>
            </div>
        </div>
    </div>

</div>

</template>
<script>
export default {
    // {
    //     expression_name: expression_name,//ALL
    //     proctype: single | every | detail,//ALL
    //     not: Boolean,//ALL
    //     month: String, //YYYY-MM //single
    //     months: [1-12],//every, detail
    //     step: Number,//detail
    //     year: Number,//detail
    // }
    props: {expression: Object, index: Number},
    data() {
        return {
            months_is_valid: true,
            month_is_valid: true,
            year_is_valid: true,
            step_is_valid: true,
        };
    },
    mounted(){
        this.validate();
    },
    methods: {
        switch_id(label){
            return `expression${this.index}_${label}`;
        },
        months_change(months){
            this.expression.months.splice(0, this.expression.months.length);
            this.expression.months.push(...months);
            this.validate();
        },
        remove(){
            if(confirm("削除しますか？")){
                this.$emit("remove", this.expression);
            }
        },
        validate: function(){
            let valid = true;
            this.months_is_valid = true;
            this.month_is_valid = true;
            this.year_is_valid = true;
            this.step_is_valid = true;

            if(this.expression.proctype=='every'){
                if(!this.expression.months?.length){
                    this.months_is_valid = valid = false;
                }
            }
            if(this.expression.proctype=='single'){
                if(!this.expression.month){
                    this.month_is_valid = valid = false;
                }
            }
            if(this.expression.proctype=='detail'){
                if(!this.expression.year){
                    this.year_is_valid = valid = false;
                }
                if(!this.expression.step){
                    this.step_is_valid = valid = false;
                }
                if(!this.expression.months?.length){
                    this.months_is_valid = valid = false;
                }
            }
            const param = {
                expression: this.expression,
                index: this.index,
                valid: valid,
            }
            this.$emit("validate", param);
        },
    },
};
</script>
