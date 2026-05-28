require File.expand_path('../biz_rule/base_preset.rb', __FILE__)

module Biz
class Rule


    private #######################################

    public ########################################

    # get base datas
    def get_sections(user, section_id = nil)
        if section_id then
            Section.where(user_id: user.id, id: section_id).order(:sort)
        else
            Section.where(user_id: user.id).order(:sort)
        end
    end
    def get_presets_tree
        presets = Preset.all.order(:sort)
        variables = Variable.all.order(:sort)
        presets.each{|preset|
            preset.variables = variables.select{|variable|
                preset.id == variable.preset_id
            }.sort{|a, b| a.sort <=> b.sort }
        }
        presets
    end

    def get_tree(user)
        sections = get_sections(user)
        entities = Entity.where(user_id: user.id)
        events = Event.where(user_id: user.id, entity_id: entities.map{|e| e.id})
        expressions = Expression.where(user_id: user.id, event_id: events.map{|e| e.id})
        events.each{|event|
            event.expressions = expressions.select{|expression|
                expression.event_id == event.id
            }.sort{|a, b| a.sort <=> b.sort }
        }
        entities.each{|entity|
            entity.events = events.select{|event|
                event.entity_id == entity.id
            }.sort{|a, b| a.sort <=> b.sort }
        }
        sections.each{|section|
            section.entities = entities.select{|entity|
                entity.section_id == section.id
            }.sort{|a, b| a.sort <=> b.sort }
        }
        sections
    end

    #
    # transactions
    #

    # Section
    def build_section_from_preset(user_id, section_namae, preset_key, variables)
        section_id = BasePreset.auto_factory(user_id, section_namae, preset_key, variables)
    end
    def update_section_without_children(user_id, section_id, section_namae, sort)
        section = Section.find_by({id: section_id, user_id: user_id})
        section.update!({section_namae: section_namae, sort: sort})
    end
    def delete_section_with_children(user_id, section_id)
        section = Section.find_by({id: section_id, user_id: user_id})
        section.destroy
    end

    # Entity
    def insert_entity(user_id, section_id, entity_namae, entity_from, entity_to, sort)
        #TODO: duplicate to BasePreset#insert_entity
        Entity.create(user_id: user_id, section_id: section_id, entity_namae: entity_namae, entity_from: entity_from, entity_to: entity_to)
        #PresetEmpty.get_empty_instance(user_id).insert_entity(user_id, section_id, entity_namae, entity_from, entity_to, sort)
    end
    def update_entity_without_children(user_id, entity_id, section_id, entity_namae, entity_from, entity_to, sort)
        entity = Entity.find_by({id: entity_id, user_id: user_id, section_id: section_id})
        entity.update!({entity_namae: entity_namae, entity_from: entity_from, entity_to: entity_to, sort: sort})
    end
    def delete_entity_with_children(user_id, entity_id, section_id)
        ActiveRecord::Base.transaction do
            entity = Entity.find_by({id: entity_id, user_id: user_id, section_id: section_id})
            entity.destroy
        end
    end
    # Event
    def upsert_event_with_children(user_id, event_id, entity_id, event_namae, event_from, event_to, budget, account_id, expressions)
        new_event = nil
        ActiveRecord::Base.transaction do
            if event_id then
                crr_event = Event.find_by({id: event_id, user_id: user_id, entity_id: entity_id})
                crr_event.destroy
            end
            instance = PresetEmpty.get_empty_instance(user_id)
            new_event = instance.insert_event(user_id, entity_id, event_namae, event_from, event_to, budget, account_id, expressions)
        end
        new_event
    end
    def delete_event_with_children(user_id, event_id, entity_id)
        ActiveRecord::Base.transaction do
            event = Event.find_by({id: event_id, user_id: user_id, entity_id: entity_id})
            event.destroy
        end
    end

end
end