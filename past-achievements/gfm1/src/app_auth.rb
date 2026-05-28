
module My
class App < Sinatra::Base
namespace '/api' do
namespace '/auth' do

    get "/code" do
        validates { params {
            required(:mailaddress).filled(:string, format?: MAIL_FORMAT)
        }}
        mailaddress = params[:mailaddress]
        authcode = biz.auth.send_authcode(mailaddress)# or exception
        # reponse
        {:authcode => authcode}.to_json#TODO: not response
    end

    post "/signin" do
        validates { params {
            required(:authcode).filled(:string, format?: AUTHCODE_FORMAT)
            required(:mailaddress).filled(:string, format?: MAIL_FORMAT)
        }}
        authcode = params[:authcode]
        mailaddress = params[:mailaddress]
        token = biz.auth.authenticate(authcode, mailaddress)# or exception
        session[:token] = token
        # response
        {:token => token}.to_json
    end

    post "/resession" do
        validates { params {
            required(:token).filled(:str?).value(format?: UUID_FORMAT)
        }}
        token = params[:token]
        biz.auth.resession(token)
        session[:token] = token
        # response
        200
    end


end#/auth
end#/api
end#App
end#My

