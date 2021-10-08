import {
    SET_ORDER_INFO,
    SET_ORDER_PICKUP_LOCATION,
    SET_ORDER_DELIVERY_LOCATION,
    SET_ORDER_PRICE,
    SET_USER_INFO,
    SET_GLOBAL_LOADING
} from '../actionTypes';

import store from 'store'


const INIT_STATE = {   
    userInfo: store.get('user_info')?JSON.parse(store.get('user_info')):null,
    orderInfo: store.get('order_info')?JSON.parse(store.get('order_info')):null,
    order_pickupLocation: store.get('order_pickupLocation')?JSON.parse(store.get('order_pickupLocation')):null,
    order_deliveryLocation: store.get('order_deliveryLocation')?JSON.parse(store.get('order_deliveryLocation')):null,
    orderPrice: store.get('order_price')?JSON.parse(store.get('order_price')):null,
    global_loading: false
};


export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case SET_GLOBAL_LOADING:
            return {
                ...state,
                global_loading: action.payload,
            }

        case SET_USER_INFO:
            store.set('user_info', JSON.stringify(action.payload));
            return {
                ...state,
                userInfo: action.payload,
            }

        case SET_ORDER_INFO:
            store.set('order_info', JSON.stringify(action.payload));
            return {
                ...state,
                orderInfo: action.payload,
            }

        case SET_ORDER_PICKUP_LOCATION:
            store.set('order_pickupLocation', JSON.stringify(action.payload));
            return {
                ...state,
                order_pickupLocation: action.payload,
            }
        
        case SET_ORDER_DELIVERY_LOCATION:
            store.set('order_deliveryLocation', JSON.stringify(action.payload));
            return {
                ...state,
                order_deliveryLocation: action.payload,
            }

        case SET_ORDER_PRICE:
            store.set('order_price', JSON.stringify(action.payload));
            return {
                ...state,
                orderPrice: action.payload,
            }

        default:
            return state;
    }
}