import axios from "axios";
import {SET_ABOUT_US} from "../actions/types";

export function setAboutUsInfo (content) {
  return {
    type: SET_ABOUT_US,
    content
  };
}

export function getAboutUsInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/AboutUs').then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          if(index === 0)
            bannerObj.topBanner = item;
          else if(index === 1)
            bannerObj.leftBanner = item;
        });
      }
      dispatch(setAboutUsInfo({
        bannerContent: bannerObj,
        bodyContentLeft: response.data['columns']['contentleft']['imagePath'] ? response.data['columns']['contentleft']['imagePath'] : '',
        bodyContentRight: response.data['columns']['contentRight']['contentTextOnly'] ? response.data['columns']['contentRight']['contentTextOnly'] : []
      }));

    }).catch (error => {});
  };

}
