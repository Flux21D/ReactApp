import axios from "axios";
import {SET_CURSOS, SET_FAV_CURSOS, SET_PROFILE_CURSOS_DETAILS} from "../actions/types";
const extend = require("lodash").extend;

export function setCursosInfo (content) {
  return {
    type: SET_CURSOS,
    content
  };
}

export function saveFavCursos (content) {
  return {
    type: SET_FAV_CURSOS,
    content
  };
}

export function setProfileCursosDetail (content) {
  return {
    type: SET_PROFILE_CURSOS_DETAILS,
    content
  };
}

export function getCursosInfo (pageNo, searchObj) {
  let baseUrl = '/api/getcontent/coursePage';
  let queryParam = '';
  if(pageNo)
    queryParam = queryParam + (queryParam === '' ? ('?page=' + pageNo) : '&page=' + pageNo);
  if(searchObj && searchObj.keyword)
    queryParam = queryParam + (queryParam === '' ? ('?keyword=' + searchObj.keyword) : '&keyword=' + searchObj.keyword);
  if(searchObj && searchObj.courseType)
    queryParam = queryParam + (queryParam === '' ? ('?courseType=' + searchObj.courseType) : '&courseType=' + searchObj.courseType);
  if(searchObj && searchObj.accreditation)
    queryParam = queryParam + (queryParam === '' ? ('?accredted=' + searchObj.accreditation) : '&accredted=' + searchObj.accreditation);

  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let config = {
    headers: {'uid': userInfo.user.uuid, speciality: userInfo.user.professionalData_specialty, isdelegate: userInfo.user.isdelegate}
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

      dispatch(setCursosInfo({
        bannerContent: bannerObj,
        courses: response.data['courseBox'] ? response.data['courseBox'] : [],
        searchParams: response.data['searchParams'] ? response.data['searchParams'] : {},
        totalCoursesCount: response.data['ce_length'] ? Number(response.data['ce_length']) : 1,
        activePageNo: response.data['page'] ? Number(response.data['page']) : 1,
        searchPanel: response.data['searchPanel'] ? response.data['searchPanel'] : []
      }));

    }).catch (error => {});
  };

}

export function sortCursos (sortBy, cursosObj) {
  cursosObj.sort(function(a, b) {
    if(sortBy === 'Popularidad') {
      return b['popularity'] - a['popularity'];
    } else if(sortBy === 'Nombre') {
      let eventA = a['courseTitle'].toLowerCase();
      let eventB = b['courseTitle'].toLowerCase();
      return eventA.localeCompare(eventB);
    } else if(sortBy === 'Fecha') {
      var dateA = new Date(a['startDate']);
      var dateB = new Date(b['startDate']);
      return dateB - dateA;
    }
  });

  return dispatch => {      
    dispatch(setCursosInfo({
      courses: cursosObj
    }));
  };
}

export function setFavCursos (uid, courseType, courseId) {
  let baseUrl = '/api/saveFav';
  let data = {
    uid: uid,
    type: courseType,
    type_id: courseId
  };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {
      /*if (res.data.stat === "ok") {
          dispatch(setAuthErrors({
              errors: {}
          }));
      } else {
          dispatch(setAuthErrors({
              errors: res.data.invalid_fields
          }));
      }*/
      dispatch(saveFavCursos({
        favCursos: response.data
      }));

    }).catch (error => {
      //return console.log(error)
    });
  };

}

export function getProfileCursosDetail (courseId) {
  let baseUrl = '/api/getsubcontent';
  let data = {
    content: courseId,
    mockSlug: 'profileCourse'
  };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {

      dispatch(setProfileCursosDetail({
        coursoDetailObj: response.data[0] ? response.data[0] : {}
      }));

    }).catch (error => {});
  };

}