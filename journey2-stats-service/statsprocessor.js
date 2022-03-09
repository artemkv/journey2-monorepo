const statsFunctions = require("./statsfunc");

exports.processAction = async (action, dynamoConnector) => {
    // Structural validation
    let validationResult = statsFunctions.validateAction(action);
    if (validationResult.error) {
        throw new Error(validationResult.error);
    }

    // Check with database
    if (!await dynamoConnector.appExists(action.acc, action.aid)) {
        throw new Error(`Application '${action.aid}' for account '${action.acc}' does not exist`);
    }

    let hourDt = statsFunctions.getHourDt(action.dts);
    let dayDt = statsFunctions.getDayDt(action.dts);
    let monthDt = statsFunctions.getMonthDt(action.dts);

    // Update user stats
    await dynamoConnector.updateUserStats(action, hourDt, dayDt, monthDt);
}
