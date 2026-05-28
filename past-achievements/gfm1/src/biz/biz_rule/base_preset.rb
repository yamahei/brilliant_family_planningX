
module Biz
class Rule
class BasePreset

    # static ######################################

    def self.auto_factory(user_id, section_namae, preset_key, variables)#=>section_id
        preset_klass = {
            # PresetAdult.preset_key => PresetAdult,
            PresetChild.preset_key => PresetChild,
            PresetVehicle.preset_key => PresetVehicle,
            # PresetHome.preset_key => PresetHome,
            PresetEmpty.preset_key => PresetEmpty,
        }[preset_key]
        raise InvalidPresetkeyError("unknown preset_key: #{preset_key}.") if !preset_klass
        preset = preset_klass.new(user_id, section_namae, preset_key, variables)
        section_id = preset.build(user_id, section_namae, variables)
        section_id
    end

    private #######################################

    def validation(records, variable_dic)#=> exception or nil
        puts "TODO: validation"
        return nil#valid
        # records.each{|record|
        #     input = variable_dic[record.variable_key]
        #     #required
        #     if input == nil then
        #         raise InvalidVariablesError("#{record.variable_key} is required.") if record.required == true
        #         next
        #     end
        #     #datatype
        #     #depends
        # }
    end

    def build_entities(user_id, section_id)#=> nil
        raise NotImplementError#to implement in subclass
    end


    public ########################################


    def convert(records, variable_dic)#=> {key => converted value}
        values = records.map{|record|
            input = variable_dic[record.variable_key]
            has_input = input != nil ? true : false
            is_date = record.datatype == "Date" ? true : false
            value = is_date && has_input ? Date.parse(input) : input
            [record.variable_key, value]
        }
        Hash[*values.flatten]
    end

    def insert_section(user_id, section_namae)#=> Section
        Section.create(user_id: user_id, section_namae: section_namae)
    end
    def insert_entity(user_id, section_id, entity_namae, _entity_from, _entity_to)#=> Entity
        entity_from = to_ym(_entity_from)
        entity_to = to_ym(_entity_to)
        Entity.create(user_id: user_id, section_id: section_id, entity_namae: entity_namae, entity_from: entity_from, entity_to: entity_to)
    end
    def insert_event(user_id, entity_id, event_namae, _event_from, _event_to, budget, account_id = nil, expressions = [])
        event_from = to_ym(_event_from)
        event_to = to_ym(_event_to)
        event = Event.create(user_id: user_id, entity_id: entity_id, event_namae: event_namae, event_from: event_from, event_to: event_to, budget: budget, account_id: account_id)
        expressions.each{|expr|
            case expr[:proctype]
            when "single" then
                insert_expression_single(user_id, event.id, expr[:month], !!expr[:not])
            when "every" then
                insert_expression_every(user_id, event.id, expr[:months], !!expr[:not])
            when "detail" then
                insert_expression_detail(user_id, event.id, expr[:year], expr[:months], expr[:step], !!expr[:not])
            else
                raise ArgumentError
            end
        }
        event #return
    end
    def insert_expression_single(user_id, event_id, _month, _not)
        month = to_ym(_month)
        proctype = "single"
        Expression.create(user_id: user_id, event_id: event_id, proctype: proctype, month: month, not: _not)
    end
    def insert_expression_every(user_id, event_id, _months, _not)
        months = _months.map{|month| to_m(month) }.join(",")
        proctype = "every"
        Expression.create(user_id: user_id, event_id: event_id, proctype: proctype, months: months, not: _not)
    end
    def insert_expression_detail(user_id, event_id, _year, _months, step, _not)
        year = to_y(_year)
        months = _months.map{|month| to_m(month) }.join(",")
        proctype = "detail"
        Expression.create(user_id: user_id, event_id: event_id, proctype: proctype, year: year, months: months, step: step, not: _not)
    end

    def ym_calc_month(target_ym, amount_month)#Date<X/X/01>
        ym = nil
        ym = nil if target_ym == nil
        if target_ym.kind_of?(String) then
            ym = nil if target_ym.empty?
            ym = Date.parse("#{target_ym}-01") if target_ym =~ /^\d{4}-\d{2}$/
            raise ArgumentError if !ym
        end
        ym = target_ym if target_ym.kind_of?(Date)
        puts ["ym_calc_month", {target_ym: target_ym, amount_month: amount_month, ym: ym}]
        return ym ? (ym >> amount_month) : nil
    end
    def to_ym(value)
        return nil if value == nil
        if value.kind_of?(String) then
            return nil if value.empty?
            return value if value =~ /^\d{4}-\d{2}$/
            raise ArgumentError.new("to_ym failed, unknown argument '#{value}'")
        end
        return value.strftime("%Y-%m") if value.kind_of?(Date)
        raise ArgumentError
    end
    def to_y(value)
        return nil if value == nil
        if value.kind_of?(String) then
            return nil if value.empty?
            return value if value =~ /^\d{4}$/
            return value[0..3] if value =~ /^\d{4}-\d{2}$/
            raise ArgumentError.new("to_y failed, unknown argument '#{value}'")
        end
        return value.to_s if value.kind_of?(Integer)
        return value.strftime("%Y") if value.kind_of?(Date)
        raise ArgumentError
    end
    def to_m(value)
        return nil if value == nil
        if value.kind_of?(String) then
            return nil if value.empty?
            return value if value =~ /^\d{2}$/
            return value[-2..] if value =~ /^\d{4}-\d{2}$/
            raise ArgumentError.new("to_m failed, unknown argument '#{value}'")
        end
        return value.strftime("%m") if value.kind_of?(Date)
        return value if value.kind_of?(Integer)
        raise ArgumentError
    end


    def initialize(user_id, section_namae, preset_key, _variable_dic)
        puts "BasePreset(#{user_id}, #{section_namae}, #{preset_key}, #{_variable_dic})"
        @preset_record = Preset.find_by(preset_key: preset_key)
        raise InvalidPresetkeyError("preset key not found: #{preset_key}") if !@preset_record

        @variable_records = Variable.where(preset_id: @preset_record.id).order(:sort)
        @variable_dic = convert(@variable_records, _variable_dic) if @variable_records.length > 0
        validation(@variable_records, @variable_dic) if @variable_records.length > 0

        @user_id = user_id
        @section_namae = section_namae
        @preset_key = preset_key
    end

    def build(user_id, section_namae, variables)
        section = nil
        ActiveRecord::Base.transaction do
            section = insert_section(user_id, section_namae)
            build_entities(user_id, section.id)
        end
        section.id
    end

    def value(key)
        return @variable_dic[key.to_s] if @variable_dic.has_key?(key.to_s)
        return @variable_dic[key.to_sym] if @variable_dic.has_key?(key.to_sym)
        raise InvalidVariablesError("varible '#{key}' not found")
    end


end
end
end

# require after define base
require File.expand_path('../preset_adult.rb', __FILE__)
require File.expand_path('../preset_child.rb', __FILE__)
require File.expand_path('../preset_home.rb', __FILE__)
require File.expand_path('../preset_vehicle.rb', __FILE__)
require File.expand_path('../preset_empty.rb', __FILE__)
