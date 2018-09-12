import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
// import {alert} from "./alert.reducer";


const rootReducer = combineReducers({
    form: formReducer
});

export default rootReducer;
