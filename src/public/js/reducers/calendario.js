import { SET_CALENDARIO, SET_COUNTRY_CITY } from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  calendarEvents: [],
  searchParams: {},
  totalRecords: 1,
  activePageNo: 1,
  searchPanel: [],
  countryCityObj: null
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CALENDARIO:
    return {
      ...state,
      ...action.content
    };
  case SET_COUNTRY_CITY:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}