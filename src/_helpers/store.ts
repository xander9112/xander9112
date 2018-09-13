import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
// import {createLogger} from "redux-logger";
import rootReducer from "../_reducers";

declare global {
    // tslint:disable-next-line
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

// window.__REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__;


// const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(
        thunkMiddleware,
        // loggerMiddleware
    )
);
