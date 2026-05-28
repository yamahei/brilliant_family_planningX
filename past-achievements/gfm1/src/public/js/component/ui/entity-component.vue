<template>

    <!-- Entity -->
    <div class="column is-full is-half-tablet is-one-third-desktop is-one-quarter-widescreen">

        <nav class="panel">
            <div class="panel-heading">
                <div class="dropdown is-right is-hoverable is-pulled-right">
                    <div class="dropdown-trigger">
                        <button class="button is-small" aria-haspopup="true" :aria-controls="`entity_menu${entity.id}`">⋮</button>
                    </div>
                    <div class="dropdown-menu" :id="`entity_menu${entity.id}`" role="menu">
                        <div class="dropdown-content">
                            <a class="dropdown-item" @click="throw_entity_edit">📝要素を編集する</a>
                            <a class="dropdown-item" @click="event_append">➕イベントを追加する</a>
                        </div>
                    </div>
                </div>
                <p @dblclick="throw_entity_edit">{{ entity.entity_namae }}</p>

            </div>

            <!-- Events -->
            <event-component
                v-for="(event, index) in entity.events"
                :key="`event${index}`"
                :event="event"
                @event_edit="throw_event_edit"
            ></event-component>
        </nav>

    </div>

</template>

<script>
export default {
    props: ["entity"],
    methods: {
        //entity
        throw_entity_edit(){
            const param = { entity: this.entity };
            this.$emit('entity_edit', param);
        },
        //event
        throw_event_edit(_param){
            const param = Object.assign(_param, { entity: this.entity });
            this.$emit('event_edit', param);
        },
        event_append(){
            const event_namae = prompt("イベント名");
            if(event_namae){
                const self = this;
                this.$biz.get_new_event(this.entity, event_namae).then((event)=>{
                    const param = { entity: this.entity, event: event };
                    this.$emit('event_append', param);
                });
            }
        }
    },
};
</script>
