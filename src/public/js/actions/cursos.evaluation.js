import axios from "axios";
import {SET_CURSOS_EVALUATION} from "../actions/types";

export function setCursosEvaluationInfo (content) {
  return {
    type: SET_CURSOS_EVALUATION,
    content
  };
}

export function getCursosEvaluationInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/CursosEvaluation').then(response => {
      dispatch(setCursosEvaluationInfo({
        courseEvaluation: response.data['columns']['contentleft']['contentTextOnly'] ? response.data['columns']['contentleft']['contentTextOnly'] : [],
        questions: response.data['columns']['contentleft']['qchoices'] ? response.data['columns']['contentleft']['qchoices'] : []
      }));

    }).catch (error => {});
  };

}

export function cursosEvaluationResult (obj) {
  let baseUrl = '/api/courseval';
  let userInfo = JSON.parse(sessionStorage.getItem('auth'));
  let data = {
    uid: userInfo.user.uuid,
    score: obj.percentage,
    cid: obj.courseId,
    status: obj.status,
    credits: obj.credits,
    accredited: obj.accreditation,
    courseTitle: obj.courseTitle,
    toEmail: userInfo.user.professionalContactData_emailAddress
  };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {
    }).catch (error => {});
  };

}
