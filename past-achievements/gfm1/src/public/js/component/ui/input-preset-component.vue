<template>

    <div :class="{'modal': true, 'bfp-fluid': false, 'is-active': true}">

        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <div class="modal-card-title">
                    項目 {{ select_preset_namae }} の追加
                </div>
                <button @click="close" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body" v-if="!selected_preset_key">

                <div class="field">
                    <label class="label">項目</label>
                    <div class="control select">
                        <select v-model="select_preset_key">
                            <option
                                v-for="preset in presets"
                                :key="preset.preset_key"
                                :value="preset.preset_key"
                            >
                                {{ preset.preset_namae }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="field">
                    <div class="control" style="text-align: center;">
                        <button class="button is-primary"
                            @click="select"
                            :disabled="!select_preset_key"
                        >
                            項目 {{ select_preset_namae }} を追加する
                        </button>
                    </div>
                </div>

            </section>

            <section class="modal-card-body" v-if="selected_preset_key">

                <div class="field">
                    <label class="label">
                        項目名
                        <input type="text"
                            :class="{'input': true, 'is-danger': section_namae.length <= 0}"
                            v-model="section_namae"
                            @change="validate"
                        />
                    </label>
                </div>

                <div style="align-items: center;"
                    v-for="variable in preset.variables"
                    :key="variable"
                    :variable="variable"
                    :class="{'field': true, 'is-horizontal': true, 'mt-5': variable_is_parent(variable)}"
                >
                    <div class="field-label is-normal">
                        <label style="width: 12rem;"
                            :class="{
                                'label': true,
                                'has-text-weight-light': variable_is_child(variable),
                                'has-text-grey': variable_is_disabled(variable)
                            }">
                            <span>{{ variable.variable_namae }}</span>
                            <span v-if="variable.required" class="has-text-danger">*</span>
                        </label>
                    </div>
                    <div class="field-body">
                        <div class="control">
                            <input type="number"
                                v-if="variable.datatype=='Integer'"
                                :class="{'input': true, 'is-danger': !variable_valid[variable.variable_key]}"
                                v-model="variable_value[variable.variable_key]"
                                @change="variable_change(variable)"
                                :disabled="variable_is_disabled(variable)"
                            />
                            <input type="date"
                                v-if="variable.datatype=='Date'"
                                :class="{'input': true, 'is-danger': !variable_valid[variable.variable_key]}"
                                v-model="variable_value[variable.variable_key]"
                                @change="variable_change(variable)"
                                :disabled="variable_is_disabled(variable)"
                            />
                            <label class="checkbox" v-if="variable.datatype=='Boolean'">
                                <input type="checkbox"
                                    v-model="variable_value[variable.variable_key]"
                                    @change="variable_change(variable)"
                                    :disabled="variable_is_disabled(variable)"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div>

                    <article class="message is-warning">
                        <div class="message-header"><p>注意</p></div>
                        <div class="message-body">
                            項目を追加すると、想定されるイベントと、それにかかる収入/支出が入力されますが、
                            あくまで一般的な内容/金額であり、必ずしもご自身の状況に沿ったものではありません。
                            入力された内容を参考に、ご自身のプランに合う内容に変更してください。
                        </div>
                    </article>
                </div>

            </section>


            <footer class="modal-card-foot" style="align-items: center; justify-content: space-between;">
                <div>
                    <button @click="close" class="button">
                        Cancel
                    </button>
                </div>
                <div>
                    <button
                        :class="{'button': true, 'is-primary': select_preset_key && valid}"
                        @click="ok"
                        :diabled="!select_preset_key || !valid"
                    >
                        OK
                    </button>
                </div>
            </footer>
        </div>
    </div>

</template>
<script>
export default {
    props: ["presets"],
    data(){
        return {
            section_namae: '',
            // entity_from: null,
            // entity_to: null,
            valid: false,
            valiables_is_valid: false,
            // entity_fromto_is_valid: false,
            select_preset_key: null,
            // select_preset_namae: null,//->computed
            selected_preset_key: null,
            selected_preset_namae: null,
            preset: null,
            variable_value: null,
            variable_valid: null,
        };
    },
    computed: {
        select_preset_namae(){
            if(!this.select_preset_key){ return ""; }
            const self = this;
            const select_preset_namae = this.presets.find((preset)=>{
                return preset.preset_key == self.select_preset_key;
            })?.preset_namae || "";
            return select_preset_namae;
        },
    },
    methods: {
        mounted(){
            this.validate();
        },
        ok(){
            this.validate();
            if(this.valid){
                const param = {
                    section_namae: this.section_namae,
                    preset_key: this.selected_preset_key,
                    variables: this.variable_value,
                }
                this.$emit("section_insert", param);
                this.close();
            }
        },
        close(){
            this.select_preset_key = null;
            // select_preset_namae: null,//->computed
            this.selected_preset_key = null;
            this.selected_preset_namae = null;
            this.preset = null;
            this.variable_value = null;
            this.variable_valid = null;
            this.$emit("preset_close", null);
        },
        find_variable(variable_key){
            return this.preset?.variables.find((variable)=>{
                return variable.variable_key == variable_key;
            });
        },
        select(){
            if(!this.select_preset_key){ return; }
            if(!this.select_preset_namae){ return; }
            const self = this;
            const preset = this.presets.find((preset)=>{
                return preset.preset_key == self.select_preset_key;
            });
            if(!preset){ return; }

            this.variable_value = {};
            this.variable_valid = {};
            preset.variables.forEach((variable)=>{
                const name = variable.variable_key;
                const value = variable.default;
                const required = variable.required;
                self.variable_value[name] = value;
                self.variable_valid[name] = required ? !!value : true;
            });
            this.selected_preset_key = this.select_preset_key;
            this.selected_preset_namae = this.select_preset_namae;
            this.section_namae = this.select_preset_namae;
            this.preset = preset;
        },
        variable_is_parent(variable){ return !variable.depends; },
        variable_is_child(variable){ return !!variable.depends; },
        variable_is_disabled(variable){
            if(!variable.depends){ return false; }
            const depends = this.find_variable(variable.depends);
            if(!depends){ return true; }
            const value = this.variable_value[depends.variable_key];
            const non_zero_falsy = (value === null || value === false || value === "");
            return non_zero_falsy;
        },
        variable_change(variable){
            const variable_key = variable.variable_key;
            const value = this.variable_value[variable_key];
            const disabled = this.variable_is_disabled(variable);
            const required = variable.required;
            const type_is_boolean = (variable.datatype=="Boolean");

            let valid = null;
            if(disabled){valid = true;}
            else if(!required){valid = true;}
            else if(type_is_boolean){valid = true;}
            else{
                const non_zero_falsy = (value === null || value === false || value === "");
                valid = !non_zero_falsy;
            }
            this.variable_valid[variable_key] = valid;

            if(this.variable_is_parent(variable)){
                const self = this;
                this.preset?.variables.filter((variable)=>{
                    return variable.depends == variable_key;
                }).forEach((child)=>{
                    self.variable_change(child);
                });
            }
        },
        validate(){
            this.valiables_is_valid = false;
            this.valid = false;
            if(!this.selected_preset_key){ return; }
            if(!this.variable_valid){ return; }

            const self = this;
            this.preset?.variables.forEach((variable)=>{
                self.variable_change(variable);
            });

            this.valiables_is_valid = !Object.values(this.variable_valid).some((v)=>{ return v === false; });
            const section_namae_is_valid = (this.section_namae.length > 0);
            this.valid = section_namae_is_valid && this.valiables_is_valid;
        },
    },
};
</script>
