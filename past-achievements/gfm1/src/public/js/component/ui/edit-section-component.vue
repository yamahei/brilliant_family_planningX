<template>

    <div :class="{'modal': true, 'bfp-fluid': false, 'is-active': true}">

        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <div class="modal-card-title">
                    項目 {{ section.section_namae }} の編集
                </div>
                <button @click="close" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">

                <div class="field">
                    <label class="label">項目名</label>
                    <div class="control">
                        <input type="text"
                            :class="{'input': true, 'is-danger': !section_namae_is_valid}"
                            v-model="section.section_namae" @change="validate"
                        />
                    </div>
                </div>

                <div class="field">
                    <div class="control" style="text-align: center;">
                        <button class="button is-danger" @click="remove">
                            項目 {{ section.section_namae }} を削除する
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
    props: ["section"],
    data(){
        return {
            valid: true,
            section_namae_is_valid: true,
        };
    },
    methods: {
        mounted(){ this.validate(); },
        ok(){
            this.validate();
            if(this.valid){
                this.$emit("section_update", { section: this.section });
            }
        },
        close(){
            this.$emit("section_close", null);
        },
        remove(){
            const message = [
                `項目 ${this.section.section_namae} を削除しますか？`,
                `配下の要素・イベントも削除されます。`,
                `【注意】この操作は取り消せません！`
            ].join("\n");
            if(confirm(message)){
                this.$emit("section_remove", { section: this.section });
            }
        },
        validate(){
            this.section_namae_is_valid = true;

            if(!this.section.section_namae){
                this.section_namae_is_valid = false;
            }
            //pass
            this.valid = this.section_namae_is_valid;
        },
    },
};
</script>
