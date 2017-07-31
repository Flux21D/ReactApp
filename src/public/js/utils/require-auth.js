import store from "./store";
import axios from "axios";
import {logout} from "../actions/auth";
export default (nextState, replace, callback) => {

  const state = store.getState();
  const accessToken = JSON.parse(sessionStorage.getItem('auth')) ? JSON.parse(sessionStorage.getItem('auth')).accessToken : null;
  const req = axios.get("/api/validate?AuthToken="+accessToken);
  //console.log("/api/validate?AuthToken= " + accessToken);
  req.then((resp) => {
  	if (!resp.data.success)  	{
  		replace({ pathname: '/', query: { return_url: nextState.location.pathname } });
  		callback();
    if(janrain && janrain.capture.ui)
      janrain.capture.ui.endCaptureSession();
    logout();
  	}  	
    else if(sessionStorage.getItem('auth') && JSON.parse(sessionStorage.getItem('auth')).user.professionalContactData_emailAddress==='none'){
      //if not compared with myprofile then routing enters into loop.
      if(nextState.location.pathname !== "/myprofile")
        replace('/myprofile');
      callback();
    }
    else{
      callback();
    }
  	
  }).catch((err) => {
    console.log(err);
  });
}