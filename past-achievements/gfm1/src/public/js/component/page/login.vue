<template>


    <section class="section" style="margin: auto; min-width: 420px; max-width: 640px;">
        <div class="tile is-ancestor">
            <div class="tile is-parent">
                <div class="tile is-child notification has-background-light">
                    <div class="content">
                        <p><br/></p>
                        <p class="title">🔒ログイン</p>

                        <div v-if="state=='mail'">
                            <div class="field">
                                <label class="label">認証コードをメールで送信する</label>
                            </div>
                            <div class="field has-addons">
                                <div class="control is-expanded has-icons-left">
                                    <input type="email" placeholder="メールアドレス"
                                        :class="{'input': true, 'is-danger': !valid_mail}"
                                        @change="validate_mail"
                                        v-on:keydown.enter="send_mail"
                                        v-model="mailaddress"
                                        ref="focus_mail"
                                    ><span class="icon is-small is-left">📧</span>
                                </div>
                                <div class="control">
                                    <button class="button is-primary" @click="send_mail">送信</button>
                                </div>
                            </div>
                            <div class="field" v-if="mail_error_message">
                                <p class="help is-danger">{{ mail_error_message }}</p>
                            </div>

                        </div>

                        <div v-if="state=='code'">
                            <div class="field">
                                <label class="label">認証コードを入力する</label>
                            </div>
                            <div class="field has-addons">
                                <div class="control">
                                    <button class="button" @click="back">🔙</button>
                                </div>
                                <div class="control is-expanded has-icons-left">
                                    <input type="text" placeholder="認証コード"
                                        :class="{'input': true, 'is-danger': !valid_code}"
                                        @change="validate_code"
                                        v-on:keydown.enter="send_code"
                                        v-model="authcode"
                                        ref="focus_code"
                                    ><span class="icon is-small is-left">🗝️</span>
                                </div>
                                <div class="control">
                                    <button class="button is-primary" @click="send_code">ログイン</button>
                                </div>
                            </div>
                            <div class="field" v-if="code_error_message">
                                <p class="help is-danger">{{ code_error_message }}</p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>

    </section>

</template>

<script>
export default {
    // TODO: if token, call resession and got /home
    async beforeRouteEnter(to, from, next) {
        next(self => {
            const token = self.$token.get();
            self.$biz.resession(token).then((res)=>{
                self.$router.push('/home');
            }).catch(e =>{/* do nothing */});
        });
    },
    data(){
        return {
            state: "mail",// mail <-> code
            mailaddress: "",
            valid_mail: true,
            mail_error_message: null,
            authcode: "",
            valid_code: true,
            code_error_message: null,
        };
    },
    mounted(){
        this.$refs.focus_mail.focus();
    },
    methods: {
        validate_mail(){
            this.valid_mail = true;
            if(!this.mailaddress || !this.$reg_mail.test(this.mailaddress)){
                this.valid_mail = false;
            }
        },
        send_mail(){
            this.validate_mail();
            if(!this.valid_mail){ return; }
            const self = this;
            this.$biz.get_authcode(this.mailaddress).then(()=>{
                self.authcode = "";
                self.mail_error_message = null;
                self.code_error_message = null;
                self.state = "code";
                setTimeout(()=>{
                    self.$refs.focus_code.focus();
                }, 0);
            }).catch((e)=>{
                const response = e?.response;
                const status = response?.status;// 403:
                switch(status){
                    case 403:
                        self.mail_error_message = "Mail sending is locked";
                        break;
                    default:
                        self.mail_error_message = "Unknown error.";
                }
            });
        },
        back(){
            this.mail_error_message = null;
            this.state = "mail";
            const self = this;
            setTimeout(()=>{
                self.$refs.focus_mail.focus();
            }, 0);
        },
        validate_code(){
            this.valid_code = true;
            if(!this.authcode){
                this.valid_code = false;
            }
        },
        send_code(){
            this.validate_code();
            if(!this.valid_code){ return; }
            const self = this;
            this.$biz.signin(this.authcode, this.mailaddress).then((res)=>{
                const data = res.data;
                const token = data.token;
                self.$token.set(token);
                self.code_error_message = null;
                self.$router.push('/home');
            }).catch((e)=>{
                const response = e?.response;
                const status = response?.status;//400: 403:
                switch(status){
                    case 400:
                        self.code_error_message = "Authcode does not match.";
                        break;
                    case 403:
                        self.code_error_message = "Authentication code has expired.";
                        break;
                    default:
                        self.code_error_message = "Unknown error.";
                }
                console.error(e);
            });
        },
    }
};
</script>