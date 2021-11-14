const service = require('./../services/index');
const { handleResponseDefault, handleAPIError } = require('./../utils/lib');

module.exports = ({ app }) => {
    app.get('/people', (req, res) => {
        service.people.getPeopleData()
            .then(handleResponseDefault.bind(null, req, res))
            .catch(handleAPIError.bind(null, req, res));
    });

    app.get('/people/search/username/:q', (req, res) => {
        service.people.searchPeopleByUserName(req.params.q)
            .then(handleResponseDefault.bind(null, req, res))
            .catch(handleAPIError.bind(null, req, res));
    });

    app.get('/people/search/:q', (req, res) => {
        service.people.searchPeople(req.params.q)
            .then(handleResponseDefault.bind(null, req, res))
            .catch(handleAPIError.bind(null, req, res));
    });

    app.get('/people/filter', (req, res) => {
        service.people.filterPeople(req.query)
            .then(handleResponseDefault.bind(null, req, res))
            .catch(handleAPIError.bind(null, req, res));
    });
};