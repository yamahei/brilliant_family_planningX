<template>
<div>

    <h1 class="title">
        <button class="button is-pulled-right has-tooltip-bottom has-tooltip-active"
            data-tooltip="ここから始めます"
            v-if="show_tooltip"
            @click="section_append"
        >➕項目を追加する</button>
        <button class="button is-pulled-right"
            v-if="!show_tooltip"
            @click="section_append"
        >➕項目を追加する</button>
        <span>💰収支のルール</span>
    </h1>

    <div class="notification" v-if="!tree.sections?.length">
        項目はありません。
    </div>

    <section-component
        v-for="(section, index) in tree.sections"
        :key="`section${index}`"
        :section="section"
        @section_edit="section_edit"
        @entity_append="entity_append"
        @entity_edit="entity_edit"
        @event_append="event_append"
        @event_edit="event_edit"
    ></section-component>


    <transition>
        <edit-section-component
            v-show="section_editor.section && section_editor.visible"
            v-if="section_editor.visible"
            :section="section_editor.section"
            @section_update="section_update"
            @section_remove="section_remove"
            @section_close="section_close"
        ></edit-section-component>
    </transition>
    <transition>
        <edit-entity-component
            v-show="entity_editor.entity && entity_editor.visible"
            v-if="entity_editor.visible"
            :entity="entity_editor.entity"
            @entity_insert="entity_insert"
            @entity_update="entity_update"
            @entity_remove="entity_remove"
            @entity_close="entity_close"
        ></edit-entity-component>
    </transition>
    <transition>
        <edit-event-component
            v-show="event_editor.event && event_editor.visible"
            v-if="event_editor.visible"
            :event="event_editor.event"
            :entity="event_editor.entity"
            @event_upsert="event_upsert"
            @event_remove="event_remove"
            @event_close="event_close"
        ></edit-event-component>
    </transition>
    <transition>
        <input-preset-component
            v-show="preset_editor.visible"
            :presets="presets"
            @section_insert="section_insert"
            @preset_close="preset_close"
        ></input-preset-component>
    </transition>
</div>
</template>

<script>


export default {
    async beforeRouteEnter(to, from, next) {
        await Promise.all([//global access..
            window.$biz.get_tree(),
            window.$biz.get_presets(),
        ]).then((responses)=>{
            next(self => {
                self.tree = {sections: responses.shift().data};
                self.presets = responses.shift().data;
            });
        });
    },
    // async beforeRouteUpdate(to, from, next) {
    //     const response = await window.$biz.get_tree();//global access..
    //     this.tree = response.data;
    //     next();
    // },
    data(){
        return {
            show_tooltip: false,
            tree: {},
            sections: null,
            presets: null,
            section_editor: {
                original: null,
                section: null,
                visible: false,
            },
            entity_editor: {
                original: null,
                entity: null,
                visible: false,
            },
            event_editor: {
                original: null,
                event: null,
                entity: null,
                visible: false,
            },
            preset_editor: {
                visible: false,
            },
        };
    },
    mounted(){
        this.toggle_tooltip();
    },
    methods: {
        //tooltip
        toggle_tooltip(){
            const sec = 1000;
            const self = this;
            const has_section = this.tree.sections?.length;
            const dialog_showing =  this.preset_editor.visible;
            const show_tooltip = !has_section && !dialog_showing;
            this.show_tooltip = show_tooltip ? !this.show_tooltip : false;
            setTimeout(()=>{
                self.toggle_tooltip();
            }, 0.6 * sec);
        },
        //section
        section_append(){
            this.preset_open();
        },
        section_insert(param){
            const self = this;
            this.$biz.section_insert(
                param.section_namae,
                param.preset_key,
                param.variables
            ).then((response)=>{
                self.tree.sections.unshift(response.data);
            });
            this.preset_close();
        },
        section_edit(param){
            const copy = JSON.parse(JSON.stringify(param.section));
            this.section_editor.original = param;
            this.section_editor.section = copy;
            this.section_editor.visible = true;
        },
        section_update(param){
            const section_namae = param.section.section_namae;
            const self = this;
            this.$biz.section_update(param.section).then(()=>{
                self.section_editor.original.section.section_namae = section_namae;
                self.section_close();
            });
        },
        section_remove(param){
            const self = this;
            const sections = self.tree.sections;
            this.$biz.section_remove(param.section).then(()=>{
                const section = sections.find(function(s){ return s.id && s.id == param.section.id; });
                const index = sections.indexOf(section);
                sections.splice(index, 1);
                self.section_close();
            });
        },
        section_close(){
            this.section_editor.original = null;
            this.section_editor.section = null;
            this.section_editor.visible = false;
        },
        //entity
        entity_append(_param){
            console.log(_param);
            const section = _param.section;
            const entity = {
                //id: null,
                section_id: section.id,
                entity_namae: "",
                entity_from: null, entity_to: null,
                events: [], sort: 0
            };
            const copy = JSON.parse(JSON.stringify(entity));
            const param = Object.assign(_param, { entity: entity });
            this.entity_editor.original = param;
            this.entity_editor.entity = copy;
            this.entity_editor.visible = true;
        },
        entity_insert(param){
            const self = this;
            this.$biz.entity_insert(param.entity).then((response)=>{
                const entity = response.data;
                const original = self.entity_editor.original;
                const section = original.section;
                section.entities.unshift(entity);
                self.entity_close();
            });
        },
        entity_edit(param){
            const copy = JSON.parse(JSON.stringify(param.entity));
            this.entity_editor.original = param;
            this.entity_editor.entity = copy;
            this.entity_editor.visible = true;
        },
        entity_update(param){
            const entity_namae = param.entity.entity_namae;
            const entity_from = param.entity.entity_from;
            const entity_to = param.entity.entity_to;
            const self = this;
            this.$biz.entity_update(param.entity).then(()=>{
                self.find_entity_index_and_do(function(entities, index){
                    const entity = entities[index];
                    entity.entity_namae = entity_namae;
                    entity.entity_from = entity_from;
                    entity.entity_to = entity_to;
                });
                self.entity_close();
            });
        },
        entity_remove(param){
            const self = this;
            this.$biz.entity_remove(param.entity).then(()=>{
                self.find_entity_index_and_do(function(entities, index){
                    entities.splice(index, 1);
                });
                self.entity_close();
            });
        },
        entity_close(){
            this.entity_editor.original = null;
            this.entity_editor.entity = null;
            this.entity_editor.visible = false;
        },
        find_entity_index_and_do(func_to_do){//=> array_of_event_container, index_of_event
            const original = this.entity_editor.original;
            const section = original.section;
            const entity = original.entity;
            const entity_index = section?.entities?.indexOf(entity);
            if(!original){ return; }
            if(!entity){ return; }
            // if(entity_index < 0){ return; }
            func_to_do(section.entities, entity_index);
        },
        //event
        event_append(param){
            const _event = JSON.parse(JSON.stringify(param.event));
            const _entity = JSON.parse(JSON.stringify(param.entity));
            this.event_editor.original = param;
            this.event_editor.event = _event;
            this.event_editor.entity = _entity;
            this.event_editor.visible = true;
        },
        event_edit(param){
            const _event = JSON.parse(JSON.stringify(param.event));
            const _entity = JSON.parse(JSON.stringify(param.entity));
            this.event_editor.original = param;
            this.event_editor.event = _event;
            this.event_editor.entity = _entity;
            this.event_editor.visible = true;
        },
        event_upsert(param){
            const self = this;
            this.$biz.event_upsert(param.event).then((response)=>{
                const event = response.data;
                self.find_event_index_and_do(function(events, index){
                    if(index >= 0){
                        events[index] = event;
                    }else{
                        events.unshift(event);
                    }
                });
                self.event_close();
            });
        },
        event_remove(param){
            const self = this;
            this.$biz.event_remove(param.event).then(()=>{
                self.find_event_index_and_do(function(events, index){
                    events.splice(index, 1);
                });
                self.event_close();
            });
        },
        event_close(){
            this.event_editor.original = null;
            this.event_editor.event = null;
            this.event_editor.entity = null;
            this.event_editor.visible = false;
        },
        find_event_index_and_do(func_to_do){//=> array_of_event_container, index_of_event
            const original = this.event_editor.original;
            const entity = original.entity;
            const event = original.event;
            const event_index = entity?.events?.indexOf(event);
            if(!original){ return; }
            if(!entity){ return; }
            if(!event){ return; }
            // if(event_index < 0){ return; }
            func_to_do(entity.events, event_index);
        },
        //preset
        preset_open(){
            this.preset_editor.visible = true;
        },
        preset_close(){
            this.preset_editor.visible = false;
        },
    },
}
</script>