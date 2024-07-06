import activityLog from "../models/activityLog.js"

export const activityLogger = (event, user, ip, meta) => {
    activityLog.create({ event, user, ip, meta });
}