import {SET_CURRENT_USER} from "../actions/types";
import extend from "lodash/extend";

const initialState = {
    accessToken: null,
    user: {
        username: '',
        password: ''
    },
    errors: {}
}

export default (state = initialState, action={}) => {
    switch(action.type){
        case SET_CURRENT_USER:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}