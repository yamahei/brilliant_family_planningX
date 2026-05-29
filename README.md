brilliant_family_planningX
明るい家族計画👨‍👩‍👧‍👦
============================

これはなに？
-----------

- 家庭の収支を入力、未来の銀行残高を予測して、未来に備えるためのツール
- Webアプリだが、データはブラウザのIndexedDBに保存される（API通信なしのSPA）
- 過去何度か開発して、毎回頓挫しているので、今度こそ完成させる

外部仕様・概要設計
----------------

### 仕様書
- 要件
  - [機能要件](./design/requirements/functional.md)
  - [非機能要件](./design/requirements/non-functional.md)
- 外部仕様
  - [ビジネスロジック](./design/external_design/business-logic.md)
  - [データ構造](./design/external_design/data-structure.md)
  - [UI](./design/external_design/user-interface.md)
- 品質管理（QA）
  - [コアロジック](./design/QA/core-logic.md)
  - [ビジネスロジック](./design/QA/business-logic.md)
  - [UI](./design/QA/user-interface.md)

### 参考：過去の成果（未完）

#### 過去頓挫①: [brilliant_family_planning](https://github.com/yamahei/brilliant_family_planning)
- submoduleとして`gfm1/`にclone
- rubyで作った最初のバージョン
- `Biz::Rule`でコアロジックを開発済み（自動テストも実装済み）
- `make_preset_query.rb`で登場人物ごとに必要なルールの自動作成ロジックを実装中（未完）
  - ルールの自動作成に必要な情報（入力）も定義
  - `gfm3/`では実装できていない
- UIが気に入らなくてやめちゃった

#### 過去頓挫② [brilliant_family_planning3](https://github.com/yamahei/brilliant_family_planning3)
- submoduleとして`gfm3/`にclone
- SPA化したくて（ビジネスロジックも）TypeScriptで再実装
- `biz/lib/rule`でコアロジックを開発済み（自動テストも実装済み）
- 銀行の構造に迷って手が止まった
- UIも決めきれないまま中途半端な状態で放置


方針
----
- コアロジックを固めた上で、周辺機能（UI、プリセット）を検討（試行錯誤）する
  - 変更は常に1レイヤーずつ行う（ビジネスロジック～UIに渡るような変更は許容しない）
- 先にゴール（ドキュメント）を定めてから実装を行う
  - ドキュメントとの整合を実装の完成条件とする

