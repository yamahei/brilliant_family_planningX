
module Biz
class Rule
class PresetHome < BasePreset

    # static ######################################

    private ######################################

    public ######################################

    def self.preset_key; "__PRESET_HOME__"; end

    def build_entities(user_id, section_id)
        raise NotImplementError#to implement in subclass
    end

end
end
end