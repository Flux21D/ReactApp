import {HIDE_COOKIE} from "./types";
import showCookie from "../utils/cookie"

export default function hideCookie (cookie) {

  showCookie(cookie.showCookie);

  return {
    type: HIDE_COOKIE,
    cookie
  };

}