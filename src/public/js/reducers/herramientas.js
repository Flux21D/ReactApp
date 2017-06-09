import {SET_HERRAMIENTAS} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  herramientasEvents: [],
  totalRecords: 1,
  activePageNo: 1
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_HERRAMIENTAS:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}