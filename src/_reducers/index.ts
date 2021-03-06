import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {user} from "./user.reducer";


const rootReducer = combineReducers({
    form: formReducer,
    user
});

export default rootReducer;
