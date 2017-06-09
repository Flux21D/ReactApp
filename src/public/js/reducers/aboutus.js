import {SET_ABOUT_US} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  bodyContentLeft: '',
  bodyContentRight: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_ABOUT_US:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}