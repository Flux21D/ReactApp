import {SET_HOME_PAGE, SET_HOME_CALENDARIO} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  herramientasContent: [],
  homeCalEvents: [],
  searchPanel: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_HOME_PAGE:
    return {
      ...state,
      ...action.content
    };
  case SET_HOME_CALENDARIO:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}