import axios from "axios";
import {SET_CURSOS_DETAILS, SET_CURSOS_MODULO, SET_CURSOS_MATERIAL} from "../actions/types";

export function setCursosDetailsInfo (content) {
  return {
    type: SET_CURSOS_DETAILS,
    content
  };
}

export function setCursosModulo (content) {
  return {
    type: SET_CURSOS_MODULO,
    content
  };
}

export function setCursosMaterial (content) {
  return {
    type: SET_CURSOS_MATERIAL,
    content
  };
}

export function getCursosDetailsInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/CursosDetails').then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          // based on index we can decide topBanner or middleBanner and so on...
          if(index === 0) // 0 -> top banner
            bannerObj.topBanner = item;
        });
      }
      dispatch(setCursosDetailsInfo({
        bannerContent: bannerObj,
        courseDetails: response.data['columns']['contentleft']['contentTextOnly'] ? response.data['columns']['contentleft']['contentTextOnly'] : [],
        courseModules: response.data['columns']['contentleft']['CourseModule'] ? response.data['columns']['contentleft']['CourseModule'] : [],
        courseTools: response.data['columns']['contentRight']['contentTextOnly'] ? response.data['columns']['contentRight']['contentTextOnly'] : []
      }));

    }).catch (error => {});
  };

}

export function getCursosModulo (sysIds) {
  let baseUrl = '/api/getsubcontent';
  let data = {
      content: sysIds
    };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

      dispatch(setCursosModulo({
        coursoModulo: response.data ? response.data : [],
      }));

    }).catch (error => {});
  };

}

export function sendTutorialsMail (fromail, tomail, msgSub, msgBody) {
  let baseUrl = '/api/sendmail';
  let data = {
            fromail: fromail,
            ccmail: tomail,
            subject: msgSub,
            message: msgBody
        };
        
  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

    }).catch (error => { });
  };

}

export function setCursoRegister (uid, timeStamp, cid) {
  let baseUrl = '/api/couseRegister';
  let data = {
            uid: uid,
            timeStamp: timeStamp,
            cid: cid
        };
        
  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

    }).catch (error => { });
  };

}

export function getCursosMaterial (sysIds) {
  let baseUrl = '/api/getsubcontent';
  let data = {
      content: sysIds
    };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

      dispatch(setCursosMaterial({
        coursoMaterial: response.data ? response.data : []
      }));

    }).catch (error => {});
  };

}