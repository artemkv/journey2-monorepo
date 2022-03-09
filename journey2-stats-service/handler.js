const { processAction } = require("./statsprocessor");
const { getConnector } = require("./dynamoconnector")

exports.consume = async function (event, context) {
    dynamoConnector = getConnector();

    for (const record of event.Records) {
        try {
            let { body } = record;
            let action = JSON.parse(body);
            await processAction(action, dynamoConnector);
        } catch (err) {
            console.warn(err);
        }
    }
}