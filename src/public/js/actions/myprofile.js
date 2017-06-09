import axios from "axios";
import {SET_MY_PROFILE, SET_PROFILE_NOTIFICATION} from "../actions/types";

export function setProfileInfo (content) {
  return {
    type: SET_MY_PROFILE,
    content
  };
}

export function setProfileNotificationInfo (content) {
  return {
    type: SET_PROFILE_NOTIFICATION,
    content
  };
}

export function getProfileInfo () {
  let baseUrl = '/api/getprofileinfo';
  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let config = {
    headers: {'uid': userInfo.user.uuid, 'speciality': userInfo.user.professionalData_specialty}
  };

  return dispatch => {
    return axios.get(baseUrl, config).then(response => {
      var bannerObj = {};
      if(response.data.bannerSlider) {
        response.data.bannerSlider.map(function(item, index) {
          bannerObj.topBanner = item;
        });
      }

      dispatch(setProfileInfo({
        bannerContent: bannerObj,
        specialityCourses: response.data['specialityCourses'] ? response.data['specialityCourses'] : [],
        userCalender: response.data['userCalender'] ? response.data['userCalender'] : [],
        completedCourse: response.data['completedCourse'] ? response.data['completedCourse'] : [],
        ongoingEnrolled: response.data['ongoingEnrolled'] ? response.data['ongoingEnrolled'] : [],
        favCourse: response.data['favCourse'] ? response.data['favCourse'] : [],
        favTools: response.data['favTools'] ? response.data['favTools'] : [],
      }));

    }).catch (error => {});
  };

}

export function getProfileNotifications (pageNo) {
  let baseUrl = '/api/getnotifications';
  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let config = {
    headers: {'uid': userInfo.user.uuid}
  };
  let queryParam = '?page=' + pageNo;

  return dispatch => {
    return axios.get(baseUrl + queryParam, config).then(response => {

      dispatch(setProfileNotificationInfo({
        notifications: response.data['content'] ? response.data['content'] : [],
        totalRecords: response.data['n_length'] ? Number(response.data['n_length']) : 1,
        activePageNo: response.data['page'] ? Number(response.data['page']) : 1
      }));

    }).catch (error => {});
  };

}