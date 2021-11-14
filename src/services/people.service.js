const axios = require('axios');
const { response } = require('express');
const config = require('./../config/config');

const peopleURL = `${config.odataURL}/people`;
const peopleURLWithKey = `${config.odataURL}/${config.odataKey}/people`;
const headers = { 'Content-Type': 'application/json' };

module.exports = {
    getPeopleData: () => new Promise(async (resolve, reject) => {
        try {
            const peopleList = await axios.get(peopleURL);
            resolve({ count: peopleList.data.value.length, result: peopleList.data.value });
        } catch (err) {
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error fetching people details: ${err}`
            });
        }
    }),

    searchPeopleByUserName: (q) => new Promise(async (resolve, reject) => {
        if (typeof q !== 'string') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide a string value for 'q' as request parameter`
            });
        }

        try {
            const peopleList = await axios.get(`${peopleURL}('${q}')`);
            delete peopleList.data['@odata.context'];
            resolve({ result: peopleList.data });
        } catch (err) {
            if (err.response.status === 404) {
                return reject({
                    statusCode: 404,
                    errorMessage: `'${q}' did not match any record!`
                });
            }
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error searching people with '${q}': ${err}`
            });
        }
    }),

    searchPeople: (q) => new Promise(async (resolve, reject) => {
        if (typeof q !== 'string') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide a string value for 'q' as request parameter`
            });
        }

        try {
            const searchUserNamePromise = axios.get(`${peopleURL}?$filter=contains(UserName, '${q.toLowerCase()}')`);
            const searchFirstNamePromise = axios.get(`${peopleURL}?$filter=contains(FirstName, '${q}')`);
            const searchFirstNamePromise2 = axios.get(`${peopleURL}?$filter=contains(FirstName, '${q.toLowerCase()}')`);
            const searchFirstNamePromise3 = axios.get(`${peopleURL}?$filter=contains(FirstName, '${q[0].toUpperCase()}${q.substring(1).toLowerCase()}')`);
            const searchLastNamePromise = axios.get(`${peopleURL}?$filter=contains(LastName, '${q}')`);
            const searchLastNamePromise2 = axios.get(`${peopleURL}?$filter=contains(LastName, '${q.toLowerCase()}')`);
            const searchLastNamePromise3 = axios.get(`${peopleURL}?$filter=contains(LastName, '${q[0].toUpperCase()}${q.substring(1).toLowerCase()}')`);
            const searchMiddleNamePromise = axios.get(`${peopleURL}?$filter=contains(LastName, '${q}')`);
            const searchMiddleNamePromise2 = axios.get(`${peopleURL}?$filter=contains(LastName, '${q.toLowerCase()}')`);
            const searchMiddleNamePromise3 = axios.get(`${peopleURL}?$filter=contains(LastName, '${q[0].toUpperCase()}${q.substring(1).toLowerCase()}')`);

            const axiosRes = await Promise.allSettled([
                searchUserNamePromise,
                searchFirstNamePromise, searchFirstNamePromise2, searchFirstNamePromise3,
                searchLastNamePromise, searchLastNamePromise2, searchLastNamePromise3,
                searchMiddleNamePromise, searchMiddleNamePromise2, searchMiddleNamePromise3
            ]);

            let response = [];

            for (let i = 0; i < axiosRes.length; i++) {
                const res = axiosRes[i];
                if (res.status === 'fulfilled') {
                    delete res.value?.data['@odata.context'];
                    response = [...response, ...res.value.data.value];
                }
            }

            response = response.filter((p, i, arr) => arr.map(p1 => p1.UserName).indexOf(p.UserName) === i);
            resolve({ q, count: response.length, result: response });
        } catch (err) {
            if (err.response.status === 404) {
                return reject({
                    statusCode: 404,
                    errorMessage: `'${q}' did not match any record!`
                });
            }
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error searching people with '${q}': ${err}`
            });
        }
    }),

    filterPeople: (reqQuery) => new Promise(async (resolve, reject) => {
        const allowedFilterTypes = [config.filterTypeEqual, config.filterTypeContain];
        if (typeof reqQuery.type !== 'string' || reqQuery.type.trim() === '') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide a string value for 'type' in request query.`
            });
        }
        reqQuery.type = reqQuery.type.toLowerCase();
        if (!allowedFilterTypes.includes(reqQuery.type)) {
            return reject({
                statusCode: 400,
                errorMessage: `'${reqQuery.type}' is not a valid value for 'type' in request query, Valid values are: '${allowedFilterTypes}'.`
            });
        }
        if (typeof reqQuery.property !== 'string' || reqQuery.property.trim() === '') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide a string value for 'property' in request query.`
            });
        }
        if (typeof reqQuery.value !== 'string' || reqQuery.value.trim() === '') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide a string value for 'value' in request query.`
            });
        }

        try {
            let filterPromise, filterPromise2, filterPromise3;
            if (reqQuery.type === 'equal') {
                filterPromise = axios.get(`${peopleURL}?$filter=${reqQuery.property} eq '${reqQuery.value}'`);
                filterPromise2 = axios.get(`${peopleURL}?$filter=${reqQuery.property} eq '${reqQuery.value.toLowerCase()}'`);
                filterPromise3 = axios.get(`${peopleURL}?$filter=${reqQuery.property} eq '${reqQuery.value[0].toUpperCase()}${reqQuery.value.substring(1).toLowerCase()}'`);
            } else if (reqQuery.type === 'contain') {
                filterPromise = axios.get(`${peopleURL}?$filter=contains(${reqQuery.property}, '${reqQuery.value}')`);
                filterPromise2 = axios.get(`${peopleURL}?$filter=contains(${reqQuery.property}, '${reqQuery.value.toLowerCase()}')`);
                filterPromise3 = axios.get(`${peopleURL}?$filter=contains(${reqQuery.property}, '${reqQuery.value[0].toUpperCase()}${reqQuery.value.substring(1).toLowerCase()}')`);
            }

            const axiosRes = await Promise.allSettled([filterPromise, filterPromise2, filterPromise3]);

            let response = [];

            for (let i = 0; i < axiosRes.length; i++) {
                const res = axiosRes[i];
                if (res.status === 'fulfilled') {
                    delete res.value?.data['@odata.context'];
                    response = [...response, ...res.value.data.value];
                }
            }

            response = response.filter((p, i, arr) => arr.map(p1 => p1.UserName).indexOf(p.UserName) === i);
            resolve({ filterOptions: reqQuery, count: response.length, result: response });
        } catch (err) {
            if (err.response.status === 404) {
                return reject({
                    statusCode: 404,
                    errorMessage: `'${q}' did not match any record!`
                });
            }
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error searching people with '${q}': ${err}`
            });
        }
    }),

    createPeople: (body) => new Promise(async (resolve, reject) => {
        // validations to do

        try {
            const response = await axios.post(peopleURLWithKey, body, { headers });
            resolve({ response: response.data });
        } catch (err) {
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error fetching people details: ${err}`
            });
        }
    }),

    updatePeople: (userName, body) => new Promise(async (resolve, reject) => {
        // validations to do

        try {
            const response = await axios.post(`${peopleURLWithKey}('${userName}')`, body, { headers });
            delete response.data['@odata.context'];
            resolve({ response: response.data });
        } catch (err) {
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error fetching people details: ${err}`
            });
        }
    }),

    removePeople: (userName) => new Promise(async (resolve, reject) => {
        // validations to do

        try {
            const response = await axios.post(peopleURLWithKey, body, { headers });
            resolve({ response: response.data });
        } catch (err) {
            reject({
                statusCode: err.response.status || 500,
                errorMessage: `Error fetching people details: ${err}`
            });
        }
    })
};