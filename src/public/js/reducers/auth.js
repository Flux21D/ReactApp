import {
    SET_CURRENT_USER,
    REMOVE_CURRENT_USER,
    SET_AUTH_ERRORS,
    REMOVE_AUTH_ERRORS,
    REMOVE_NEW_USER,
    UPDATE_CURRENT_USER
} from '../actions/types';
import extend from "lodash/extend";
import removeNewUser from "../utils/new-user";

const sessionAuthData = JSON.parse(sessionStorage.getItem('auth'));
const authToken = sessionAuthData ? sessionAuthData.accessToken : null;
const initialState = {
  accessToken: authToken,
  user: {
    uuid: '',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    speciality: '',
    postalCode: '',
    contactConsent: false
  },
  errors: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
  case SET_CURRENT_USER:
    return {
      ...state,
      ...action.data
    };
  case UPDATE_CURRENT_USER:
    const user = extend(state.user, action.data);

    return {
      ...state, user
    };
  case REMOVE_CURRENT_USER:
    return {
      ...state,
      ...initialState
    };
  case SET_AUTH_ERRORS:
    return {
      ...state,
      ...action.errors
    };
  case REMOVE_AUTH_ERRORS:
    state.errors = {};
    return state;
  case REMOVE_NEW_USER:
    state.isNew = false;
    removeNewUser();
    return state;
  default:
    return state;
  }
}