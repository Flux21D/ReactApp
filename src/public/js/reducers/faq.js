import {SET_FAQ} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  questions: [],
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_FAQ:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}