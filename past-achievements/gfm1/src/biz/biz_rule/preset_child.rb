
require 'date'

module Biz
class Rule
class PresetChild < BasePreset

    #誕生日
    BIRTH_0_6_AMOUNT = 0.1 #万円
    BIRTH_7_9_AMOUNT = 0.3 #万円
    BIRTH_10_12_AMOUNT = 0.5 #万円
    BIRTH_13_15_AMOUNT = 0.8 #万円
    BIRTH_16__AMOUNT = 1.0 #万円

    #お小遣い
    MONEY_0_6_AMOUNT = 0 #万円
    MONEY_7_9_AMOUNT = 0.1 #万円
    MONEY_10_12_AMOUNT = 0.2 #万円
    MONEY_13_15_AMOUNT = 0.3 #万円
    MONEY_16__AMOUNT = 0.5 #万円

    #四大✅
    UNIV_PRV_ADMISSION = 30 #万円
    UNIV_PRV_PREPARE = 20 #万円
    UNIV_PRV_ADVANCE = 2 #万円
    UNIV_PRV_FIRST_FEE = 100 #万円
    UNIV_PRV_SECOND_FEE = 0 #万円
    UNIV_PRV_MONTHLY_FEE = 0 #万円
    UNIV_PRV_ALLOWANCE = 8 #万円

    UNIV_PUB_ADMISSION = 30 #万円
    UNIV_PUB_PREPARE = 20 #万円
    UNIV_PUB_ADVANCE = 2 #万円
    UNIV_PUB_FIRST_FEE = 55 #万円
    UNIV_PUB_SECOND_FEE = 0 #万円
    UNIV_PUB_MONTHLY_FEE = 0 #万円
    UNIV_PUB_ALLOWANCE = 8 #万円

    #短大✅
    COLLEDE_PRV_ADMISSION = 24 #万円
    COLLEDE_PRV_PREPARE = 15 #万円
    COLLEDE_PRV_ADVANCE = 2 #万円
    COLLEDE_PRV_FIRST_FEE = 70 #万円
    COLLEDE_PRV_SECOND_FEE = 0 #万円
    COLLEDE_PRV_MONTHLY_FEE = 0 #万円
    COLLEDE_PRV_ALLOWANCE = 8 #万円

    COLLEDE_PUB_ADMISSION = 22 #万円
    COLLEDE_PUB_PREPARE = 12 #万円
    COLLEDE_PUB_ADVANCE = 2 #万円
    COLLEDE_PUB_FIRST_FEE = 40 #万円
    COLLEDE_PUB_SECOND_FEE = 0 #万円
    COLLEDE_PUB_MONTHLY_FEE = 0 #万円
    COLLEDE_PUB_ALLOWANCE = 8 #万円

    #専門✅
    CAREER_ADMISSION = 20 #万円
    CAREER_PREPARE = 15 #万円
    CAREER_ADVANCE = 0 #万円
    CAREER_FIRST_FEE = 100 #万円
    CAREER_SECOND_FEE = 0 #万円
    CAREER_MONTHLY_FEE = 0 #万円
    CAREER_ALLOWANCE = 6 #万円

    #高校✅
    HIGH_PRV_ADMISSION = 15 #万円
    HIGH_PRV_PREPARE = 20 #万円
    HIGH_PRV_ADVANCE = 1 #万円
    HIGH_PRV_FIRST_FEE = 0 #万円
    HIGH_PRV_SECOND_FEE = 0 #万円
    HIGH_PRV_MONTHLY_FEE = 1 #万円
    HIGH_PRV_ALLOWANCE = 4 #万円

    HIGH_PUB_ADMISSION = 0.6 #万円
    HIGH_PUB_PREPARE = 20 #万円
    HIGH_PUB_ADVANCE = 1 #万円
    HIGH_PUB_FIRST_FEE = 0 #万円
    HIGH_PUB_SECOND_FEE = 0 #万円
    HIGH_PUB_MONTHLY_FEE = 1 #万円
    HIGH_PUB_ALLOWANCE = 4 #万円

    #中学✅
    JUNIOR_ADMISSION = 0 #万円
    JUNIOR_PREPARE = 10 #万円
    JUNIOR_ADVANCE = 0 #万円
    JUNIOR_FIRST_FEE = 0 #万円
    JUNIOR_SECOND_FEE = 0 #万円
    JUNIOR_MONTHLY_FEE = 1 #万円
    # JUNIOR_ALLOWANCE = 0 #万円
    #小学✅
    ELEM_ADMISSION = 0 #万円
    ELEM_PREPARE = 10 #万円
    ELEM_ADVANCE = 0 #万円
    ELEM_FIRST_FEE = 0 #万円
    ELEM_SECOND_FEE = 0 #万円
    ELEM_MONTHLY_FEE = 0.7 #万円
    # ELEM_ALLOWANCE = 0 #万円
    #幼稚園✅
    KINDER_ADMISSION = 1 #万円
    KINDER_PREPARE = 3 #万円
    KINDER_ADVANCE = 0.3 #万円
    KINDER_FIRST_FEE = 0 #万円
    KINDER_SECOND_FEE = 0 #万円
    KINDER_MONTHLY_FEE = 1 #万円※収入による3-5歳無償
    # KINDER_ALLOWANCE = 0 #万円
    #保育園✅
    NURSERY_ADMISSION = 2.5 #万円※3-5歳なら無償
    NURSERY_PREPARE = 3 #万円
    NURSERY_ADVANCE = 0 #万円
    NURSERY_FIRST_FEE = 0 #万円
    NURSERY_SECOND_FEE = 0 #万円
    NURSERY_MONTHLY_FEE = 3 #万円※収入による3-5歳無償
    # NURSERY_ALLOWANCE = 0 #万円

    # static ######################################

    private ######################################

    def age(year, first = false)
        birth = value(:birth)
        age_first = Date.new(birth.year + year, birth.month, birth.day)
        age_last = (age_first >> 12) - 1
        first ? age_first : age_last
    end
    def age_first(year); age(year, true); end
    def age_last(year); age(year, false); end

    def nend(year, first = false)
        birth = value(:birth)
        offset = birth <= Date.new(birth.year, 4, 1) ? 1 : 0
        nend_year = birth.year - offset + year
        nend_first = Date.new(nend_year, 4, 1)
        nend_last = (nend_first >> 12) - 1
        first ? nend_first : nend_last
    end
    def nend_first(year); nend(year, true); end
    def nend_last(year); nend(year, false); end

    def nend_first__next_highschool(offset = 0)# 専門・短大・大学の開始年度（高校浪人まで反映）
        highschool_ronin_years = value(:highschool_ronin_years) || 0
        highschool_repeat_years = value(:highschool_repeat_years) || 0
        basic_highschool_next_year = 19
        nend_first(basic_highschool_next_year + highschool_ronin_years + highschool_repeat_years + offset)
    end

    def insert_event_school_before(entity, admit_amount, prepare_amount)#入学-1月
        puts ["insert_event_school_before", {entity: entity, admit_amount: admit_amount, prepare_amount: prepare_amount}]
        account_id = nil
        target_ym = ym_calc_month(entity.entity_from, -1)
        if admit_amount && admit_amount > 0 then
            admit_expressions = [{proctype: "single", month: target_ym}]
            insert_event(entity.user_id, entity.id, "入学金", nil, nil, admit_amount * -1, account_id, admit_expressions)
        end
        if prepare_amount && prepare_amount > 0 then
            prepare_expressions = [{proctype: "single", month: target_ym}]
            insert_event(entity.user_id, entity.id, "入学準備", nil, nil, prepare_amount * -1, account_id, prepare_expressions)
        end
    end

    def insert_event_school_advance(entity, amount)#進学/年-1月
        return if !amount || amount <= 0

        account_id = nil
        event_from = ym_calc_month(entity.entity_from, (12 - 1))
        event_to = ym_calc_month(entity.entity_to, -12)
        target_months = [ym_calc_month(entity.entity_from, -1)]
        expressions = [{proctype: "every", months: target_months}]
        insert_event(entity.user_id, entity.id, "進学準備", event_from, event_to, amount * -1, account_id, expressions)
    end

    def insert_event_allowance(entity, amount)#仕送り/月
        return if !amount || amount <= 0

        account_id = nil
        expressions = [{proctype: "every", months: (1..12).to_a}]
        insert_event(entity.user_id, entity.id, "仕送り", nil, nil, amount * -1, account_id, expressions)
    end

    def insert_event_school_fee(entity, first_amount, second_amount, monthly_amount)#学費/前期4月後期10月月謝
        account_id = nil
        first_month = entity.entity_from
        second_month = ym_calc_month(first_month, 6)
        if first_amount && first_amount > 0 then
            first_expressions = [{proctype: "every", months: [first_month]}]
            insert_event(entity.user_id, entity.id, "学費", nil, nil, first_amount * -1, account_id, first_expressions)
        end
        if second_amount && second_amount > 0 then
            second_expressions = [{proctype: "every", months: [second_month]}]
            insert_event(entity.user_id, entity.id, "学費", nil, nil, second_amount * -1, account_id, second_expressions)
        end
        if monthly_amount && monthly_amount > 0 then
            monthly_expressions = [{proctype: "every", months: (1..12).to_a}]
            insert_event(entity.user_id, entity.id, "学費", nil, nil, monthly_amount * -1, account_id, monthly_expressions)
        end
    end

    def build_entity_university(user_id, section_id)
        university_ronin_years = value(:university_ronin_years) || 0
        university_first = nend_first__next_highschool(university_ronin_years)
        university_repeat_years = value(:university_repeat_years) || 0
        total_university_years = 4 + university_repeat_years
        university_last = (university_first >> (total_university_years * 12)) - 1
        outside_university = value(:outside_university)
        private_university = value(:private_university)
        # Entity
        entity_namae = "大学"
        entity_from = university_first
        entity_to = university_last
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        admission = private_university ? UNIV_PRV_ADMISSION : UNIV_PUB_ADMISSION
        prepare = private_university ? UNIV_PRV_PREPARE : UNIV_PUB_PREPARE
        advance = private_university ? UNIV_PRV_ADVANCE : UNIV_PUB_ADVANCE
        first_fee = private_university ? UNIV_PRV_FIRST_FEE : UNIV_PUB_FIRST_FEE
        second_fee = private_university ? UNIV_PRV_SECOND_FEE : UNIV_PUB_SECOND_FEE
        monthly_fee = private_university ? UNIV_PRV_MONTHLY_FEE : UNIV_PUB_MONTHLY_FEE
        allowance = private_university ? UNIV_PRV_ALLOWANCE : UNIV_PUB_ALLOWANCE
        insert_event_school_before(entity, admission, prepare)#入学準備/前月
        insert_event_school_advance(entity, advance)# 進学準備/毎年
        insert_event_school_fee(entity, first_fee, second_fee, monthly_fee)# 学費/前期-後期
        insert_event_allowance(entity, allowance) if outside_university# 仕送り
    end

    def build_entity_college(user_id, section_id)
        college_ronin_years = value(:college_ronin_years) || 0
        college_first = nend_first__next_highschool(college_ronin_years)
        college_repeat_years = value(:college_repeat_years) || 0
        total_college_years = 2 + college_repeat_years
        college_last = (college_first >> (total_college_years * 12)) - 1
        outside_college = value(:outside_college)
        private_college = value(:private_college)
        # Entity
        entity_namae = "短大"
        entity_from = college_first
        entity_to = college_last
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        admission = private_college ? COLLEDE_PRV_ADMISSION : COLLEDE_PUB_ADMISSION
        prepare = private_college ? COLLEDE_PRV_PREPARE : COLLEDE_PUB_PREPARE
        advance = private_college ? COLLEDE_PRV_ADVANCE : COLLEDE_PUB_ADVANCE
        first_fee = private_college ? COLLEDE_PRV_FIRST_FEE : COLLEDE_PUB_FIRST_FEE
        second_fee = private_college ? COLLEDE_PRV_SECOND_FEE : COLLEDE_PUB_SECOND_FEE
        monthly_fee = private_college ? COLLEDE_PRV_MONTHLY_FEE : COLLEDE_PUB_MONTHLY_FEE
        allowance = private_college ? COLLEDE_PRV_ALLOWANCE : COLLEDE_PUB_ALLOWANCE
        insert_event_school_before(entity, admission, prepare)#入学準備/前月
        insert_event_school_advance(entity, advance)# 進学準備/毎年
        insert_event_school_fee(entity, first_fee, second_fee, monthly_fee)# 学費/前期-後期
        insert_event_allowance(entity, allowance) if outside_college# 仕送り
    end

    def build_entity_career(user_id, section_id)
        career_ronin_years = value(:career_ronin_years) || 0
        career_first = nend_first__next_highschool(career_ronin_years)
        career_school_years = value(:career_school_years) || 2
        career_repeat_years = value(:career_repeat_years) || 0
        total_career_years = career_school_years + career_repeat_years
        career_last = (career_first >> (total_career_years * 12)) - 1
        outside_career = value(:outside_career)
        # Entity
        entity_namae = "専門学校"
        entity_from = career_first
        entity_to = career_last
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        insert_event_school_before(entity, CAREER_ADMISSION, CAREER_PREPARE)#入学準備/前月
        insert_event_school_advance(entity, CAREER_ADVANCE)# 進学準備/毎年
        insert_event_school_fee(entity, CAREER_FIRST_FEE, CAREER_SECOND_FEE, CAREER_MONTHLY_FEE)# 学費/前期-後期
        insert_event_allowance(entity, CAREER_ALLOWANCE) if outside_career# 仕送り
    end

    def build_entity_highschool(user_id, section_id)
        highschool_ronin_years = value(:highschool_ronin_years) || 0
        highschool_repeat_years = value(:highschool_repeat_years) || 0
        outside_highschool = value(:outside_highschool)
        private_highschool = value(:private_highschool)
        # Entity
        entity_namae = "高校"
        entity_from = nend_first(16 + highschool_ronin_years)
        entity_to = nend_last(18 + highschool_ronin_years + highschool_repeat_years)
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        admission = private_highschool ? HIGH_PRV_ADMISSION : HIGH_PUB_ADMISSION
        prepare = private_highschool ? HIGH_PRV_PREPARE : HIGH_PUB_PREPARE
        advance = private_highschool ? HIGH_PRV_ADVANCE : HIGH_PUB_ADVANCE
        first_fee = private_highschool ? HIGH_PRV_FIRST_FEE : HIGH_PUB_FIRST_FEE
        second_fee = private_highschool ? HIGH_PRV_SECOND_FEE : HIGH_PUB_SECOND_FEE
        monthly_fee = private_highschool ? HIGH_PRV_MONTHLY_FEE : HIGH_PUB_MONTHLY_FEE
        allowance = private_highschool ? HIGH_PRV_ALLOWANCE : HIGH_PUB_ALLOWANCE
        insert_event_school_before(entity, admission, prepare)#入学準備/前月
        insert_event_school_advance(entity, advance)# 進学準備/毎年
        insert_event_school_fee(entity, first_fee, second_fee, monthly_fee)# 学費/前期-後期
        insert_event_allowance(entity, allowance) if outside_highschool# 仕送り
    end

    def build_entity_junior(user_id, section_id)
        # Entity
        entity_namae = "中学校"
        entity_from = nend_first(13)
        entity_to = nend_last(15)
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        insert_event_school_before(entity, JUNIOR_ADMISSION, JUNIOR_PREPARE)#入学準備/前月
        insert_event_school_advance(entity, JUNIOR_ADVANCE)# 進学準備/毎年
        insert_event_school_fee(entity, JUNIOR_FIRST_FEE, JUNIOR_SECOND_FEE, JUNIOR_MONTHLY_FEE)# 学費/前期-後期
    end

    def build_entity_elementary(user_id, section_id)
        # Entity
        entity_namae = "小学校"
        entity_from = nend_first(7)
        entity_to = nend_last(12)
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        insert_event_school_before(entity, ELEM_ADMISSION, ELEM_PREPARE)#入学準備/前月
        insert_event_school_advance(entity, ELEM_ADVANCE)# 進学準備/毎年
        insert_event_school_fee(entity, ELEM_FIRST_FEE, ELEM_SECOND_FEE, ELEM_MONTHLY_FEE)# 学費/前期-後期
    end

    def build_entity_kinder(user_id, section_id)
        kinder_years = value(:kinder_years) || 3
        # Entity
        entity_namae = "幼稚園"
        entity_from = nend_first(6 - kinder_years)
        entity_to = nend_last(6)
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        insert_event_school_before(entity, KINDER_ADMISSION, KINDER_PREPARE)#入学準備/前月
        insert_event_school_advance(entity, KINDER_ADVANCE)# 進学準備/毎年
        insert_event_school_fee(entity, KINDER_FIRST_FEE, KINDER_SECOND_FEE, KINDER_MONTHLY_FEE)# 学費/前期-後期
    end

    def build_entity_nursery(user_id, section_id)
        nursery_from = value(:nursery_from) || 0
        # Entity
        entity_namae = "保育園"
        entity_from = age_first(nursery_from)
        entity_to = nend_last(6)
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        insert_event_school_before(entity, NURSERY_ADMISSION, NURSERY_PREPARE)#入学準備/前月
        insert_event_school_advance(entity, NURSERY_ADVANCE)# 進学準備/毎年
        insert_event_school_fee(entity, NURSERY_FIRST_FEE, NURSERY_SECOND_FEE, NURSERY_MONTHLY_FEE)# 学費/前期-後期
    end

    def build_entity_birth(user_id, section_id)
        birth = value(:birth)
        # Entity
        entity_namae = "誕生日"
        entity_from, entity_to = nil, nil
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        account_id = nil
        [
            {label: "幼年", from: age_first(0), to: nend_last(6), amount: BIRTH_0_6_AMOUNT},
            {label: "小学校 低学年", from: nend_first(7), to: nend_last(9), amount: BIRTH_7_9_AMOUNT},
            {label: "小学校 高学年", from: nend_first(10), to: nend_last(12), amount: BIRTH_10_12_AMOUNT},
            {label: "中学生", from: nend_first(13), to: nend_last(15), amount: BIRTH_13_15_AMOUNT},
            {label: "高校生", from: nend_first(16), to: nil, amount: BIRTH_16__AMOUNT},
        ].each{|enrty|
            birth_expressions = [{proctype: "every", months: [birth]}]
            insert_event(user_id, entity.id, enrty[:label], enrty[:from], enrty[:to], enrty[:amount] * -1.0, account_id, birth_expressions)
        }
    end

    def build_entity_money(user_id, section_id)
        # Entity
        entity_namae = "お小遣い"
        entity_from, entity_to = nil, nil
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        account_id = nil
        [
            {label: "幼年", from: age_first(0), to: nend_last(6), amount: MONEY_0_6_AMOUNT},
            {label: "小学校 低学年", from: nend_first(7), to: nend_last(9), amount: MONEY_7_9_AMOUNT},
            {label: "小学校 高学年", from: nend_first(10), to: nend_last(12), amount: MONEY_10_12_AMOUNT},
            {label: "中学生", from: nend_first(13), to: nend_last(15), amount: MONEY_13_15_AMOUNT},
            {label: "高校生", from: nend_first(16), to: nil, amount: MONEY_16__AMOUNT},
        ].each{|enrty|
            money_expressions = [{proctype: "every", months: (1..12).to_a}]
            insert_event(user_id, entity.id, enrty[:label], enrty[:from], enrty[:to], enrty[:amount] * -1.0, account_id, money_expressions)
        }
    end

    public ######################################

    def self.preset_key; "__PRESET_CHILD__"; end

    def build_entities(user_id, section_id)
        build_entity_birth(user_id, section_id) #誕生日
        build_entity_money(user_id, section_id) #お小遣い
        # 習い事、携帯電話

        build_entity_nursery(user_id, section_id) if value(:has_nursery) #保育園に通う
        build_entity_kinder(user_id, section_id) if value(:has_kinder) #幼稚園に通う
        build_entity_elementary(user_id, section_id) #小学校
        build_entity_junior(user_id, section_id) #中学校
        build_entity_highschool(user_id, section_id)if value(:has_highschool) #高校に進学する
        build_entity_career(user_id, section_id) if value(:has_career) #専門学校に進学する
        build_entity_college(user_id, section_id) if value(:has_college) #短大に進学する
        build_entity_university(user_id, section_id) if value(:has_university) #大学に進学する

        # raise NotImplementError#to implement in subclass
    end

end
end
end