import axios from "axios";
import {SET_HOME_PAGE, SET_HOME_CALENDARIO} from "../actions/types";

export function setHomePageInfo (content) {
  return {
    type: SET_HOME_PAGE,
    content
  };
}

export function setHomeCalendarioInfo (content) {
  return {
    type: SET_HOME_CALENDARIO,
    content
  };
}

export function getHomePageInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/Home').then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          if(index === 0)
            bannerObj.topBanner = item;
          else if(index === 1)
            bannerObj.middleBanner = item;
        });
      }

      dispatch(setHomePageInfo({
        bannerContent: bannerObj,
        herramientasContent: response.data['shorttext'] ? response.data['shorttext'] : [],
        searchPanel: response.data['searchPanel'] ? response.data['searchPanel'] : []
      }));

    }).catch (error => {});
  };

}

export function getHomeCalendarioInfo (isHome) {
  let baseUrl = '/api/getcontent/Calendar';
  let queryParam = '?isHome=' + isHome;

  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let config = {
    headers: {'uid': userInfo.user.uuid, speciality: userInfo.user.professionalData_specialty, isdelegate: false}
  };

  return dispatch => {
    return axios.get(baseUrl + queryParam, config).then(response => {

      dispatch(setHomeCalendarioInfo({
        homeCalEvents: response.data['eventBox'] ? response.data['eventBox'] : []
      }));

    }).catch (error => {});
  };
}

export function setHomeFavEvents (uid, eventType, eventId) {
  let baseUrl = '/api/saveFav';
  let data = {
            uid: uid,
            type: eventType,
            type_id: eventId
        };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

    }).catch (error => { });
  };

}

export function downloadICSFile (uid, eve, callback) {
  let baseUrl = '/api/geticsfile';
  let data = {
            uid: uid,
            eventObj: eve
        };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {
      
      if(response.response && response.response.status === 404)
        callback("error", null);
      else
        callback(null, response.data);
    })
    .catch (error => { 
      callback(error, null);
    });
  };

}