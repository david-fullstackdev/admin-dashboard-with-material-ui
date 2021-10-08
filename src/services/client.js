import axios, { addAuthorizationHeader } from 'services/axios.js';

export const searchClientsByName = async (name) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/clients/search?name=${name}`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const getClients = async (pageNo) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/clients?size=10&from=${(pageNo - 1) * 10}`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const addClient = async (values) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/client`

    return axios.post(url, values)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const getClient = async (id) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/client/${id}`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const updateClient = async(id, values) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/client/${id}`

    return axios.put(url, values)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const deleteClient = async (id) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/client/${id}`

    return axios.delete(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}