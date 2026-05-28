
require File.expand_path('../../db/db.rb', __FILE__)

require File.expand_path('../biz_const.rb', __FILE__)
require File.expand_path('../biz_auth.rb', __FILE__)
require File.expand_path('../biz_rule.rb', __FILE__)

module Biz
    # Accessor
    def auth
        @@auth ||= Auth.new
    end
    def rule
        @@rule ||= Rule.new
    end
    module_function :auth
    module_function :rule

end