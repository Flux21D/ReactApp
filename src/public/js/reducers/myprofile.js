import {SET_MY_PROFILE, SET_PROFILE_NOTIFICATION} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  specialityCourses: [],
  userCalender: [],
  completedCourse: [],
  ongoingEnrolled: [],
  favCourse: [],
  favTools: [],
  notifications: [],
  totalRecords: 1,
  activePageNo: 1
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_MY_PROFILE:
    return {
      ...state,
      ...action.content
    };
  case SET_PROFILE_NOTIFICATION:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}