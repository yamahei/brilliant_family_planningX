外部仕様書:データ構造
===========================

- 過去実装上存在したルール階層のFromToは廃止とし、主体(Entity)と収支項目(Event)の2階層のみにFromToを持たせる。

全体
-----

```mermaid
graph TB
    Rule([ルール])
    Bank([銀行])
    Balance[収支]
    Rule --> Balance
    Bank --> Balance
```

```json
{
    Entities: [],// Entity[]
    Banks: [],// Bank[]
    DefaultBankId: 123,// Number
}
```

ルール
----

### 主体(`Entity`)
```json
{
    Id: 1,// Number,
    SortOrder: 1,// Number
    Name: "カテゴリ",// String,
    Memo: "説明",// String,
    EntityFrom: "2022-05",// String
    EntityTo: "2026-05",// String
    Categories: [],// Category[],
    PresetEntityName: "PresetA:EntityB",// String | Null
    PresetArguments: [],// any[] | Null <-TODO: 色んな型があるので今はまだ決めきれない
}
```

### カテゴリ(`Category`)
```json
{
    Id: 11,// Number,
    SortOrder: 1,// Number
    Name: "カテゴリ",// String,
    Memo: "説明",// String,
    Events: [],// Event[],
    PresetCategoryName: "PresetA:EntityB:CategoryC",// String | Null
}
```

### 収支項目(`Event`)
```json
{
    Id: 111,// Number,
    SortOrder: 1,// Number
    Name: "イベント",// String,
    Memo: "説明",// String,
    EventFrom: "2022-05",// String
    EventTo: "2026-05",// String
    Amount: 1000,// Number,
    BankId: 3,// Number | Null (nullの場合はDefaultBankIdを使用)
    Rules: [],// Rule[],
    PresetEventName: "PresetA:EntityB:CategoryC:EventD"//String | Null
}
```
### ルール(`Rule`)
1. 単年月:特定の年月に1回だけ発生する
   例）突発的な支出（等の記録）
    ```json
    {
        Id: 1111,// Number,
        SortOrder: 1,// Number
        Type: "ONCE_YEARMONTHS",// String
        Not: false// Bool
        YearMonth: "2026-05",// String
        PresetRuleName: "PresetA:EntityB:CategoryC:EventD:Rule1"//String | Null
    }
<!-- SOME_MONTHSで代替できるので不要（廃止）
1. 毎月：毎月発生する
   例）月給
    ```json
    {
        Id: 1112,// Number,
        SortOrder: 1,// Number
        Type: "EVERY_MONTH",// String
        Not: false// Bool
        PresetRuleName: "PresetA:EntityB:CategoryC:EventD:Rule2"//String | Null
    }
    ```
-->
1. 毎年[m]月：毎年特定の月（複数可）に発生する
   例）ボーナス
    ```json
    {
        Id: 1112,// Number,
        SortOrder: 1,// Number
        Type: "SOME_MONTHS",// String
        Not: false //Bool
        Months: [5, 7, 9],// Number[]
        PresetRuleName: "PresetA:EntityB:CategoryC:EventD:Rule3"//String | Null
    }
    ```
1. y年ごと毎年[m]月：y年ごと特定の月（複数可）に発生する
   例）車検
   ※「y年ごと」：`y=1`は毎年と同じ意味、`y=0`はエラー
    ```json
    {
        Id: 1114,// Number,
        SortOrder: 1,// Number
        Type: "SOME_YEARMONTHS",// String
        Not: false //Bool
        StartYear: 2026,// Number,
        YearSteps: 2,// Number,
        Months: [5, 7, 9],// Number[]
        PresetRuleName: "PresetA:EntityB:CategoryC:EventD:Rule4"//String | Null
    }
    ```

### プリセット(`Preset`)
- プリセットを持つ主体を新規作成するときにコピーするデータ
- Idは新規採番
- From-Toはプリセット引数から算出する
```json
{
    Id: 2,// Number,
    Name: "プリセット",// String,
    Memo: "説明",// String,
    Entities: [{
        Id: 21,// Number,
        SortOrder: 1,// Number
        Name: "主体",// String,
        Memo: "説明",// String,
        EntityFrom: "2022-05",// String
        EntityTo: "2026-05",// String
        Categories: [{
            Id: 211,// Number,
            SortOrder: 1,// Number
            Name: "カテゴリ",// String,
            Memo: "説明",// String,
            Events: [{
                Id: 2111,// Number,
                SortOrder: 1,// Number
                Name: "イベント",// String,
                Memo: "説明",// String,
                EventFrom: "2022-05",// String
                EventTo: "2026-05",// String
                Amount: 1000,// Number,
                Rules: [{
                    Id: 21111,// Number,
                    SortOrder: 1,// Number
                    Type: "ONCE_YEARMONTHS",// String
                    Not: false// Bool
                    YearMonth: "2026-05",// String
                    PresetRuleName: "PresetA:EntityB:CategoryC:EventD:Rule1"//String | Null
                }],// Rule[],
                PresetEventName: "PresetA:EntityB:CategoryC:EventD"//String | Null
            }],// Event[],
            PresetCategoryName: "PresetA:EntityB:CategoryC",// String | Null
        }],// Category[],
        PresetEntityName: "PresetA:EntityB",// String | Null
    }],// Entity[],
    PresetName: "PresetA"//String | Null
}
```

### プリセット引数(`PresetArgumentHoge`)
- プリセットのFromToを決定するために必要な情報
- 主体ごとに型が異なる（なので入力フォームも異なる）
```json
//TODO: 色んな型があるので今はまだ決めきれない
```

銀行
----

### 銀行(`Bank`)

- 実際の銀行残高（`ActualLogs`）は、人間が入力するが、毎月必ず入力されることを期待しない
  - ただし、実残高を起点にシミュレートするため、少なくとも1件の実残高が必要であり、それより過去をシミュレートすることはできない
  - そこで銀行を新規作成する際に、必ず実残高を入力することを強制する
- 実残高が入力された月から未来に向かって収支を累積する

```json
{
    Id: 3,// Number,
    Name: "銀行",// String,
    Memo: "説明",// String,
    ActualLogs: [],// ActualLog[]
}
```

### 実残高(`ActualLog`)

- 実際の口座残高は、給料日の前後など、こちらでコントロールできない要因で変化するので、入力された残高は「月末残高」として扱う

```json
{
    Id: 31,// Number,
    YearMonth: "2026-05",// String
    Amount: 10000,// Number
}
```

収支
----

### 収支一覧(`BalanceItems`)

```json
[]// BalanceItem[]
```

### 収支(`BalanceItem`)

```json
{
    EntityId: 1,// Number,
    EntitySortOrder: 1,// Number
    EntityName: "カテゴリ",// String,
    CategoryId: 11,// Number,
    CategorySortOrder: 1,// Number
    CategoryName: "カテゴリ",// String,
    EventId: 111,// Number,
    EventSortOrder: 1,// Number
    EventName: "イベント",// String,
    Balances: [],// Balance[]
}
```

### 収支(`BalanceLog`)

```json
{
    BankId: 3,// Number,
    BankName: "銀行",// String,
    BankMemo: "説明",// String,
    YearMonth: "2026-05",// String
    VirtualAmount: 1000,// Number,
    ActualAmount: 1000,// Number | Null,
}
```
