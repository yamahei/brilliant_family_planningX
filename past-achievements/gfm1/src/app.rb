require 'bundler'
Bundler.require

require "json"

require File.expand_path('../biz/biz.rb', __FILE__)
require File.expand_path('../app_main.rb', __FILE__)
require File.expand_path('../app_auth.rb', __FILE__)
require File.expand_path('../app_rule.rb', __FILE__)

