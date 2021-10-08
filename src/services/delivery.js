import axios, { addAuthorizationHeader } from 'services/axios.js';

export const getDeliveries = async (id) => {
    await addAuthorizationHeader();
    const url = id?`https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/deliveries?client=${id}`:
                    `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/deliveries`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const getDelivery = async (id) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/delivery/${id}`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const cancelDelivery = async (id) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/delivery/${id}/cancel`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const deleteDelivery = async (id) => {
    await addAuthorizationHeader();
    const url = `https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/delivery/${id}`

    return axios.delete(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}