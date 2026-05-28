FROM ruby:3
ENV LANG C.UTF-8

RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs

RUN mkdir -p /app/src
ENV APP_ROOT /app/src
WORKDIR $APP_ROOT

ADD ./src/Gemfile $APP_ROOT/Gemfile
ADD ./src/Gemfile.lock $APP_ROOT/Gemfile.lock
RUN bundle install
# RUN bundle rake db:create
# RUN bundle rake db:migrate

ADD . $APP_ROOT

