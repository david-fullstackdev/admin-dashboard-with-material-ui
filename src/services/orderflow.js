import axios, { addAuthorizationHeader } from 'services/axios.js';


export const getLatLngFromAddress = (address, city, state, zipcode) => {
    const url = `http://dev.seraffinity.com:5001/geo/geolocate?address=${address}&city=${city}&state=${state}&postalcode=${zipcode}`

    return axios.get(url)
            .then(result => result.data)
            .catch(err => {throw err} );
}

export const getPrices = (pickup_state, pickupLocation, deliveryLocation) => {
    let params = {
        pickup_state: pickup_state,
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation
    };

    return axios.post('https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/orderflow/getprices', params)
        .then(result => result.data)
        .catch(err => {throw err} );
}

export const orderDelivery = async (orderInfo, pickupLocation, deliveryLocation, orderPrice) => {
    await addAuthorizationHeader();

    let params = {
        order_info: orderInfo,
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation,
        price_info: orderPrice
    };

    return axios.post('https://ylj0psa1e7.execute-api.us-west-2.amazonaws.com/orderflow/orderdelivery', params)
        .then(result => result.data)
        .catch(err => {throw err} );
}