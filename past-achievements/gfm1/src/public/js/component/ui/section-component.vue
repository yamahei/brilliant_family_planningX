<template>

    <!-- Section -->
    <section class="section">

        <h2 class="subtitle" style="padding-bottom: 1rem; border-bottom: 1px solid lightgrey;">
            <span @dblclick="throw_section_edit">{{ section.section_namae }}</span>
            <div class="dropdown is-right is-hoverable is-pulled-right">
                <div class="dropdown-trigger">
                    <button class="button" aria-haspopup="true" :aria-controls="`section_menu${section.id}`">⋮</button>
                </div>
                <div class="dropdown-menu" :id="`section_menu${section.id}`" role="menu">
                    <div class="dropdown-content">
                        <a class="dropdown-item" @click="throw_section_edit">📝項目を編集する</a>
                        <a class="dropdown-item" @click="throw_entity_append">➕要素を追加する</a>
                    </div>
                </div>
            </div>
        </h2>

        <div class="columns is-multiline">

            <!-- Entities -->
            <entity-component
                v-for="(entity, index) in section.entities"
                :key="`entity${index}`"
                :entity="entity"
                @entity_edit="throw_entity_edit"
                @event_append="throw_event_append"
                @event_edit="throw_event_edit"
            ></entity-component>
            <div class="column" v-if="!section.entities || section.entities.length <= 0">
                <div class="notification">
                    要素はありません。
                </div>
            </div>

        </div>
    </section>

</template>

<script>
export default {
    props: ["section"],
    data(){
        return {};
    },
    methods: {
        //section
        throw_section_edit(){
            const param = { section: this.section };
            this.$emit('section_edit', param);
        },
        //entity
        throw_entity_append(){
            const param = { section: this.section };
            this.$emit('entity_append', param);
        },
        throw_entity_edit(_param){
            const param = Object.assign(_param, { section: this.section });
            this.$emit('entity_edit', param);
        },
        throw_entity_remove(){
            const param = { section: this.section }
            this.$emit('entity_remove', param);
        },

        //event
        throw_event_append(_param){
            const param = Object.assign(_param, { section: this.section });
            this.$emit("event_append", param);
        },
        throw_event_edit(_param){
            const param = Object.assign(_param, { section: this.section });
            this.$emit("event_edit", param);
        },
    },
};
</script>
