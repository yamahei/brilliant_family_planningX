
module Biz
class Rule
class PresetVehicle < BasePreset

    DEFAULT_INSPECTION_AMOUNT = 15 #万円
    DEFAULT_MAINTENANCE_AMOUNT = 1 #万円
    DEFAULT_GASOLINE_AMOUNT = 1 #万円

    # static ######################################

    def self.preset_key; "__PRESET_CAR__"; end

    private ######################################

    def build_entity_inspection(user_id, section_id)
        has_inspection = value(:has_inspection)
        purchase_date = value(:purchase_date)
        # Entity
        entity_namae = "維持点検費"
        entity_from = purchase_date
        entity_to = nil
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        account_id = nil
        if has_inspection then
            inspection_date = value(:inspection_date)#rquired
            inspection_2nd_date = inspection_date >> 6 # 6 months later
            # 車検
            inspect_expressions = [{proctype: "detail", year: inspection_date, months: [inspection_date], step: 2}]
            insert_event(user_id, entity.id, "車検", purchase_date, nil, DEFAULT_INSPECTION_AMOUNT * -1, account_id, inspect_expressions)
            # 点検
            maintenance_expressions = [
                {proctype: "detail", year: inspection_date, months: [inspection_date], step: 2, not: true},
                {proctype: "every", months: [inspection_date, inspection_2nd_date]},
            ]
            insert_event(user_id, entity.id, "点検", purchase_date, nil, DEFAULT_MAINTENANCE_AMOUNT * -1, account_id, maintenance_expressions)
        end
        # ガソリン
        gas_expressions = [{proctype: "every", months: (1..12).to_a}]
        insert_event(user_id, entity.id, "ガソリン", nil, nil, DEFAULT_GASOLINE_AMOUNT * -1, account_id, gas_expressions)

    end

    def build_entity_payments(user_id, section_id)
        purchase_date = value(:purchase_date)
        payment_last_month = value(:payment_last_month)
        # Entity
        entity_namae = "支払い"
        entity_from = purchase_date
        entity_to = payment_last_month
        entity = insert_entity(user_id, section_id, entity_namae, entity_from, entity_to)
        # Event
        account_id = nil
        # 一括/頭金
        payment_deposit = value(:payment_deposit)
        payment_expressions = [{proctype: "single", month: purchase_date}]
        insert_event(user_id, entity.id, "一括/頭金", nil, nil, payment_deposit * -1, account_id, payment_expressions)
        # ローン
        purchase_next_date = purchase_date >> 1#next month
        payment_loan_per_month = value(:payment_loan_per_month)
        if payment_loan_per_month != nil && payment_loan_per_month > 0 then
            loan_expressions = [{proctype: "every", months: (1..12).to_a}]
            insert_event(user_id, entity.id, "ローン", purchase_next_date, payment_last_month, payment_loan_per_month * -1, account_id, loan_expressions)
        end
    end

    public ######################################

    def build_entities(user_id, section_id)
        build_entity_inspection(user_id, section_id)
        build_entity_payments(user_id, section_id) if value(:has_payments)
    end

end
end
end