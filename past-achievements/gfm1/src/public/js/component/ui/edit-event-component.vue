<template>

    <div :class="{'modal': true, 'bfp-fluid': false, 'is-active': true}">

        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <div class="modal-card-title">
                    イベント {{ event.event_namae }} の収支ルール
                </div>
                <button @click="close" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">

                <div class="field">
                    <label class="label">イベント名</label>
                    <div class="control">
                        <input type="text"
                            :class="{'input': true, 'is-danger': !event_namae_is_valid}"
                            v-model="event.event_namae" @change="validate"
                        />
                    </div>
                </div>

                <div class="field">
                    <label class="label">収支金額</label>
                </div>
                <div class="field is-grouped">

                    <div class="control has-icons-right" style="margin-top: -10px;">
                        <input type="number" step="0.1"
                            :class="{'input': true, 'is-danger': !budget_is_valid}"
                            v-model="event.budget" @change="validate"
                        />
                        <span class="icon is-medium is-right">万円</span>
                        <p class="help">+: 収入, -: 支出</p>
                    </div>

                    <div class="control">
                        <div class="field has-addons">
                            <div class="control">
                                <a class="button is-static">口座</a>
                            </div>
                            <div :class="{'control': true, 'select': true, 'is-danger': !account_is_valid}">
                                <select v-model="event.account" @change="validate">
                                    <option value=""></option>
                                    <option value="__DEFAULT_ACCOUNT__">Default</option>
                                </select>
                            </div>
                        </div>
                        <p class="help"><br/></p>
                    </div>
                </div>

                <div class="field">
                    <label class="label">有効期間</label>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input type="month"
                            :class="{'input': true, 'is-danger': !event_fromto_is_valid}"
                            v-model="event.event_from" @change="validate"
                        />
                        <p class="help">{{ entity.entity_from }}</p>
                    </div>
                    <div class="control">
                        <label>～</label>
                    </div>
                    <div class="control">
                        <input type="month"
                            :class="{'input': true, 'is-danger': !event_fromto_is_valid}"
                            v-model="event.event_to" @change="validate"
                        />
                        <p class="help">{{ entity.entity_to }}</p>
                    </div>
                </div>

                <div class="field">
                    <label class="label">収支発生のルール</label>
                    <p class="help is-danger" v-if="!expressions_is_valid">
                        1件以上 必要です
                    </p>
                    <p class="help">全てを満たす年月で収支が発生します</p>
                </div>
                <ul>
                    <li class="box" v-for="(expression, index) in event.expressions" :key="expression">
                        <expression-component
                            :expression="expression"
                            :index="index"
                            @validate="expression_validate"
                            @remove="expression_remove(index)"
                        ></expression-component>
                    </li>
                    <li class="box">
                        <div class="field is-grouped">
                            <div class="control select">
                                <select v-model="selection">
                                    <option value=""></option>
                                    <option value="every">毎年 - 指定月に発生</option>
                                    <option value="single">年月 - 1回きり発生</option>
                                    <option value="detail">詳細 - 隔年＆指定月に発生</option>
                                </select>
                            </div>
                            <div class="control" style="flex-grow: 1;"></div>
                            <div class="control">
                                <button class="button" @click="expression_append">ルールを追加</button>
                            </div>
                        </div>
                    </li>
                </ul>

                <div v-if="is_edit" class="field">
                    <div class="control" style="text-align: center;">
                        <button class="button is-danger" @click="remove">
                            イベント {{ event.event_namae }} を削除する
                        </button>
                    </div>
                </div>

            </section>
            <footer class="modal-card-foot" style="align-items: center; justify-content: space-between;">
                <div>
                    <button @click="close" class="button">
                        Cancel
                    </button>
                </div>
                <div>
                    <button @click="ok" :class="{'button': true, 'is-primary': valid}" :diabled="!valid" >
                        OK
                    </button>
                </div>
            </footer>
        </div>
    </div>

</template>
<script>
import expressionComponent from './expression-component.vue';
export default {
  components: { expressionComponent },
    props: ["event", "entity"],
    data(){
        return {
            valid: false,
            selection: "",
            expression_valid: new Array(this.event.expressions.length),
            event_namae_is_valid: true,
            budget_is_valid: true,
            account_is_valid: true,
            event_fromto_is_valid: true,
            expressions_is_valid: true,
        };
    },
    computed: {
        is_edit(){ return !!this.event?.id; },
    },
    methods: {
        mounted(){
            this.validate();
        },
        ok(){
            this.validate();
            if(this.valid){
                this.$emit("event_upsert", { event: this.event });
            }
        },
        close(){
            this.$emit("event_close", null);
        },
        remove(){
            const message = `イベント ${this.event.event_namae} を削除しますか？\n【注意】この操作は取り消せません！`;
            if(confirm(message)){
                this.$emit("event_remove", { event: this.event });
            }
        },
        validate(){
            let valid = true;
            this.event_namae_is_valid = true;
            this.budget_is_valid = true;
            this.account_is_valid = true;
            this.event_fromto_is_valid = true;
            this.expressions_is_valid = true;

            if(!this.event.event_namae){
                this.event_namae_is_valid = valid = false;
            }
            if(this.event.budget !== 0 && !this.event.budget){
                this.budget_is_valid = valid = false;
            }
            if(!this.event.account){
                this.account_is_valid = valid = false;
            }
            if(this.event.event_from && this.event.event_to){
                if(this.event.event_from > this.event.event_to){
                    this.event_fromto_is_valid = valid = false;
                }
            }
            if(this.expression_valid.some(v=>!v)){
                valid = false;
            }
            if(this.event.expressions.length <= 0){
                this.expressions_is_valid = valid = false;
            }
            //pass
            this.valid = valid;
        },
        expression_append(){
            const proctype = this.selection;
            if(!proctype){ return; }

            const self = this;
            this.$biz.get_new_expression(proctype).then((expression)=>{
                self.event.expressions.push(expression);
                self.selection = "";
            });
        },
        expression_validate(param, index){
            const valid = param.valid
            this.expression_valid[index] = valid;
            this.validate();
        },
        expression_remove(index){
            this.event.expressions.splice(index, 1);
        },
    },
};
</script>
