import {handleActions} from "redux-actions";
import {authConstants} from "../_constants";
import {States} from "../_helpers/config";

const initialState = {
    state: States.NOT_ASKED,
    user: {}
};

export const user = handleActions({
    [authConstants.LOGIN_REQUEST]: (state) => ({
        ...state,
        state: States.LOADING
    }),
    [authConstants.LOGIN_SUCCESS]: (state, {payload}: any) => ({
        ...state,
        state: States.LOADED,
        user: payload
    }),
    [authConstants.LOGIN_FAILURE]: (state) => ({
        ...state,
        state: States.FAILURE,
        user: {}
    }),
    [authConstants.LOGOUT]: () => ({
        state: States.NOT_ASKED,
        user: {}
    })
}, initialState);
