import cookie from "react-cookie";

export default function showCookie (showCookie) {
  cookie.save('showCookie', showCookie, { path: '/' });
}

export function getCookie () {
  const showCookie = cookie.load("showCookie");
  return !(showCookie && showCookie === "false");
}