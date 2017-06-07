import axios from "axios";
import {SET_CURSOS_TUTORIALS} from "../actions/types";

export function setCursosTutorialsInfo (content) {
  return {
    type: SET_CURSOS_TUTORIALS,
    content
  };
}

export function getCursosTutorialsInfo () {
  return dispatch => {
    return axios.get('/api/getcontent/CursosTutorials').then(response => {
      dispatch(setCursosTutorialsInfo({
        courseTutorials: response.data['columns']['contentleft']['contentTextOnly'] ? response.data['columns']['contentleft']['contentTextOnly'] : []
      }));

    }).catch (error => {});
  };

}
