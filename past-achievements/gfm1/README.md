Brilliant family planning👨‍👩‍👧‍👦
===

Estimate long-term household.

Local enviroment(Docker)
---

### General

#### init
```sh
# create empty entities before.
mkdir -p ./postgres/data #empty but required, first.
touch ./src/Gemfile.lock #empty but required, first.
```
#### build and start
```sh
docker-compose build; docker-compose up -d; docker-compose ps
# open -> http://localhost/
```
#### cleanup
```sh
docker system prune -f
```

### app - web server
#### into the app
```sh
docker-compose exec app bash
# exec irb
bundle exec irb
> require "./app.rb"
> require "./biz/biz.rb"
> Biz.auth.send_authcode("a@b.com")
> user = User.first
> sections = Biz.rule.get_sections(user)
```
#### log -f
```sh
docker logs -f $(docker ps | grep app | gawk '{print $1}')
```
#### insert preset records
```sh
docker-compose exec app bash
bundle exec ruby ./bin/make_preset_query.rb
^C #TODO: run sinatra...
exit
```

### postgres - db server
#### into the db
```sh
docker-compose exec db psql -U postgres lifeplan
```
#### log -f
```sh
docker logs -f $(docker ps | grep postgres | gawk '{print $1}')
```


Global enviroment(Hosting)
---

- Azure
  - [App Service](https://azure.microsoft.com/ja-jp/products/app-service/)
  - [Azure Cosmos DB](https://azure.microsoft.com/ja-jp/products/cosmos-db)
    - PostgreSQL利用可能、永続無料枠あり
