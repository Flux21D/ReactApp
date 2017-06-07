import axios from "axios";
import {SET_FAQ} from "../actions/types";

export function setFAQInfo (content) {
  return {
    type: SET_FAQ,
    content
  };
}

export function getFAQInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/AskedQuestions').then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          if(index == 0)
            bannerObj.topBanner = item;
          else if(index == 1)
            bannerObj.footerBanner = item;
        });
      }
      dispatch(setFAQInfo({
        bannerContent: bannerObj,
        questions: response.data['faq'] ? response.data['faq'] : []
      }));

    }).catch (error => {});
  };

}
