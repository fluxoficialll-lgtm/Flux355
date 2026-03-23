import {
    requestLoggerMiddleware,
    applicationLogger,
    controllerLogger,
    serviceLogger,
    databaseLogger
} from './Log.Core.js';

const Log = {
    requestLoggerMiddleware,
    application: applicationLogger,
    controller: controllerLogger,
    service: serviceLogger,
    database: databaseLogger,
};

export default Log;
