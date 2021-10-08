import {
    SET_ORDER_INFO,
    SET_ORDER_PICKUP_LOCATION,
    SET_ORDER_DELIVERY_LOCATION,
    SET_ORDER_PRICE,
    SET_USER_INFO,
    SET_GLOBAL_LOADING
} from '../actionTypes';

export function setGlobalLoading(data) {
    return {
        type: SET_GLOBAL_LOADING,
        payload: data
    }; 
}

export function setUserInfo(data) {
    return {
        type: SET_USER_INFO,
        payload: data
    }; 
}

export function setOrderInfo(data) {
    return {
        type: SET_ORDER_INFO,
        payload: data
    }; 
}

export function setOrderPickupLocation(data) {
    return {
        type: SET_ORDER_PICKUP_LOCATION,
        payload: data
    }; 
}

export function setOrderDeliveryLocation(data) {
    return {
        type: SET_ORDER_DELIVERY_LOCATION,
        payload: data
    }; 
}

export function setOrderPrice(data) {
    return {
        type: SET_ORDER_PRICE,
        payload: data
    }; 
}