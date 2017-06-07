import {SET_CURSOS_TUTORIALS} from "../actions/types";

const INITIAL_STATE = {
  courseTutorials: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CURSOS_TUTORIALS:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}