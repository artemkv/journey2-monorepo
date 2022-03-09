## Create journey2app table

```
aws dynamodb create-table --table-name journey2app --attribute-definitions AttributeName=Key,AttributeType=S AttributeName=SortKey,AttributeType=S --key-schema AttributeName=Key,KeyType=HASH AttributeName=SortKey,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 --endpoint-url http://localhost:8000 --profile=localdynamo
```

## Create journey2stats table

```
aws dynamodb create-table --table-name journey2stats --attribute-definitions AttributeName=Key,AttributeType=S AttributeName=SortKey,AttributeType=S --key-schema AttributeName=Key,KeyType=HASH AttributeName=SortKey,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 --endpoint-url http://localhost:8000 --profile=localdynamo
```

## Table journey2app structure

```
Key         SortKey
APP#aid     APP#aid
```

## Table journey2stats structure

```
Key                                         SortKey                    Cnt
"USER_VISITS_BY_HOUR#aid#uid"               yyyyMMddHH
"USER_VISITS_BY_DAY#aid#uid"                yyyyMMdd
"USER_VISITS_BY_MONTH#aid#uid"              yyyyMM

"UNIQUE_USERS_BY_HOUR#aid"                  yyyyMMddHH
"UNIQUE_USERS_BY_DAY#aid"                   yyyyMMdd
"UNIQUE_USERS_BY_MONTH#aid"                 yyyyMM
```

