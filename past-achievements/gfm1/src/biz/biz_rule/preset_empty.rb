
module Biz
class Rule
class PresetEmpty < BasePreset

    # static ######################################
    def self.get_empty_instance(user_id)
        self.new(user_id, "", self.preset_key, {})
    end

    private ######################################

    public ######################################

    def self.preset_key; "__PRESET_EMPTY__"; end

    def build_entities(user_id, section_id)
        # do nothing
    end

end
end
end