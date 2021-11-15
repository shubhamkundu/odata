module.exports = ({ appCache }) => ({
    people: require('./people.service')({ appCache })
});