<template>


    <section class="section">
        <div class="tile is-ancestor">
            <div class="tile is-parent">
                <div class="tile is-child notification has-background-light">
                    <div class="content is-clickable" @click="gotoRule">
                        <p><br/></p>
                        <p class="title">💰収支のルール</p>
                        <p class="subtitle">給与収入や日々の支出をルールとして登録しましょう。</p>
                        <p><br/></p>
                    </div>
                </div>
            </div>
            <div class="tile is-parent">
                <div class="tile is-child notification has-background-light">
                    <div class="content is-clickable" @click="gotoCalendar">
                        <p><br/></p>
                        <p class="title">📅カレンダー</p>
                        <p class="subtitle">収支のルールに基づいて、月単位の収支状況を一覧しましょう。</p>
                        <p><br/></p>
                    </div>
                </div>
            </div>
        </div>

    </section>

</template>

<script>
export default {
    methods: {
        goto(path){ this.$router.push(path); },
        gotoRule(){ this.goto("/rule"); },
        gotoCalendar(){ this.goto("/calendar"); },
    }
};
</script>