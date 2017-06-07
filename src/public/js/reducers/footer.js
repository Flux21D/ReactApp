import {SET_FOOTER} from "../actions/types";
import {SET_TERMS} from "../actions/types";

const INITIAL_STATE = {
  introContent: [],
  copyrightText: '',
  footerLinks: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_FOOTER:
    return {
      ...state,
      ...action.footer
    };
  case SET_TERMS:
    return {
      ...state,
      ...action.footerTerms
    };
  default:
    return state;
  }

}