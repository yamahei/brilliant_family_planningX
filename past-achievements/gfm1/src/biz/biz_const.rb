
module Biz
    # const
    MIN_SEC = 60
    HOUR_SEC = MIN_SEC * 60
    DAY_SEC = HOUR_SEC * 24
    WEEK_SEC = DAY_SEC * 7

    # exception for authenticate
    class MyUnauthorizedError < StandardError; end
    class MyMailLockedError < StandardError; end
    class MyInvalidAuthcodeError < StandardError; end
    class MyAuthcodeLockedError < StandardError; end
    # exception for preset
    class InvalidPresetkeyError < StandardError; end
    class InvalidVariablesError < StandardError; end
    class NotImplementError < StandardError; end
end