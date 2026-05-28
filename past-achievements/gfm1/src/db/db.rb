require 'bundler'
Bundler.require


class SuperTable  < ActiveRecord::Base
    self.abstract_class = true

    DB_CONF = {
        adapter: "postgresql",
        encoding: "utf-8",
        timeout: 5000,
        host: "db",#TODO: get from env
        port: 5432,#TODO: get from env
        username: "postgres",#TODO: get from env
        password: "postgres",#TODO: get from env
        database: "lifeplan",#TODO: get from env
        pool: 5,#TODO: get from env
    }
    ActiveRecord::Base.establish_connection(DB_CONF)

end

# --
# -- Auth & User
# --

class Authenticate < SuperTable
end

class User < SuperTable
    has_many :entities, dependent: :destroy
    has_many :events, dependent: :destroy
    has_many :expressions, dependent: :destroy
    has_many :accounts, dependent: :destroy
    has_many :balances, dependent: :destroy
end

# --
# -- Tree nodes: section, entity, even, expression
# --

class Section < SuperTable
    belongs_to :users
    has_many :entities, dependent: :destroy
end

class Entity < SuperTable
    belongs_to :users
    belongs_to :sections
    has_many :events, dependent: :destroy
end

class Event < SuperTable
    belongs_to :users
    belongs_to :entities
    belongs_to :balances
    has_many :expressions, dependent: :destroy
end

class Expression < SuperTable
    belongs_to :users
    belongs_to :events
end

# --
# -- Bank accounts
# --

class Account < SuperTable
    belongs_to :users
    has_many :balances, dependent: :destroy
    has_many :events, dependent: :nullify # dont remove events, when account remove.
end

class Balance < SuperTable
    belongs_to :users
    belongs_to :accounts
end

# --
# -- Preset variables
# --

class Preset < SuperTable
    has_many :variables, dependent: :destroy
end

class Variable < SuperTable
    belongs_to :presets
end