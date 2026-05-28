
module My
class App < Sinatra::Base
    # SESSION_EXPIRE = 15 * Biz::MIN_SEC #TODO: more looong (ex. x days), finally.

    # Email Address Regular Expression That 99.99% Works. Disagree? Join discussion!
    # http://emailregex.com/
    MAIL_FORMAT = /\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
    AUTHCODE_FORMAT = /^\d{8}$/
    UUID_FORMAT = /^[0-9a-zA-Z\-]{36}$/
    YEARMONTH_FORMAT = /^\d{4}-\d{2}$/
    MONTHS_FORMAT = /^\d{2}(,\d{2}){0,11}$/
    PROCTYPE_FORMAT = /^(single|every|detail)$/

    configure do
        set :environment, :production # to handle errors
        use Rack::Session::Cookie, {
            :key => 'rack.session',
            # :domain => 'foo.com',
            # :path => '/',
            # :expire_after => SESSION_EXPIRE,
            :secret => 'x_brilliant_family_planning_x',
        }
        # register Sinatra::ActiveRecordExtension # use activerecord
        use Rack::JSONBodyParser# request json
        register Sinatra::Namespace
        register Sinatra::Validation
        enable :method_override # to use PUT, DELETE
    end

    error Biz::MyUnauthorizedError do
        [401, "unauthorized."]
    end
    error Biz::MyMailLockedError do#メールロック：403
        [403, "This mail address was locked. please retry after a few minutes."]
    end
    error Biz::MyInvalidAuthcodeError do#認証コード不一致：400
        [400, "Your authcode not match."]
    end
    error Biz::MyAuthcodeLockedError do#認証コードロック：403
        [403, "Authcode was locked."]
    end

    helpers do
        def date
            @date ||= Date.new
        end
        def biz
            @biz ||= Biz
        end
        def require_authenticate(token)#=>user
            biz.auth.get_authenticated_user(token)
        end

        def section_converter(section_record, set_children = true)
            fields = [:id, :section_key, :section_namae, :sort]
            dto = section_record.attributes.select{|k, v|
                fields.include?(k.to_s) || fields.include?(k.to_sym)
            }
            if set_children then
                dto[:entities] = section_record.entities.map{|entity|
                    entity_converter(entity, set_children)
                }.sort{|a, b| a["sort"] <=> b["sort"]}
            end
            dto
        end
        def entity_converter(entity_record, set_children = true)
            fields = [:id, :section_id, :entity_namae, :entity_from, :entity_to, :sort]
            dto = entity_record.attributes.select{|k, v|
                fields.include?(k.to_s) || fields.include?(k.to_sym)
            }
            if set_children then
                dto[:events] = entity_record.events.map{|event|
                    event_converter(event, set_children)
                }.sort{|a, b| a["sort"] <=> b["sort"]}
            end
            dto
        end
        def event_converter(event_record, set_children = true)
            fields = [:id, :entity_id, :event_namae, :event_from, :event_to, :budget, :sort]
            dto = event_record.attributes.select{|k, v|
                fields.include?(k.to_s) || fields.include?(k.to_sym)
            }
            if set_children then
                dto[:expressions] = event_record.expressions.map{|expression|
                    expression_converter(expression)
                }.sort{|a, b| a["sort"] <=> b["sort"]}
            end
            dto
        end
        def expression_converter(expression_record)
            fields = [:id, :event_id, :expression_namae, :proctype, :not, :month, :months, :year, :step, :sort ]
            dto = expression_record.attributes.select{|k, v|
                fields.include?(k.to_s) || fields.include?(k.to_sym)
            }
            if dto["months"] != nil then
                dto["months"] = dto["months"].split(/\s*,\s*/).map(&:to_i)
            end
            # if dto[:months] != nil then
            #     dto[:months] = dto[:months].split(/\s*,\s*/).map(&:to_i)
            # end
            dto
        end

        def preset_converter(preset_record, set_children = true)
            fields = [:id, :preset_key, :preset_namae, :sort]
            dto = preset_record.attributes.select{|k, v|
                fields.include?(k.to_s) || fields.include?(k.to_sym)
            }
            if set_children then
                dto[:variables] = preset_record.variables.map{|variable|
                    variable_converter(variable)
                }.sort{|a, b| a["sort"] <=> b["sort"]}
            end
            dto
        end
        def variable_converter(variable_record)
            fields = [:id, :preset_id, :variable_key, :variable_namae, :datatype, :required, :months, :default, :depends, :sort ]
            dto = variable_record.attributes.select{|k, v|
                fields.include?(k.to_s) || fields.include?(k.to_sym)
            }
            dto["default"] = JSON.parse(dto["default"])
            dto
        end

    end

    get '/' do
        # "Hello World!!\n"
        redirect '/index.html'
    end

end
end

