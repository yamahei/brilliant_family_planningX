/**
 * Biz
 */
(function(g){


    // const testsections = [//debug
    //     { id: 1, section_key: "__SECTION_ADULT__", section_namae: "大人（社会人）", sort: 1 },
    //     { id: 2, section_key: "__SECTION_CHILD__", section_namae: "子ども（学生まで）", sort: 2 },
    //     { id: 3, section_key: "__SECTION_CAR__", section_namae: "車両", sort: 3 },
    //     { id: 4, section_key: "__SECTION_OTHER__", section_namae: "その他（生活費）", sort: 4 },
    // ];

    const preset_seeds_child = [//debug
        "variable_namae	variable_key	datatype	required	default	depends",
        "誕生日	birth	Date	TRUE	NULL	NULL",
        "保育園に通う	has_nursery	Boolean	FALSE	FALSE	NULL",
        "保育園開始年齢	nursery_from	Integer	FALSE	0	has_nursery",
        "幼稚園に通う	has_kinder	Boolean	FALSE	TRUE	NULL",
        "幼稚園通園年数	kinder_years	Integer	FALSE	0	has_kinder",
        "高校に進学する	has_highschool	Boolean	TRUE	TRUE	NULL",
        "私立	private_highschool	Boolean	FALSE	FALSE	has_highschool",
        "県外	outside_highschool	Boolean	FALSE	FALSE	has_highschool",
        "浪人年数	highschool_ronin_years	Integer	FALSE	0	has_highschool",
        "留年年数	highschool_repeat_years	Integer	FALSE	0	has_highschool",
        "専門学校に進学する	has_career	Boolean	TRUE	FALSE	NULL",
        "就学年数	career_ronin_years	Integer	FALSE	0	has_career",
        "県外	outside_career	Boolean	FALSE	FALSE	has_career",
        "浪人年数	career_ronin_years	Integer	FALSE	0	has_career",
        "留年年数	career_repeat_years	Integer	FALSE	0	has_career",
        "短大に進学する	has_college	Boolean	TRUE	FALSE	NULL",
        "私立	private_college	Boolean	FALSE	FALSE	has_college",
        "県外	outside_college	Boolean	FALSE	FALSE	has_college",
        "浪人年数	college_ronin_years	Integer	FALSE	0	has_college",
        "留年年数	college_repeat_years	Integer	FALSE	0	has_college",
        "大学に進学する	has_university	Boolean	TRUE	TRUE	NULL",
        "私立	private_university	Boolean	FALSE	FALSE	has_university",
        "県外	outside_university	Boolean	FALSE	FALSE	has_university",
        "浪人年数	university_ronin_years	Integer	FALSE	0	has_university",
        "留年年数	university_repeat_years	Integer	FALSE	0	has_university",
    ];
    const preset_seeds_vehicles = [//debug
        "variable_namae	variable_key	datatype	required	default	depends",
        "車検がある車両	has_inspection	Boolean	TRUE	FALSE	NULL",
        "最初の車検	inspection_date	Date	TRUE	NULL	has_inspection",
        "支払いを管理する	has_payments	Boolean	TRUE	FALSE	NULL",
        "購入日	purchase_date	Date	TRUE	NULL	has_payments",
        "頭金（万円）	payment_deposit	Integer	TRUE	0	has_payments",
        "ローン（万円/月）	payment_loan_per_month	Integer	TRUE	0	has_payments",
    ];
    const seeds_to_object = function(seeds){//debug
        const preset_head = seeds.shift().split("\t");
        const preset_bodies = seeds.map((seed)=>{
            return seed.split("\t").map((item, index)=>{
                return [preset_head[index], item];
            });
        });
        const map = function(_property){
            const property = {"NULL": null, "TRUE": true, "FALSE": false, "0": 0}[_property];
            return property === undefined ? _property : property;
        }
        const variables = preset_bodies
            .map(b => Object.fromEntries(new Map(b)))
            .map(v => {
                v.required = map(v.required);
                v.default = map(v.default);
                v.depends = map(v.depends);
                return v;
            });
        return variables;
    };
    const testpresets = [//debug
        {
            section_id: 2, preset_key: "__PRESET_CHILD__", preset_namae: "子ども（学生まで）",
            variables: seeds_to_object(preset_seeds_child),
        },
        {
            section_id: 3, preset_key: "__PRESET_CAR__", preset_namae: "車両",
            variables: seeds_to_object(preset_seeds_vehicles),
        },
    ];

    const testtree = {//debug
        sections: [
            //section: car
            {
                id: 3, section_key: "__SECTION_CAR__", section_namae: "車両",
                entities:[
                    {
                        // section_key: "__SECTION_CAR__", entity_name: "__demio__",
                        id: 1, section_id: 3, entity_namae: "🚙デミオ",
                        entity_from: null, entity_to: null,
                        // arguments: [],
                        events: [
                            {
                                // entity_name: "__demio__", event_name: "xx0001",
                                id: 1, entity_id: 1, event_namae: "🔧車検",
                                event_from: "", event_to: "2022-10", sort: 0,
                                budget: 100, account: "__DEFAULT_ACCOUNT__",
                                expressions: [
                                    {//expression_name: "001",
                                        id: 1, event_id: 1, proctype: "single", not: true, month: "2021-07" },
                                    {//expression_name: "002",
                                        id: 2, event_id: 1, proctype: "every", not: true, months: [1, 6] },
                                    {//expression_name: "003",
                                        id: 3, event_id: 1, proctype: "detail", not: false, year: 2000, step: 2, months: [4, 7, 12] },
                                ]
                            },
                            {//entity_name: "__demio__", event_name: "__demio_ijihi__",
                                id: 2, entity_id: 1, event_namae: "⛽その他の維持費", expressions: [] },
                        ],
                    },
                    {
                        // section_key: "__SECTION_CAR__", entity_name: "__gsxr750__",
                        id: 2, section_id: 3, entity_namae: "🏍GSX-R750",
                        entity_from: null, entity_to: null,
                        // arguments: [],
                        events: [
                            {// entity_name: "__gsxr750__", event_name: "__gsxr750_syaken__",
                                id: 3, entity_id: 2, event_namae: "🔧車検", expressions: []},
                            {// entity_name: "__gsxr750__", event_name: "__gsxr750_ijihi__",
                                id: 4, entity_id: 2, event_namae: "⛽その他の維持費", expressions: []},
                        ],
                    },
                ],
            },
            //section: child
            {
                id: 2, section_key: "__SECTION_CHILD__", section_namae: "子ども（学生まで）",
                entities:[
                    {
                        // section_key: "__SECTION_CHILD__", entity_name: "__yukino__",
                        id: 3, section_id: 2, entity_namae: "👧ゆき乃",
                        entity_from: null, entity_to: null,
                        // arguments: [],
                        events: [
                            {// entity_name: "__yukino__", event_name: "__x__",
                                id: 5, entity_id: 3, event_namae: "🏫学費", expressions: []},
                            {// entity_name: "__yukino__", event_name: "__x__",
                                id: 6, entity_id: 3, event_namae: "📱携帯", expressions: []},
                            {// entity_name: "__yukino__", event_name: "__x__",
                                id: 7, entity_id: 3, event_namae: "🎁プレゼント", expressions: []},
                        ],
                    },
                    {
                        // section_key: "__SECTION_CHILD__", entity_name: "__fujio__",
                        id: 4, section_id: 2, entity_namae: "👧ふじ央",
                        entity_from: null, entity_to: null,
                        // arguments: [],
                        events: [
                            {// entity_name: "__fujio__", event_name: "__x__",
                                id: 8, entity_id: 4, event_namae: "🏫学費", expressions: []},
                            {// entity_name: "__fujio__", event_name: "__x__",
                                id: 9, entity_id: 4, event_namae: "📱携帯", expressions: []},
                            {// entity_name: "__fujio__", event_name: "__x__",
                                id: 10, entity_id: 4, event_namae: "🎁プレゼント", expressions: []},
                        ],
                    },
                    {
                        // section_key: "__SECTION_CHILD__", entity_name: "__koharu__",
                        id: 5, section_id: 2, entity_namae: "👧こはる",
                        entity_from: null, entity_to: null,
                        // arguments: [],
                        events: [
                            {// entity_name: "__koharu__", event_name: "__x__",
                                id: 11, entity_id: 6, event_namae: "🏫学費", expressions: []},
                            {// entity_name: "__koharu__", event_name: "__x__",
                                id: 12, entity_id: 6, event_namae: "📱携帯", expressions: []},
                            {// entity_name: "__koharu__", event_name: "__x__",
                                id: 13, entity_id: 6, event_namae: "🎁プレゼント", expressions: []},
                        ],
                    },
                ],
            },
            //section: adult
            {
                id: 1, section_key: "__SECTION_ADULT__", section_namae: "大人（社会人）",
                entities:[
                    {
                        // section_key: "__SECTION_ADULT__", entity_name: "__ippei__",
                        id: 6, section_id: 1, entity_namae: "👨お父ちゃん",
                        entity_from: null, entity_to: null,
                        events: [],
                    },
                    {
                        // section_key: "__SECTION_ADULT__", entity_name: "__akane__",
                        id: 7, section_id: 1, entity_namae: "👩お母ちゃん",
                        entity_from: null, entity_to: null,
                        events: [],
                    },
                ],
            },
            //section: house
            {
                id: 4, section_key: "__SECTION_OTHER__", section_namae: "その他（生活費）",
                entities:[
                    {
                        // section_key: "__SECTION_OTHER__", entity_name: "__home__",
                        id: 8, section_id: 4, entity_namae: "🏠住居（賃貸）",
                        entity_from: null, entity_to: null,
                        events: [],
                    },
                    {
                        // section_key: "__SECTION_OTHER__", entity_name: "__home__",
                        id: 9, section_id: 4, entity_namae: "🏠住居（持家）",
                        entity_from: null, entity_to: null,
                        events: [],
                    },
                    {
                        // section_key: "__SECTION_OTHER__", entity_name: "__food__",
                        id: 10, section_id: 4, entity_namae: "🥬食品",
                        entity_from: null, entity_to: null,
                        events: [],
                    },
                ],
            },
        ]
    };


    let request_start_hook = null;
    let request_finish_hook = null;
    let response_error_hook = null;//TODO: {401: func, ...}
    axios.interceptors.request.use(request => {
        request_start_hook && request_start_hook();
        return request;//do notihng
    });
    axios.interceptors.response.use(response => {
        request_finish_hook && request_finish_hook();
        return response;//do notihng
    }, error => {
        const status = error.response?.status;
        request_finish_hook && request_finish_hook();
        if(status === 401){
            response_error_hook && response_error_hook(error);
        }
        return Promise.reject(error);
    });
    const dummy_promise = function(func){//debug
        return Promise.resolve(func());
    };

    // Biz
    const Biz = function(){
        //Impossible but non-overlapping id (negative values)
        this.unique_count = -1;
        this.get_unique_count = ()=>{ return this.unique_count--; }
    };

    // General
    Biz.prototype.set_request_start_finish_hook = function(start, finish){
        request_start_hook = start;
        request_finish_hook = finish;
    };
    Biz.prototype.set_error_hook = function(status, func){
        switch(status){
            case 401: response_error_hook = func; break;
            default: throw new Error(`response status ${status} is not supported.`);
        }
    };
    // Biz.prototype.get_sections = function(){
    //     return axios.get("/api/rule/sections");
    // };
    Biz.prototype.get_presets = function(){
        console.log(["Biz.prototype.get_presets"]);
        // return dummy_promise(function(){
        //     return { data: testpresets };
        // });
        return axios.get("/api/rule/presets");
    };
    // Login
    Biz.prototype.get_authcode = function(mailaddress){//send mail => result:boolean
        console.log(["Biz.prototype.get_authcode", mailaddress]);
        return axios.get("/api/auth/code", {
            params: { mailaddress: mailaddress }
        });
    };
    Biz.prototype.signin = function(authcode, mailaddress){// => result:boolean
        console.log(["Biz.prototype.signin", authcode]);
        return axios.post("/api/auth/signin", {
            authcode: authcode,
            mailaddress: mailaddress,
        });
    };
    Biz.prototype.resession = function(token){// => result:none
        console.log(["Biz.prototype.resession", token]);
        return axios.post("/api/auth/resession", {
            token: token,
        });
    };

    // Tree
    Biz.prototype.get_tree = function(){
        console.log(["Biz.prototype.get_tree"]);
        return axios.get("/api/rule/tree");
    };

    // Section
    Biz.prototype.section_insert = function(section_namae, preset_key, variables){//insert => result:Entity
        console.log(["Biz.prototype.section_insert", section_namae, preset_key, variables]);
        return axios.post("/api/rule/presets", {
            section_namae: section_namae,
            preset_key: preset_key,
            variables: variables,
        });
    };
    Biz.prototype.section_update = function(section){//update => result:boolean
        console.log(["Biz.prototype.section_update", section]);
        const param = {
            id: section.id,
            section_namae: section.section_namae,
            sort: section.sort || 0,
        }
        return axios.put("/api/rule/section", param);
    };
    Biz.prototype.section_remove = function(section){//remove => result:boolean
        console.log(["Biz.prototype.section_remove", section]);
        const param = {
            id: section.id,
            _method: "DELETE", //hack sinatra..?
        }
        return axios.delete("/api/rule/section", {params: param});
    };

    // Entity
    Biz.prototype.entity_insert = function(entity){//update => Entity
        console.log(["Biz.prototype.entity_insert", entity]);
        const param = {
            // id: entity.id,
            section_id: entity.section_id,
            entity_namae: entity.entity_namae,
            entity_from: entity.entity_from || null,
            entity_to: entity.entity_to || null,
            sort: entity.sort,
        }
        return axios.post("/api/rule/entity", param);
    };
    Biz.prototype.entity_update = function(entity){//update => result:boolean
        console.log(["Biz.prototype.entity_update", entity]);
        const param = {
            id: entity.id,
            section_id: entity.section_id,
            entity_namae: entity.entity_namae,
            entity_from: entity.entity_from || null,
            entity_to: entity.entity_to || null,
            sort: entity.sort,
        }
        return axios.put("/api/rule/entity", param);
    };
    Biz.prototype.entity_remove = function(entity){//delete => result:boolean
        console.log(["Biz.prototype.entity_remove", entity]);
        const param = {
            entity_id: entity.id,
            section_id: entity.section_id,
            _method: "DELETE", //hack sinatra..?
        }
        return axios.delete("/api/rule/entity", {params: param});
    };
    // Event
    Biz.prototype.get_new_event = function(entity, event_namae){//ATTENTION: not insert => result:Event
        const event = {
            user_id: entity.user_id,
            entity_id: entity.id,
            event_namae: event_namae,
            event_from: null,
            event_to: null,
            budget: null,
            account_id: null,
            sort: 0,
            expressions: [],
        };
        console.log(["get_new_event", {entity: entity, event: event}]);
        //ATTENTION: get from biz, but not generate from api.
        return Promise.resolve(event);
    };
    Biz.prototype.event_upsert = function(event){//delete-insert => result:new event tree
        console.log(["Biz.prototype.event_upsert", event]);
        const param = {
            id: event.id || null,
            entity_id: event.entity_id,
            event_namae: event.event_namae,
            event_from: event.event_from || null,
            event_to: event.event_to || null,
            budget: event.budget,
            account_id: event.account_id || null,
            sort: event.sort || 0,
            expressions: event.expressions,
        };
        return axios.put("/api/rule/event", param);
    };
    Biz.prototype.event_remove = function(event){//delete event & expressions => result:boolean
        console.log(["Biz.prototype.event_remove", event]);
        const param = {
            id: event.id || null,
            entity_id: event.entity_id,
            _method: "DELETE", //hack sinatra..?
        }
        return axios.delete("/api/rule/event", {params: param});
    };
    // Expression
    Biz.prototype.get_new_expression = function(proctype){//ATTENTION: not insert => result:Expression
        console.log(["Biz.prototype.get_new_expression", proctype]);
        const expression = {
            proctype: proctype,
            not: false,
        };
        if(proctype == 'single'){
            const year = `${new Date().getFullYear()}`;
            const month = `0${new Date().getMonth() + 1}`.slice(-2);
            expression.month = `${year}-${month}`;
        }
        if(proctype == 'every'){
            expression.months = [new Date().getMonth() + 1];
        }
        if(proctype == 'detail'){
            expression.months = [new Date().getMonth() + 1];
            expression.year = new Date().getFullYear();
            expression.step = 1;
        }
        //ATTENTION: get from biz, but not generate from api.
        return Promise.resolve(expression);
    };


    // Instance
    g.Biz = Biz;

})(this);

/**
 * Test
 */
