import {SET_CALENDARIO} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  calendarEvents: [],
  searchParams: {},
  totalRecords: 1,
  activePageNo: 1
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CALENDARIO:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}