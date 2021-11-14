module.exports = {
    odataURL: process.env.ODATA_URL || '',
    odataKey: process.env.ODATA_KEY || '',
    filterTypeEqual: process.env.FILTER_TYPE_EQUAL || 'equal',
    filterTypeContain: process.env.FILTER_TYPE_CONTAIN || 'contain'
};