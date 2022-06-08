import { configureStore, } from "@reduxjs/toolkit";
import {combineReducers, applyMiddleware} from 'redux';
import ThunkMiddleware from "redux-thunk";
import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
// import { composeWithDevTools } from "@redux-devtools/extension";
import logger from 'redux-logger'
import cartItems from "./Reducers/cartItem";

// const reducers = combineReducers({
//     cartItems: cartItems,
// })

export const store = configureStore({
    reducer: { cartItems: cartItems},
    middleware: [thunk, logger],
});

// export default store;