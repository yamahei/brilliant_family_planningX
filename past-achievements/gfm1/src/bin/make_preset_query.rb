
require 'bundler'#<-TODO: sinatra is required..
Bundler.require#<-TODO: sinatra is required..
# require "activerecord"
# require "pg"
require "json"
require File.expand_path('../../db/db.rb', __FILE__)


# USAGE:
#   1. Edit data in /doc/収支のデータ構造検討.xlsx
#   2. Paste data below.
#   3. Exec program to insert.
#       docker-compose exec app bash
#       bundle exec ruby ./bin/make_preset_query.rb
#   * ATTENTION:
#       This program delete all presets and variables.
preset_seeds = [
    [
        # preset
        "preset_key	preset_namae	sort",
        "__PRESET_ADULT__	👨大人（社会人）	1",
        # no-variable
    ],
    [
        # preset
        "preset_key	preset_namae	sort",
        "__PRESET_CHILD__	🧒子ども（学生まで）	2",
        # variable
        "preset_key	variable_namae	variable_key	datatype	required	default	depends	sort",
        "__PRESET_CHILD__	誕生日	birth	Date	true	null	null	1",
        "__PRESET_CHILD__	保育園に通う	has_nursery	Boolean	false	false	null	2",
        "__PRESET_CHILD__	保育園開始年齢	nursery_from	Integer	false	0	has_nursery	3",
        "__PRESET_CHILD__	幼稚園に通う	has_kinder	Boolean	false	true	null	4",
        "__PRESET_CHILD__	幼稚園通園年数	kinder_years	Integer	false	3	has_kinder	5",
        "__PRESET_CHILD__	高校に進学する	has_highschool	Boolean	true	true	null	6",
        "__PRESET_CHILD__	私立	private_highschool	Boolean	false	false	has_highschool	7",
        "__PRESET_CHILD__	県外	outside_highschool	Boolean	false	false	has_highschool	8",
        "__PRESET_CHILD__	浪人年数	highschool_ronin_years	Integer	false	0	has_highschool	9",
        "__PRESET_CHILD__	留年年数	highschool_repeat_years	Integer	false	0	has_highschool	10",
        "__PRESET_CHILD__	専門学校に進学する	has_career	Boolean	true	false	null	11",
        "__PRESET_CHILD__	就学年数	career_school_years	Integer	false	0	has_career	12",
        "__PRESET_CHILD__	県外	outside_career	Boolean	false	false	has_career	13",
        "__PRESET_CHILD__	浪人年数	career_ronin_years	Integer	false	0	has_career	14",
        "__PRESET_CHILD__	留年年数	career_repeat_years	Integer	false	0	has_career	15",
        "__PRESET_CHILD__	短大に進学する	has_college	Boolean	true	false	null	16",
        "__PRESET_CHILD__	私立	private_college	Boolean	false	false	has_college	17",
        "__PRESET_CHILD__	県外	outside_college	Boolean	false	false	has_college	18",
        "__PRESET_CHILD__	浪人年数	college_ronin_years	Integer	false	0	has_college	19",
        "__PRESET_CHILD__	留年年数	college_repeat_years	Integer	false	0	has_college	20",
        "__PRESET_CHILD__	大学に進学する	has_university	Boolean	true	true	null	21",
        "__PRESET_CHILD__	私立	private_university	Boolean	false	false	has_university	22",
        "__PRESET_CHILD__	県外	outside_university	Boolean	false	false	has_university	23",
        "__PRESET_CHILD__	浪人年数	university_ronin_years	Integer	false	0	has_university	24",
        "__PRESET_CHILD__	留年年数	university_repeat_years	Integer	false	0	has_university	25",
    ],
    [
        # preset
        "preset_key	preset_namae	sort",
        "__PRESET_CAR__	🚙車両	3",
        # variable
        "preset_key	variable_namae	variable_key	datatype	required	default	depends	sort",
        "__PRESET_CAR__	車検がある車両	has_inspection	Boolean	false	false	null	1",
        "__PRESET_CAR__	最初の車検	inspection_date	Date	false	null	has_inspection	2",
        "__PRESET_CAR__	支払いを管理する	has_payments	Boolean	false	false	null	3",
        "__PRESET_CAR__	購入日	purchase_date	Date	false	null	has_payments	4",
        "__PRESET_CAR__	頭金または一括（万円）	payment_deposit	Integer	false	0	has_payments	5",
        "__PRESET_CAR__	ローン（万円/月）	payment_loan_per_month	Integer	false	0	has_payments	6",
        "__PRESET_CAR__	ローン完済日	payment_last_month	Date	false	null	has_payments	7",
    ],
    [
        # preset
        "preset_key	preset_namae	sort",
        "__PRESET_HOME__	🏠住居・生活費	4",
        # TOFO: variable
    ],
    [
        # preset
        "preset_key	preset_namae	sort",
        "__PRESET_EMPTY__	👨‍👩‍👧‍👦空（自分で作成）	5",
        # no-variable
    ],
]

def find_section_by_key(section_key)
    Section.all.find{|record|
        record.section_key == section_key
    }
end
def find_preset_by_key(preset_key)
    Preset.all.find{|record|
        record.preset_key == preset_key
    }
end


def table_to_hashlist(table)
    return [] if !table || table.empty?
    head = table[0]
    keys = head.split("\t")
    trans_dic = {"true" => true, "false" => false, "null" => nil, "0" => 0}

    body = table[1..]
    hashlist = body.map{|line|
        hash_seed = line.split("\t").map.with_index{|item, index|
            key = keys[index]
            int_value = item =~ /^[0-9]+$/ ? item.to_i : nil
            trans_value = trans_dic.has_key?(item) ? trans_dic[item] : item
            value = int_value || trans_value
            [key, value]
        }
        Hash[*hash_seed.flatten(1)]
    }
end

def replace_key_in_hash_list(hash_list, old_key, new_key, sort_to_i = true, &get_value)
    hash_list.each{|hash|
        hash[new_key] = get_value.call(hash[old_key])
        hash.delete(old_key)
        if sort_to_i && hash.has_key?("sort") then
            hash["sort"] = hash["sort"].to_i
        end
    }
end

preset_seeds.each{|seed|
    _presets = table_to_hashlist(seed[0..1])
    _variables = table_to_hashlist(seed[2..])

    # preset.delete if Preset.all.length

    presets = _presets
    presets.each{|preset|
        Preset.create({
            preset_key: preset["preset_key"],
            preset_namae: preset["preset_namae"],
            sort: preset["sort"],
        })
    }

    next if _variables.length <= 0
    # preset_key = _presets.first["preset_key"]
    # preset = find_preset_by_key(preset_key)
    variables = replace_key_in_hash_list(_variables, "preset_key", "preset_id"){|old_value|
        find_preset_by_key(old_value).id
    }
    variables.each{|variable|
        Variable.create({
            preset_id: variable["preset_id"],
            variable_namae: variable["variable_namae"],
            variable_key: variable["variable_key"],
            datatype: variable["datatype"],
            required: variable["required"],
            default: JSON.generate(variable["default"]),
            depends: variable["depends"],
            sort: variable["sort"],
        })
    }
}

puts "** finish insert preset records. **"