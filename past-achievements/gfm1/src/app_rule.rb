
module My
class App < Sinatra::Base
namespace '/api' do
namespace '/rule' do

    get "/sections" do
        user_record = require_authenticate(session[:token])
        section_records = biz.rule.get_sections(user_record)
        set_children = false
        section_dtos = section_records.map{|record| section_converter(record, set_children) }
        section_dtos.to_json
    end

    get "/tree" do
        user_record = require_authenticate(session[:token])
        section_records = biz.rule.get_tree(user_record)
        set_children = true
        section_dtos = section_records.map{|record| section_converter(record, set_children) }
        section_dtos.to_json
    end

    get "/presets" do
        user_record = require_authenticate(session[:token])
        preset_records = biz.rule.get_presets_tree
        preset_dtos = preset_records.map{|record| preset_converter(record, true) }
        preset_dtos.to_json
    end
    post "/presets" do
        user_record = require_authenticate(session[:token])
        validates { params {
            required(:section_namae).filled(:string)
            required(:preset_key).filled(:string)
            optional(:variables).maybe(:hash)
        }}

        section_id = biz.rule.build_section_from_preset(
            user_record.id,
            params[:section_namae],
            params[:preset_key],
            params[:variables],
        )
        section_record = biz.rule.get_sections(user_record, section_id).first
        set_children = true
        section_dto = section_converter(section_record, set_children)
        section_dto.to_json
    end

    put "/section" do
        user_record = require_authenticate(session[:token])
        validates { params {
            required(:id).filled(:integer)
            required(:section_namae).filled(:string)
            required(:sort).filled(:integer)
        }}
        biz.rule.update_section_without_children(
            user_record.id,
            params[:id],
            params[:section_namae],
            params[:sort]
        )
        200
    end
    delete "/section" do
        user_record = require_authenticate(session[:token])
        validates { params {
            required(:id).filled(:integer)
        }}
        biz.rule.delete_section_with_children(
            user_record.id,
            params[:id]
        )
        200
    end

    post "/entity" do
        user_record = require_authenticate(session[:token])
        validates { params {
            # required(:id).filled(:integer)
            required(:section_id).filled(:integer)
            required(:entity_namae).filled(:string)
            optional(:entity_from).maybe(:string, format?: YEARMONTH_FORMAT)
            optional(:entity_to).maybe(:string, format?: YEARMONTH_FORMAT)
            required(:sort).filled(:integer)
        }}

        entity = biz.rule.insert_entity(
            user_record.id,
            params[:section_id],
            params[:entity_namae],
            params[:entity_from],
            params[:entity_to],
            params[:sort]
        )
        set_children = true
        entity_dto = entity_converter(entity, set_children)
        entity_dto.to_json
    end
    put "/entity" do
        user_record = require_authenticate(session[:token])
        validates { params {
            required(:id).filled(:integer)
            required(:section_id).filled(:integer)
            required(:entity_namae).filled(:string)
            optional(:entity_from).maybe(:string, format?: YEARMONTH_FORMAT)
            optional(:entity_to).maybe(:string, format?: YEARMONTH_FORMAT)
            required(:sort).filled(:integer)
        }}

        biz.rule.update_entity_without_children(
            user_record.id,
            params[:id],
            params[:section_id],
            params[:entity_namae],
            params[:entity_from],
            params[:entity_to],
            params[:sort]
        )
        200
    end
    delete "/entity" do
        user_record = require_authenticate(session[:token])
        validates { params {
            required(:entity_id).filled(:integer)
            required(:section_id).filled(:integer)
        }}

        biz.rule.delete_entity_with_children(
            user_record.id,
            params[:entity_id],
            params[:section_id],
        )
        200
    end

    put "/event" do
        user_record = require_authenticate(session[:token])
        validates { params {
            optional(:id).maybe(:integer)
            required(:entity_id).filled(:integer)
            required(:event_namae).filled(:string)
            optional(:event_from).maybe(:string, format?: YEARMONTH_FORMAT)
            optional(:event_to).maybe(:string, format?: YEARMONTH_FORMAT)
            required(:budget).filled(:integer)
            optional(:account_id).maybe(:integer)
            required(:sort).filled(:integer)
            required(:expressions).array(:hash) do
                optional(:id).maybe(:integer)
                optional(:user_id).maybe(:integer)
                optional(:event_id).maybe(:integer)
                required(:proctype).filled(:string, format?: PROCTYPE_FORMAT)
                required(:not).filled(:bool)
                optional(:month).maybe(:string, format?: YEARMONTH_FORMAT)
                optional(:months).maybe(:array)
                optional(:year).maybe(:integer)
                optional(:step).maybe(:integer)
            end
        }}

        event = biz.rule.upsert_event_with_children(
            user_record.id,
            params[:id],
            params[:entity_id],
            params[:event_namae],
            params[:event_from],
            params[:event_to],
            params[:budget],
            params[:account_id],
            params[:expressions].map{|ex|
                {
                    proctype: ex[:proctype],
                    month: ex[:month],
                    months: ex[:months],
                    year: ex[:year],
                    step: ex[:step],
                    not: ex[:not],
                }
            },
        )
        set_children = true
        event_dto = event_converter(event, set_children)
        event_dto.to_json
    end
    delete "/event" do
        user_record = require_authenticate(session[:token])
        validates { params {
            required(:id).filled(:integer)
            required(:entity_id).filled(:integer)
        }}

        event = biz.rule.delete_event_with_children(user_record.id, params[:id], params[:entity_id])
        200
    end


end#/rule
end#/api
end#App
end#My

