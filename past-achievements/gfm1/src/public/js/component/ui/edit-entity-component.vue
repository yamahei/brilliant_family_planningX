<template>

    <div :class="{'modal': true, 'bfp-fluid': false, 'is-active': true}">

        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <div class="modal-card-title">
                    要素 {{ entity.entity_namae }} の{{ is_edit ? "編集" : "追加" }}
                </div>
                <button @click="close" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">

                <div class="field">
                    <label class="label">要素名</label>
                    <div class="control">
                        <input type="text"
                            :class="{'input': true, 'is-danger': !entity_namae_is_valid}"
                            v-model="entity.entity_namae" @change="validate"
                        />
                    </div>
                </div>

                <div class="field">
                    <label class="label">有効期間</label>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input type="month"
                            :class="{'input': true, 'is-danger': !entity_fromto_is_valid}"
                            v-model="entity.entity_from" @change="validate"
                        />
                    </div>
                    <div class="control">
                        <label>～</label>
                    </div>
                    <div class="control">
                        <input type="month"
                            :class="{'input': true, 'is-danger': !entity_fromto_is_valid}"
                            v-model="entity.entity_to" @change="validate"
                        />
                    </div>
                </div>


                <div v-if="is_edit" class="field">
                    <div class="control" style="text-align: center;">
                        <button class="button is-danger" @click="remove">
                            要素 {{ entity.entity_namae }} を削除する
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
export default {
    props: ["entity"],
    data(){
        return {
            valid: true,
            entity_namae_is_valid: true,
            entity_fromto_is_valid: true,
        };
    },
    computed: {
        is_edit(){ return !!this.entity?.id; },
    },
    methods: {
        mounted(){ this.validate(); },
        ok(){
            this.validate();
            if(this.valid){
                const event = this.is_edit ? "entity_update" : "entity_insert";
                this.$emit(event, { entity: this.entity });
            }
        },
        close(){
            this.$emit("entity_close", null);
        },
        remove(){
            const message = [
                `要素 ${this.entity.entity_namae} を削除しますか？`,
                `配下のイベントも削除されます。`,
                `【注意】この操作は取り消せません！`
            ].join("\n");
            if(confirm(message)){
                this.$emit("entity_remove", { entity: this.entity });
            }
        },
        validate(){
            this.entity_namae_is_valid = true;
            this.entity_fromto_is_valid = true;

            if(!this.entity.entity_namae){
                this.entity_namae_is_valid = false;
            }
            if(this.entity.entity_from && this.entity.entity_to){
                if(this.entity.entity_from > this.entity.entity_to){
                    this.entity_fromto_is_valid = false;
                }
            }
            //pass
            this.valid = this.entity_namae_is_valid && this.entity_fromto_is_valid;
        },
    },
};
</script>
