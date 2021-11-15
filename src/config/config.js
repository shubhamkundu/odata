const { parseIntegerFrom, parseBooleanFrom } = require('./../utils/lib')

module.exports = {
    auth: parseBooleanFrom(process.env.AUTH),
    apiAuthKey: process.env.API_AUTH_KEY || '',
    odataURL: process.env.ODATA_URL || '',
    odataKey: process.env.ODATA_KEY || '',
    filterTypeEqual: process.env.FILTER_TYPE_EQUAL || 'equal',
    filterTypeContain: process.env.FILTER_TYPE_CONTAIN || 'contain',
    cache: parseBooleanFrom(process.env.CACHE),
    stdTTL: parseIntegerFrom(process.env.stdTTL) || 0
};