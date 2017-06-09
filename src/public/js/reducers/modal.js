import { OPEN_MODAL, CLOSE_MODAL } from '../actions/types';

const INITIAL_STATE = {
  Component: null,
  data: {},
  dialogSettings: {
    classes: ""
  }
};

export default (state = INITIAL_STATE, action = {}) => {
  switch(action.type) {
  case OPEN_MODAL:
    state = INITIAL_STATE;// eslint-disable-line no-param-reassign

    return {
      ...state,
      ...action.modal
    };
  case CLOSE_MODAL:
    return INITIAL_STATE;
  default:
    return state;
  }
}