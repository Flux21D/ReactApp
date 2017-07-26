import axios from "axios";

export const setValidate = (validate) => {
  return {
    type: 'CHECK_TOKEN',
    validate
  };
};

export const isTokenValid = () => {
  return dispatch => {
    const req = axios.get("/api/validate");

    req.then(resp => {
      dispatch(setValidate({validate: resp.data}));
    }).catch(err => {});

    return req;
  }
};