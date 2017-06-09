import axios from "axios";
import {SET_CONTACT_US} from "../actions/types";

export function setContactUsInfo (content) {
  return {
    type: SET_CONTACT_US,
    content
  };
}

export function getContactUsInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/Contact').then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          bannerObj.topBanner = item;
        });
      }
      dispatch(setContactUsInfo({
        bannerContent: bannerObj,
        bodyContentLeft: response.data['columns']['contentleft']['contentTextOnly'] ? response.data['columns']['contentleft']['contentTextOnly'] : [],
        bodyContentRight: response.data['columns']['contentRight']['contentTextOnly'] ? response.data['columns']['contentRight']['contentTextOnly'] : []
      }));

    }).catch (error => {});
  };

}
