import store from "./store";
import axios from "axios";
import {logout} from "../actions/auth";
export default (nextState, replace, callback) => {

  const state = store.getState();
  const accessToken = JSON.parse(sessionStorage.getItem('auth')) ? JSON.parse(sessionStorage.getItem('auth')).accessToken : null;
  const req = axios.get("/api/validate?AuthToken="+accessToken);
  //console.log("/api/validate?AuthToken= " + accessToken);
  req.then(resp => {
  	if(!resp.data.success)
  	{
  		replace('/');
  		callback();
      logout();
  	}
  	else
  	{
  		callback();
  	}
  	
  }).catch(err => {});
}