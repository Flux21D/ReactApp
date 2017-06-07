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

export function cursosEvaluationResult (uid, courseId, percentage, status, credits, accredited) {
  let baseUrl = '/api/courseval';
  let data = {
            uid: uid,
            score: percentage,
            cid: courseId,
            status: status,
            credits: credits,
            accredited: accredited
        };

  return dispatch => {
    return axios.post(baseUrl, data).then(response => {
    }).catch (error => {});
  };

}
