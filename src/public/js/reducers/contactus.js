import {SET_CONTACT_US} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  bodyContentLeft: [],
  bodyContentRight: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CONTACT_US:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}