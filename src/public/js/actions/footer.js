import axios from "axios";
import {SET_FOOTER} from "../actions/types";
import {SET_TERMS} from "../actions/types";

export function setFooterInfo (footer) {
  return {
    type: SET_FOOTER,
    footer
  };
}

export function setTermsInfo (footerTerms) {
  return {
    type: SET_TERMS,
    footerTerms
  };
}

function extractTermsInfo(val)
{
  return val['identifier'] ? {'title':val['someShortText'] , 'description':val['someLontText']} : null
}

export function getFooterInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/Index').then(response => {
      dispatch(setFooterInfo({
        copyrightText: response.data['footerContent'] ? response.data['footerContent'] : '',
        footerLinks: response.data['footerLinks'] ? response.data['footerLinks'] : [],
        introContent: response.data['contentTextOnly'] ? response.data['contentTextOnly'] : []
      }));

    }).catch (error => {});
  };

}

export function getTermsInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/Terms').then(response => {
      const termsObj = response.data.map(extractTermsInfo);
      dispatch(setTermsInfo({
        TermsContent: termsObj
      }));

    }).catch (error => {});
  };

}