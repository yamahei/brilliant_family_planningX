require "time"
require 'securerandom'

module Biz

    MAILSEND_LOCK_SEC = MIN_SEC * 5
    AUTHCODE_DIGITS = 8
    AUTHCODE_EXPIRY_SEC = MIN_SEC * 5
    AUTH_RETRY_LIMIT = 3 #TODO: 5 or more
    TOKEN_EXPIRY_SEC = DAY_SEC * 5

    class Auth

        private ################################

        def get_authcode
            #Ruby で特定の桁数の、ランダムな数字を生成する例。ゼロ埋めバージョン。
            # https://qiita.com/YumaInaura/items/6d337f76041009069556
            AUTHCODE_DIGITS.times.map { rand(9) }.join
        end

        def create_authenticate(mail, authcode)
            expiry = Time.now + AUTHCODE_EXPIRY_SEC
            lock = Time.now
            Authenticate.create({
                mailaddress: mail,
                authcode: authcode,
                retry: 0,
                expiry: expiry,
                lock: lock,
            })
        end


        public #####################################

        def send_authcode(mailaddress)#=>authcode
            #TODO: remove old authenticates

            authcode = get_authcode
            authenticate = Authenticate.find_by(mailaddress: mailaddress)
            if authenticate then
                retry_count = authenticate.retry
                outof_retry = retry_count > AUTH_RETRY_LIMIT
                lock_expiry = authenticate.lock > Time.now
                raise MyMailLockedError if outof_retry && lock_expiry

                expiry = Time.now + AUTHCODE_EXPIRY_SEC
                lock = Time.now
                authenticate.update!({
                    authcode: authcode, expiry: expiry, lock: lock
                })
            else
                create_authenticate(mailaddress, authcode)
            end
            #TODO: send authcode by mail
            authcode
        end

        def authenticate(authcode, mailaddress)#=>token

            authenticate = Authenticate.find_by({mailaddress: mailaddress})
            rasie StandardError.new("authenticate not found.") if !authenticate

            retry_count = authenticate.retry
            outof_retry = retry_count > AUTH_RETRY_LIMIT
            outof_expiry = authenticate.expiry < Time.now
            authcode_match = authenticate.authcode == authcode

            raise MyAuthcodeLockedError if outof_retry
            raise MyAuthcodeLockedError if outof_expiry

            # TODO: use transaction below
            # ActiveRecord::Base.transaction do
            # end

            if !authcode_match then
                next_count = retry_count + 1
                if next_count > AUTH_RETRY_LIMIT then
                    lock = Time.now + MAILSEND_LOCK_SEC
                    authenticate.update!({retry: next_count, lock: lock})
                else
                    authenticate.update!({retry: next_count})
                end
                raise MyInvalidAuthcodeError
            end

            # authenticated
            authenticate.destroy
            user = User.find_by({mailaddress: mailaddress})
            token = SecureRandom.uuid
            expiry = Time.now + TOKEN_EXPIRY_SEC
            params = {
                mailaddress: mailaddress,
                token: token,
                expiry: expiry,
            }
            if user then
                user.update!(params)
            else
                user = User.create(params)
            end
            user.token
        end

        def resession(token)
            get_authenticated_user(token, StandardError)
        end

        def get_authenticated_user(token, error=MyUnauthorizedError)#=>user
            user = User.find_by({token: token})
            raise error if !user
            raise error if user.expiry < Time.now
            expiry = Time.now + TOKEN_EXPIRY_SEC
            user.update!({expiry: expiry})
            user
        end

    end

end