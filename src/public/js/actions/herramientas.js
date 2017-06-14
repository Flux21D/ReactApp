import axios from "axios";
import {SET_HERRAMIENTAS} from "../actions/types";

export function setHerramientasInfo (content) {
  return {
    type: SET_HERRAMIENTAS,
    content
  };
}

export function getHerramientasInfo (pageNo) {
  let baseUrl = '/api/getcontent/Herramientas';
  let queryParam = '';
  if(pageNo) {
    queryParam = '?page=' + pageNo;
  }

  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let config = {
    headers: {'uid': userInfo.user.uuid, speciality: userInfo.user.professionalData_specialty}
  };

  return dispatch => {
    return axios.get(baseUrl + queryParam, config).then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          // based on index we can decide topBanner or middleBanner and so on...
          if(index === 0) // 0 -> top banner
            bannerObj.topBanner = item;
        });
      }
      dispatch(setHerramientasInfo({
        bannerContent: bannerObj,
        herramientasEvents: response.data['toolContent'] ? response.data['toolContent'] : [],
        totalRecords: response.data['ce_length'] ? Number(response.data['ce_length']) : 1,
        activePageNo: response.data['page'] ? Number(response.data['page']) : 1,
      }));

    }).catch (error => {});
  };

}

export function setHerramientasFav (uid, courseType, herramientasId, url) {
  console.log('set');
  let baseUrl = '/api/saveFav';
  let data = {
            uid: uid,
            type: courseType,
            type_id: herramientasId,
            url: url
        };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

    }).catch (error => { });
  };
}