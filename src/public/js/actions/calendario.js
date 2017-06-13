import axios from "axios";
import {SET_CALENDARIO} from "../actions/types";

export function setCalendarioInfo (content) {
  return {
    type: SET_CALENDARIO,
    content
  };
}

export function getCalendarioInfo (pageNo, keyword, eventType, dateFrom, dateTo, city, country) {
  let baseUrl = '/api/getcontent/Calendar';
  let queryParam = '';
  if(pageNo)
    queryParam = queryParam + (queryParam === '' ? ('?page=' + pageNo) : '&page=' + pageNo);
  if(keyword)
    queryParam = queryParam + (queryParam === '' ? ('?keyword=' + keyword) : '&keyword=' + keyword);
  if(eventType)
    queryParam = queryParam + (queryParam === '' ? ('?eventType=' + eventType) : '&eventType=' + eventType);
  if(dateFrom)
    queryParam = queryParam + (queryParam === '' ? ('?startDate=' + dateFrom) : '&startDate=' + dateFrom);
  if(dateTo)
    queryParam = queryParam + (queryParam === '' ? ('?endDate=' + dateTo) : '&endDate=' + dateTo);
  if(city)
    queryParam = queryParam + (queryParam === '' ? ('?city=' + city) : '&city=' + city);
  if(country)
    queryParam = queryParam + (queryParam === '' ? ('?country=' + country) : '&country=' + country);

  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let config = {
    headers: {'uid': userInfo.user.uuid}
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

      dispatch(setCalendarioInfo({
        bannerContent: bannerObj,
        calendarEvents: response.data['eventBox'] ? response.data['eventBox'] : [],
        searchParams: response.data['searchParams'] ? response.data['searchParams'] : {},
        totalRecords: response.data['ce_length'] ? Number(response.data['ce_length']) : 1,
        activePageNo: response.data['page'] ? Number(response.data['page']) : 1
      }));

    }).catch (error => {});
  };
}

export function sortCalenderEvents (sortBy, calEvents) {
  calEvents.sort(function(a, b) {
    if(sortBy === 'Popularidad') {
      return b['popularity'] - a['popularity'];
    } else if(sortBy === 'Nombre') {
      let eventA = a['mainTitle'].toLowerCase();
      let eventB = b['mainTitle'].toLowerCase();
      return eventA.localeCompare(eventB);
    } else if(sortBy === 'Fecha') {
      var dateA = new Date(a['startDate']);
      var dateB = new Date(b['startDate']);
      return dateB - dateA;
    }
  });

  return dispatch => {      
      dispatch(setCalendarioInfo({
        calendarEvents: calEvents
      }));
  };
}

export function setFavEvents (uid, eventType, eventId) {
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