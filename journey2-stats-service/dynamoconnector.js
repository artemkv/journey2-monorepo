var AWS = require("aws-sdk");

const JOURNEY2_APP_TABLE = "journey2app"
const JOURNEY2_STATS_TABLE = "journey2stats"

const appExists = async (acc, aid, client) => {
    return await keyExists(client, JOURNEY2_APP_TABLE, `APP#${acc}`, aid);
}

const updateUserStats = async (action, hourDt, dayDt, monthDt, client) => {
    let userHourKey = `USER_VISITS_BY_HOUR#${action.aid}#${action.uid}`;
    let userDayKey = `USER_VISITS_BY_DAY#${action.aid}#${action.uid}`;
    let userMonthKey = `USER_VISITS_BY_MONTH#${action.aid}#${action.uid}`;

    let userVisitsByHour = await incrementCounter(client, JOURNEY2_STATS_TABLE, userHourKey, hourDt);
    let userVisitsByDay = await incrementCounter(client, JOURNEY2_STATS_TABLE, userDayKey, dayDt);
    let userVisitsByMonth = await incrementCounter(client, JOURNEY2_STATS_TABLE, userMonthKey, monthDt);

    let hourKey = `UNIQUE_USERS_BY_HOUR#${action.aid}`;
    let dayKey = `UNIQUE_USERS_BY_DAY#${action.aid}`;
    let monthKey = `UNIQUE_USERS_BY_MONTH#${action.aid}`;

    if (userVisitsByHour === 1) {
        await incrementCounter(client, JOURNEY2_STATS_TABLE, hourKey, hourDt);
    }
    if (userVisitsByDay === 1) {
        await incrementCounter(client, JOURNEY2_STATS_TABLE, dayKey, dayDt);
    }
    if (userVisitsByMonth === 1) {
        await incrementCounter(client, JOURNEY2_STATS_TABLE, monthKey, monthDt);
    }
}

exports.getConnector = () => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options.region = 'localhost'
        options.endpoint = 'http://localhost:8000'
    }
    var client = new AWS.DynamoDB.DocumentClient(options);

    return {
        appExists: async (acc, aid) => {
            return await appExists(acc, aid, client);
        },
        updateUserStats: async (action, hourDt, dayDt, monthDt) => {
            return await updateUserStats(action, hourDt, dayDt, monthDt, client);
        }
    }
}

// Atomically increments the value of the attribute "Cnt"
// and returns the new value
async function incrementCounter(client, tableName, key, sortKey) {
    var params = {
        TableName: tableName,
        Key: {
            "Key": key,
            "SortKey": sortKey
        },
        UpdateExpression: 'SET #val = if_not_exists(#val, :zero) + :incr',
        ExpressionAttributeNames: {
            '#val': 'Cnt'
        },
        ExpressionAttributeValues: {
            ':incr': 1,
            ':zero': 0
        },
        ReturnValues: "UPDATED_NEW"
    };

    return new Promise((resolve, reject) => {
        client.update(params, function (err, data) {
            if (err) {
                reject(`Unable to update ${tableName} table, key ${key}. Error JSON: ${JSON.stringify(err)}`);
            } else {
                resolve(data.Attributes.Cnt);
            }
        });
    });
}

// Checks whether the specified key can be found in the stats table
async function keyExists(client, tableName, key, sortKey) {
    var params = {
        TableName: tableName,
        Key: {
            "Key": key,
            "SortKey": sortKey
        },
        AttributesToGet: [
            'Key'
        ]
    };

    return new Promise((resolve, reject) => {
        client.get(params, function (err, data) {
            if (err) {
                reject(`Unable to check existence of the key in '${tableName}' table, key '${key}'. Error JSON: ${JSON.stringify(err)}`);
            } else {
                let exists = false
                if (data.Item !== undefined && data.Item !== null) {
                    exists = true
                }
                resolve(exists);
            }
        });
    });
}